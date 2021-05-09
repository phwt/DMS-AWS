output "bastion_host_public_ip" {
  value = aws_instance.bastion_host.public_ip
}

output "rds_cluster_writer_endpoint" {
  value = aws_rds_cluster.postgresql.endpoint
}

output "rds_cluster_reader_endpoint" {
  value = aws_rds_cluster.postgresql.reader_endpoint
}