provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.region
}

terraform {
  backend "s3" {
    bucket = "dms-fs"
    key    = "dms.tfstate"
    region = "ap-southeast-1"
  }
}

# DATA #

data "aws_availability_zones" "available" {}

data "aws_ami" "aws-linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm*"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# NETWORKING #

resource "aws_vpc" "vpc" {
  cidr_block           = var.network_address_space
  enable_dns_hostnames = true
  tags                 = merge(local.mandatory_tags, { Name = "${var.project_name}-VPC" })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags   = merge(local.mandatory_tags, { Name = "${var.project_name}-IGW" })
}

resource "aws_subnet" "public_subnet" {
  count                   = 2
  cidr_block              = cidrsubnet(var.network_address_space, 8, count.index)
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]

  tags = merge(local.mandatory_tags, { Name = "${var.project_name} Public Subnet - ${data.aws_availability_zones.available.names[count.index]}" })
}

resource "aws_subnet" "private_subnet" {
  count             = 2
  cidr_block        = cidrsubnet(var.network_address_space, 8, (count.index + 2))
  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = merge(local.mandatory_tags, { Name = "${var.project_name} Private Subnet - ${data.aws_availability_zones.available.names[count.index]}" })
}

# NAT GATEWAY #

resource "aws_eip" "nat" {
  tags = local.mandatory_tags
}

resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_subnet[0].id

  tags = merge(local.mandatory_tags, { Name = "${var.project_name}-nat-gw" })
}

# ROUTING #

resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = merge(local.mandatory_tags, { Name = "${var.project_name}-public-rtb" })
}

resource "aws_route_table" "private_rtb" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat_gw.id
  }

  tags = merge(local.mandatory_tags, { Name = "${var.project_name}-private-rtb" })
}

resource "aws_route_table_association" "public-rta-subnet" {
  count          = 2
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_rtb.id
}

resource "aws_route_table_association" "private-rta-subnet" {
  count          = 2
  subnet_id      = aws_subnet.private_subnet[count.index].id
  route_table_id = aws_route_table.private_rtb.id
}

# SECURITY GROUPS #

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow HTTP (80) traffic"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    description      = "HTTP"
    protocol         = "tcp"
    from_port        = 80
    to_port          = 80
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    description      = "Accept all incoming traffic"
    protocol         = "all"
    from_port        = 0
    to_port          = 0
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(local.mandatory_tags, { Name = "${lower(var.db_config.name)}_allow_http" })
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH (22) traffic"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.mandatory_tags, { Name = "${lower(var.db_config.name)}_allow_ssh" })
}

// TODO: Allow only local traffic (VPC CIDR Block)
resource "aws_security_group" "mysql" {
  name        = "${lower(var.db_config.name)}_mysql_sg"
  description = "Allow local MySQL (3306) traffic"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.mandatory_tags, { Name = "${lower(var.db_config.name)}_mysql_sg" })
}

resource "aws_security_group" "ecs" {
  name        = "${lower(var.db_config.name)}_ecs_sg"
  description = "Allow local 3000 traffic"
  vpc_id      = aws_vpc.vpc.id

  // TODO: Allow only 3000
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.mandatory_tags, { Name = "${lower(var.db_config.name)}_ecs_sg" })
}

# LOAD BALANCING #

resource "aws_lb" "alb" {
  name               = "${var.project_name}-ALB"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow_http.id]
  subnets            = aws_subnet.public_subnet.*.id

  tags = local.mandatory_tags
}

