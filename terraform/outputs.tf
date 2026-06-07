output "public_ip" {
  description = "IP Publik dari EC2 Instance"
  value       = aws_instance.web_server.public_ip
}

output "public_dns" {
  description = "DNS Publik dari EC2 Instance"
  value       = aws_instance.web_server.public_dns
}

output "ssh_command" {
  description = "Perintah untuk melakukan SSH ke VM"
  value       = "ssh -i ~/.ssh/book-app-key.pem ubuntu@${aws_instance.web_server.public_ip}"
}
