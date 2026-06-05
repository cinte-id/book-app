# GitOps — ArgoCD Setup

ArgoCD watches the `k8s/` directory. Any commit to that path automatically syncs the cluster.

## Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=120s

# Get initial admin password
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d && echo
```

## Register the App

```bash
kubectl apply -f gitops/argocd-app.yml
```

ArgoCD will immediately sync all manifests from `k8s/` into the `book-app` namespace.

## Access ArgoCD UI

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Open: https://localhost:8080
# Login: admin / <password from above>
```

## How It Works

```
Git push to main
      │
      ▼
ArgoCD detects drift (polls every 3 min or via webhook)
      │
      ▼
Auto-sync: kubectl apply k8s/ manifests
      │
      ▼
Cluster matches Git state
```

- `prune: true` — resources deleted from Git are deleted from cluster
- `selfHeal: true` — manual `kubectl` edits are reverted automatically
- Git is the only source of truth
