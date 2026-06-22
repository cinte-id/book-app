# ============================================
# Firewall - SSH
# ============================================
resource "google_compute_firewall" "allow_ssh" {
  name    = "${var.project_name}-allow-ssh"
  network = google_compute_network.this.id

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = [var.allowed_ssh_cidr]
  target_tags   = ["k3s-node"]
}

# ============================================
# Firewall - Kubernetes API Server
# ============================================
resource "google_compute_firewall" "allow_k8s_api" {
  name    = "${var.project_name}-allow-k8s-api"
  network = google_compute_network.this.id

  allow {
    protocol = "tcp"
    ports    = ["6443"]
  }

  source_ranges = [var.allowed_ssh_cidr]
  target_tags   = ["k3s-node"]
}

# ============================================
# Firewall - HTTP/HTTPS (untuk ingress/aplikasi)
# ============================================
resource "google_compute_firewall" "allow_http_https" {
  name    = "${var.project_name}-allow-http-https"
  network = google_compute_network.this.id

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["k3s-node"]
}

# ============================================
# Firewall - NodePort range
# ============================================
resource "google_compute_firewall" "allow_nodeport" {
  name    = "${var.project_name}-allow-nodeport"
  network = google_compute_network.this.id

  allow {
    protocol = "tcp"
    ports    = ["30000-32767"]
  }

  source_ranges = [var.allowed_ssh_cidr]
  target_tags   = ["k3s-node"]
}

# ============================================
# Firewall - Internal traffic dalam VPC (antar pod/service kalau scale)
# ============================================
resource "google_compute_firewall" "allow_internal" {
  name    = "${var.project_name}-allow-internal"
  network = google_compute_network.this.id

  allow {
    protocol = "tcp"
  }
  allow {
    protocol = "udp"
  }
  allow {
    protocol = "icmp"
  }

  source_ranges = [var.vpc_cidr]
  target_tags   = ["k3s-node"]
}

