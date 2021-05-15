output "bastion_host_public_ip" {
  value = aws_instance.bastion_host.public_ip
}

output "ecr_url" {
  value = aws_ecr_repository.ecr.repository_url
}

output "alb_dns" {
  value = aws_lb.alb.dns_name
}

output "mysql_endpoint" {
  value = aws_db_instance.mysql.endpoint
}

output "s3_document_bucket_domain" {
  value = aws_s3_bucket.document.bucket_regional_domain_name
}

output "s3_fs_bucket_domain" {
  value = aws_s3_bucket.fs.bucket_regional_domain_name
}