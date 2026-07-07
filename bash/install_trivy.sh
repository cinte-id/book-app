#!/bin/bash

set -e

echo "Installing Trivy..."

sudo apt-get update
sudo apt-get install -y wget gnupg lsb-release apt-transport-https

wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | \
sudo gpg --dearmor -o /usr/share/keyrings/trivy.gpg

echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | \
sudo tee /etc/apt/sources.list.d/trivy.list

sudo apt-get update
sudo apt-get install -y trivy

echo "Trivy Version:"
trivy --version
