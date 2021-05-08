variable "project_name" {
  type    = string
  default = "DMS"
}
variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "region" {
  default = "ap-southeast-1"
}
variable "network_address_space" {
  type    = string
  default = "10.25.0.0/16"
}
variable "db_config" {
  type = map(string)
}

locals {
  mandatory_tags = {
    itcourse = "cb21"
    itgroup  = "cb21group25"
  }
}
