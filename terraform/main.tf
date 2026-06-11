# 1. Mengambil default VPC yang sudah ada di akun AWS Anda
data "aws_vpc" "default" {
  default = true
}

# 2. Mengambil daftar subnet di default VPC tersebut
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# 3. Mengambil AMI (Amazon Machine Image) OS Ubuntu 22.04 LTS terbaru
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # ID milik Canonical (Pembuat Ubuntu)
}

# 4. Membuat Security Group (Firewall) untuk akses VM
resource "aws_security_group" "web_sg" {
  name        = "book-app-sg"
  description = "Allow HTTP, Backend, and SSH inbound traffic"
  vpc_id      = data.aws_vpc.default.id

  # Izinkan SSH (Port 22)
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr
  }

  # Izinkan HTTP (Port 80)
  ingress {
    description = "HTTP Web App"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Izinkan Port Backend Flask (Port 5000)
  ingress {
    description = "Flask API Backend"
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Izinkan Grafana (Port 3000)
  ingress {
    description = "Grafana Dashboard"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Izinkan Prometheus (Port 9090)
  # akan dibatasi jika ada vpn atau private network di production
  ingress {
    description = "Prometheus"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Izinkan Node Exporter (Port 9100) - metrics sistem EC2
  # akan dibatasi jika ada vpn atau private network di production
  ingress {
    description = "Node Exporter Metrics"
    from_port   = 9100
    to_port     = 9100
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound Rules (Izinkan VM melakukan koneksi keluar untuk download library/update)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "book-app-sg"
    Environment = "Dev"
    Project     = "book-app"
    ManagedBy   = "Terraform"
  }
}

# 5. Membuat Private Key & Key Pair AWS secara otomatis
# PERINGATAN KEAMANAN: Membuat private key dengan tls_private_key menyebabkan private key tersimpan 
# dalam plain-text di file state (.tfstate) lokal. Untuk lingkungan production, disarankan untuk 
# membuat key pair secara eksternal (misal lewat ssh-keygen) dan hanya memasukkan public key-nya ke Terraform.
resource "tls_private_key" "my_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = "book-app-key"
  public_key = tls_private_key.my_key.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = pathexpand("~/.ssh/book-app-key.pem")
  content         = tls_private_key.my_key.private_key_pem
  file_permission = "0400"
}

# 6. Membuat EC2 Instance (VM)
resource "aws_instance" "web_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.generated_key.key_name
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  # User Data: Script otomatis untuk menginstall Docker saat VM pertama kali menyala
  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io docker-compose
              systemctl start docker
              systemctl enable docker
              
              # Catatan DevOps: Di production, langkah selanjutnya adalah otomatis melakukan
              # deployment aplikasi dengan meng-clone repo dan menjalankan docker-compose:
              # git clone https://github.com/EvoVincere/book-app.git /home/ubuntu/app
              # cd /home/ubuntu/app && docker-compose -f docker-compose.prod.yml up -d
              EOF
   tags = {
      Name        = "book-app-vm"
      Environment = "Dev"
      Project     = "book-app"
      ManagedBy   = "Terraform"
  }
}  

# 7. Membuat Elastic IP (IP Publik Statis)
resource "aws_eip" "web_eip" {
  domain = "vpc"

  tags = {
    Name        = "book-app-eip"
    Environment = "Dev"
    Project     = "book-app"
    ManagedBy   = "Terraform"
  }
}

# 8. Menghubungkan Elastic IP ke EC2 Instance
resource "aws_eip_association" "web_eip_assoc" {
  instance_id   = aws_instance.web_server.id
  allocation_id = aws_eip.web_eip.id
}

 

