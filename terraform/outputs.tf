output "elastic_ip" {
  description = "Elasitc IP"
  value       = aws_eip.web_eip.public_ip
}

output "ssh_command" {
  description = "SSH connect EC2"
  value       = "ssh -i ~/.ssh/book-app-key.pem ubuntu@${aws_eip.web_eip.public_ip}"
}

output "instance_id" {
  description = "ID EC2 Instance"
  value       = aws_instance.web_server.id
}