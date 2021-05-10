provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.region
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
  cidr_block = var.network_address_space
  tags       = merge(local.mandatory_tags, { Name = "${var.project_name}-VPC" })
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

  tags = local.mandatory_tags
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

  tags = local.mandatory_tags
}

resource "aws_security_group" "rds" {
  name        = "${lower(var.db_config.name)}_rds_sg"
  description = "Allow local MySQL (3306) traffic"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.vpc.cidr_block]
  }

  egress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.vpc.cidr_block]
  }

  tags = merge(local.mandatory_tags, { Name = "${lower(var.db_config.name)}_rds_sg" })
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
  name     = "${var.project_name}-alb-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id

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

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${lower(var.db_config.name)}_db_subnet_group"
  subnet_ids = aws_subnet.private_subnet.*.id

  tags = merge(local.mandatory_tags, { Name = "${var.db_config.name} DB Subnet Group" })
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
