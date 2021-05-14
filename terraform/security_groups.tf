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
    description      = "Allow all outgoing traffic"
    protocol         = "all"
    from_port        = 0
    to_port          = 0
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(local.mandatory_tags, { Name = "${lower(var.project_name)}_allow_http" })
}

resource "aws_security_group" "allow_https" {
  name        = "${lower(var.project_name)}_allow_https"
  description = "Allow HTTPS (443) traffic"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    description      = "HTTP"
    protocol         = "tcp"
    from_port        = 443
    to_port          = 443
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    description      = "Allow all outgoing traffic"
    protocol         = "all"
    from_port        = 0
    to_port          = 0
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(local.mandatory_tags, { Name = "${lower(var.project_name)}_allow_https" })
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

  tags = merge(local.mandatory_tags, { Name = "${lower(var.project_name)}_allow_ssh" })
}

// TODO: Allow only local traffic (VPC CIDR Block)
resource "aws_security_group" "mysql" {
  name        = "${lower(var.project_name)}_mysql_sg"
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

  tags = merge(local.mandatory_tags, { Name = "${lower(var.project_name)}_mysql_sg" })
}

resource "aws_security_group" "ecs" {
  name        = "${lower(var.project_name)}_ecs_sg"
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

  tags = merge(local.mandatory_tags, { Name = "${lower(var.project_name)}_ecs_sg" })
}