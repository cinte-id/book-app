output "instance_name" {
  description = "Nama instance GCE"
  value       = google_compute_instance.k3s_node.name
}

output "public_ip" {
  description = "IP publik VM (pakai ini untuk SSH dan akses K3s API)"
  value       = google_compute_instance.k3s_node.network_interface[0].access_config[0].nat_ip
}

output "private_ip" {
  description = "IP privat VM dalam VPC"
  value       = google_compute_instance.k3s_node.network_interface[0].network_ip
}

output "ssh_command" {
  description = "Command untuk SSH ke VM"
  value       = "ssh ${var.ssh_user}@${google_compute_instance.k3s_node.network_interface[0].access_config[0].nat_ip}"
}

output "get_kubeconfig_command" {
  description = "Command untuk copy kubeconfig ke laptop lokal"
  value       = "scp ${var.ssh_user}@${google_compute_instance.k3s_node.network_interface[0].access_config[0].nat_ip}:/home/${var.ssh_user}/k3s.yaml ./k3s.yaml"
}

output "vpc_name" {
  description = "Nama VPC yang dibuat"
  value       = google_compute_network.this.name
}
