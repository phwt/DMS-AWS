resource "aws_acm_certificate" "ssl" {
  domain_name               = var.certificate_domain_name
  subject_alternative_names = var.certificate_subject_alternative_names
  validation_method         = "EMAIL"

  tags = local.mandatory_tags
}
