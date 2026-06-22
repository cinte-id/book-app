#!/bin/bash
set -euxo pipefail

# ============================================
# Log semua output ke file, biar gampang debug via SSH nanti
# ============================================
exec > >(tee /var/log/startup-script.log) 2>&1

echo ">>> Update package list & upgrade OS"
apt-get update -y
apt-get upgrade -y

echo ">>> Install dependency dasar"
apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  apt-transport-https \
  software-properties-common

# ============================================
# Install Docker
# ============================================
echo ">>> Install Docker Engine"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker
systemctl start docker

# Supaya user SSH bisa jalankan docker tanpa sudo
usermod -aG docker ${ssh_user} || true

echo ">>> Docker version:"
docker --version

# ============================================
# Install K3s (single-node)
# ============================================
echo ">>> Install K3s"

K3S_VERSION="${k3s_version}"
PUBLIC_IP=$(curl -s -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip")

# Pasang --node-external-ip supaya kubeconfig bisa diakses dari luar via IP publik
if [ -n "$K3S_VERSION" ]; then
  curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="$K3S_VERSION" sh -s - server \
    --write-kubeconfig-mode 644 \
    --node-external-ip "$PUBLIC_IP" \
    --tls-san "$PUBLIC_IP"
else
  curl -sfL https://get.k3s.io | sh -s - server \
    --write-kubeconfig-mode 644 \
    --node-external-ip "$PUBLIC_IP" \
    --tls-san "$PUBLIC_IP"
fi

echo ">>> Tunggu K3s siap..."
until kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get nodes >/dev/null 2>&1; do
  sleep 5
done

echo ">>> K3s sudah jalan:"
kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get nodes -o wide

# Salin kubeconfig dengan IP publik supaya bisa langsung dipakai dari laptop
sed "s/127.0.0.1/$PUBLIC_IP/g" /etc/rancher/k3s/k3s.yaml > /home/${ssh_user}/k3s.yaml
chown ${ssh_user}:${ssh_user} /home/${ssh_user}/k3s.yaml
chmod 600 /home/${ssh_user}/k3s.yaml

echo ">>> Provisioning selesai. Kubeconfig tersedia di /home/${ssh_user}/k3s.yaml"
