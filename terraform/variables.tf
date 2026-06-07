variable "aws_region" {
  description = "Wilayah AWS untuk deploy resource"
  type        = string
  default     = "ap-southeast-3" # Singapore (paling dekat dengan Indonesia)
}

variable "instance_type" {
  description = "Tipe instance EC2 VM"
  type        = string
  default     = "t3.micro"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block yang diizinkan untuk SSH ke VM"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Default ke public untuk kebutuhan demo, bisa diubah di tfvars
}
