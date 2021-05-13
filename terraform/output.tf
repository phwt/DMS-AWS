output "bastion_host_public_ip" {
  value = aws_instance.bastion_host.public_ip
}

output "ecr_url" {
  value = aws_ecr_repository.ecr.repository_url
}

output "alb_dns" {
  value = aws_lb.alb.dns_name
}
