# S3 #

resource "aws_s3_bucket" "document" {
  bucket = "${lower(var.project_name)}-document-storage"
  tags   = local.mandatory_tags
}

resource "aws_s3_bucket" "fs" {
  bucket = "${lower(var.project_name)}-fs"
  tags   = local.mandatory_tags
}
