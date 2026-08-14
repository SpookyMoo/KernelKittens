# Kernel Kittens Azure Container Edge Design

## Goal

Serve `kernelkittens.team` and `www.kernelkittens.team` from Azure even though the existing Static Web Apps custom-domain bindings are stuck in failed platform state.

## Decision

Adopt the official pinned `caddy:2.10.2-alpine` image in Azure Container Apps. It proxies requests to the verified Static Web Apps origin and changes the upstream Host header to that Azure hostname. No custom application or image build is needed.

## Azure resources

- Resource group: `rg-kernel-kittens-edge-prod`
- Consumption environment: `cae-kernel-kittens-prod` in West US 2
- Container app: `ca-kernel-kittens-edge`
- Minimum replicas: 0
- Maximum replicas: 2
- Container size: 0.25 vCPU and 0.5 GiB memory
- Log destination: none
- Monthly resource-group budget: $50 USD
- Budget alerts: 50, 80, and 100 percent to `moosucow@gmail.com`

Azure budgets alert but do not stop resources. Scale-to-zero, the two-replica cap, and the small container size are the actual usage controls.

## Domain cutover

Keep GitHub Pages live until the Container Apps generated hostname returns the complete site with the existing security headers. Back up the live Porkbun zone before changing it.

For the apex, create the Container Apps ownership TXT record and replace the GitHub Pages A and AAAA records with the environment static IP. For `www`, create its ownership TXT record and replace the GitHub Pages CNAME with the generated Container Apps hostname. Bind free Azure-managed certificates only after DNS resolves to the new edge.

The Caddy proxy does not cache responses. A successful GitHub main workflow updates Static Web Apps in about two minutes, and the public domain reads the new origin immediately afterward.

## Failure and rollback

- Do not change DNS before the generated Container Apps hostname passes route and header checks.
- Preserve every unrelated Porkbun record.
- If DNS, certificates, routes, or accessibility regress, restore the exact pre-cutover record set.
- The verified Static Web Apps origin remains the deployment target and rollback source.
- Critical or serious accessibility findings block completion.
