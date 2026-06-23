# ============================================
# Custom VPC (bukan default VPC, biar lebih terkontrol)
# ============================================
resource "google_compute_network" "this" {
  name                    = "${var.project_name}-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

# ============================================
# Subnet
# ============================================
resource "google_compute_subnetwork" "public" {
  name          = "${var.project_name}-subnet"
  ip_cidr_range = var.vpc_cidr
  region        = var.region
  network       = google_compute_network.this.id

  # Berguna kalau nanti mau aktifkan GKE/VPC-native, opsional untuk single VM
  private_ip_google_access = true
}

# ============================================
# Cloud Router + NAT
# Catatan: VM tetap dikasih IP publik (access_config) supaya simpel diakses langsung,
# tapi NAT disiapkan juga sebagai fallback kalau suatu saat IP publik dilepas.
# ============================================
resource "google_compute_router" "this" {
  name    = "${var.project_name}-router"
  region  = var.region
  network = google_compute_network.this.id
}

resource "google_compute_router_nat" "this" {
  name                               = "${var.project_name}-nat"
  router                             = google_compute_router.this.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}
