# S3 #

resource "aws_s3_bucket" "document" {
  bucket = "${lower(var.project_name)}-document-storage"
  tags   = local.mandatory_tags
}