resource "aws_lb_target_group" "target_group" {
  name        = "${var.project_name}-alb-tg"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id

  health_check {
    protocol            = "HTTP"
    path                = "/api/health-check"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  tags = local.mandatory_tags
}


resource "aws_lb_listener" "alb_listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

# DATABASE #

resource "aws_kms_key" "rds" {
  description         = "Default master key that protects my RDS database volumes when no other key is defined"
  enable_key_rotation = true
  policy = jsonencode({
    "Id" : "auto-rds-2",
    "Statement" : [
      {
        "Action" : [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:CreateGrant",
          "kms:ListGrants",
          "kms:DescribeKey"
        ],
        "Condition" : {
          "StringEquals" : {
            "kms:CallerAccount" : "372159798727",
            "kms:ViaService" : "rds.ap-southeast-1.amazonaws.com"
          }
        },
        "Effect" : "Allow",
        "Principal" : { "AWS" : "*" },
        "Resource" : "*",
        "Sid" : "Allow access through RDS for all principals in the account that are authorized to use RDS"
      },
      {
        "Action" : ["kms:Describe*", "kms:Get*", "kms:List*", "kms:RevokeGrant"],
        "Effect" : "Allow",
        "Principal" : { "AWS" : "arn:aws:iam::372159798727:root" },
        "Resource" : "*",
        "Sid" : "Allow direct access to key metadata to the account"
      }
    ],
    "Version" : "2012-10-17"
    }
  )
}

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${lower(var.db_config.name)}_db_subnet_group"
  subnet_ids = aws_subnet.private_subnet.*.id

  tags = merge(local.mandatory_tags, { Name = "${var.db_config.name} DB Subnet Group" })
}

resource "aws_db_instance" "mysql" {
  instance_class             = "db.t3.micro"
  option_group_name          = "default:mysql-8-0"
  parameter_group_name       = "default.mysql8.0"
  ca_cert_identifier         = "rds-ca-2019"
  auto_minor_version_upgrade = false

  allocated_storage     = 20
  max_allocated_storage = 1000
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.rds.id
  storage_type          = "gp2"


  availability_zone      = data.aws_availability_zones.available.names[0]
  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.mysql.id]
  publicly_accessible    = false
  port                   = 3306

  username = var.db_config.username
  password = var.db_config.password

  backup_retention_period = 0
  backup_window           = "17:34-18:04"
  copy_tags_to_snapshot   = true
  deletion_protection     = true
  skip_final_snapshot     = true

  tags = local.mandatory_tags
}

# COMPUTE #

resource "aws_instance" "bastion_host" {
  ami                    = data.aws_ami.aws-linux.id
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]
  subnet_id              = aws_subnet.public_subnet[0].id

  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ec2-user"
    private_key = file(var.private_key_path)
  }

  tags = merge(local.mandatory_tags, { Name = "${var.project_name} Bastion Host" })
}

# CONTAINERS #

resource "aws_ecr_repository" "ecr" {
  name                 = "dms-ecr"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.mandatory_tags
}

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "dms-cluster"
  tags = local.mandatory_tags
}

resource "aws_ecs_task_definition" "service" {
  family                   = "dms-task"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  network_mode             = "awsvpc"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      "name" : "dms",
      "image" : "372159798727.dkr.ecr.ap-southeast-1.amazonaws.com/dms-ecr:latest",
      "cpu" : 0,
      "portMappings" : [
        {
          "containerPort" : 3306,
          "hostPort" : 3306,
          "protocol" : "tcp"
        },
        {
          "containerPort" : 3000,
          "hostPort" : 3000,
          "protocol" : "tcp"
        }
      ],
      "essential" : true,
      "environment" : [],
      "mountPoints" : [],
      "volumesFrom" : [],
      "logConfiguration" : {
        "logDriver" : "awslogs",
        "options" : {
          "awslogs-group" : "/ecs/dms-ecs-task",
          "awslogs-region" : "ap-southeast-1",
          "awslogs-stream-prefix" : "ecs"
        }
      }
    }
  ])

  tags = local.mandatory_tags
}

resource "aws_ecs_service" "next" {
  name                    = "dms-service"
  cluster                 = aws_ecs_cluster.ecs_cluster.id
  desired_count           = 2
  enable_ecs_managed_tags = true
  iam_role                = "aws-service-role"
  launch_type             = "FARGATE"
  platform_version        = "LATEST"
  propagate_tags          = "TASK_DEFINITION"
  scheduling_strategy     = "REPLICA"
  task_definition         = aws_ecs_task_definition.service.arn

  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs.id]
    subnets          = aws_subnet.private_subnet.*.id
  }

  load_balancer {
    container_name   = "dms"
    container_port   = 3000
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

# S3 #

resource "aws_s3_bucket" "document" {
  bucket = "${lower(var.project_name)}-document-storage"
  tags   = local.mandatory_tags
}

resource "aws_s3_bucket" "fs" {
  bucket = "${lower(var.project_name)}-fs"
  tags   = local.mandatory_tags
}
