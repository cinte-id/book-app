# ============================================
# Render init script dari template
# ============================================
locals {
  startup_script = templatefile("${path.module}/scripts/init.sh.tpl", {
    k3s_version = var.k3s_version
    ssh_user    = var.ssh_user
  })
}

# ============================================
# GCE Instance
# ============================================
resource "google_compute_instance" "k3s_node" {
  name         = "${var.project_name}-vm"
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["k3s-node"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = var.boot_disk_size_gb
      type  = "pd-balanced"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.public.id

    access_config {
      # Block kosong = otomatis dapat ephemeral public IP
    }
  }

  metadata = {
    ssh-keys       = "${var.ssh_user}:${file(var.ssh_public_key_path)}"
    startup-script = local.startup_script
  }

  # Field standar GCE, perlu hint diisi true supaya VM bisa di-restart kalau live migration gagal
  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
  }

  allow_stopping_for_update = true
}
