variable "project_name" {
  type    = string
  default = "DMS"
}
variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "private_key_path" {}
variable "key_name" {}
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
variable "cognito_config" {
  type = map(any)
}
variable "certificate_domain_name" {}
variable "certificate_subject_alternative_names" {}
variable "ecs_task_execution_role_arn" {}

locals {
  mandatory_tags = {
    itcourse = "cb21"
    itgroup  = "cb21group25"
  }
}
