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
