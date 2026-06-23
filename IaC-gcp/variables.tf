variable "project_id" {
  description = "GCP Project ID tempat resource akan dibuat"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-southeast2" # Jakarta
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "asia-southeast2-a"
}

variable "project_name" {
  description = "Prefix nama untuk semua resource"
  type        = string
  default     = "k3s-single-node"
}

variable "vpc_cidr" {
  description = "CIDR block untuk subnet custom VPC"
  type        = string
  default     = "10.20.0.0/24"
}

variable "machine_type" {
  description = "Tipe machine GCE untuk node K3s"
  type        = string
  default     = "e2-medium" # 2 vCPU / 4GB RAM, cukup buat k3s + docker
}

variable "ssh_public_key_path" {
  description = "Path ke file public key SSH lokal (misal ~/.ssh/id_rsa.pub) untuk akses VM"
  type        = string
}

variable "ssh_user" {
  description = "Username untuk SSH ke VM"
  type        = string
  default     = "devops"
}

variable "allowed_ssh_cidr" {
  description = "CIDR yang diizinkan akses SSH (port 22). Sebaiknya diisi IP publik kamu sendiri, jangan 0.0.0.0/0 untuk production."
  type        = string
  default     = "0.0.0.0/0"
}

variable "k3s_version" {
  description = "Versi K3s yang akan diinstall (kosongkan untuk versi stable terbaru)"
  type        = string
  default     = "" # contoh: "v1.29.4+k3s1"
}

variable "boot_disk_size_gb" {
  description = "Ukuran boot disk dalam GB"
  type        = number
  default     = 30
}
