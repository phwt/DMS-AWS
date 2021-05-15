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
