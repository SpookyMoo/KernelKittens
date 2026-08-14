# Kernel Kittens Azure Container Edge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the public Kernel Kittens domains on a scale-to-zero Azure Container Apps edge with a $50 monthly budget.

**Architecture:** GitHub Actions continues deploying the exact tested artifact to Static Web Apps. A pinned official Caddy container proxies the public domains to that origin without caching. Porkbun remains authoritative and Azure manages TLS.

**Tech Stack:** GitHub Actions, Azure Static Web Apps, Azure Container Apps Consumption, Caddy 2.10.2, Porkbun DNS

## Global Constraints

- Keep GitHub Pages live until the Azure edge and origin pass direct checks.
- Use minimum replicas 0, maximum replicas 2, 0.25 vCPU, and 0.5 GiB memory.
- Store no logs and create no custom container image.
- Set a $50 monthly budget with alerts at 50, 80, and 100 percent.
- Back up DNS and preserve unrelated records.
- Verify all routes, headers, redirects, TLS, and live accessibility before completion.

---

### Task 1: Resource group and cost guard

**Files:**
- External: Azure resource group and budget

- [ ] Create `rg-kernel-kittens-edge-prod` in West US 2 with project and environment tags.
- [ ] Create budget `kernel-kittens-edge-monthly-50` scoped to the resource group.
- [ ] Verify the amount, monthly period, contact email, and all three enabled alerts.

### Task 2: Scale-to-zero Caddy edge

**Files:**
- External: Azure Container Apps environment and app

- [ ] Create `cae-kernel-kittens-prod` with consumption workload profiles and no log destination.
- [ ] Create `ca-kernel-kittens-edge` from `caddy:2.10.2-alpine` with external ingress on port 8080.
- [ ] Run `caddy reverse-proxy --from :8080 --to https://ashy-rock-0ceff091e.7.azurestaticapps.net --change-host-header`.
- [ ] Verify min replicas 0, max replicas 2, CPU 0.25, memory 0.5 GiB, and no diagnostics destination.
- [ ] Verify every route, redirect, security header, and page marker on the generated hostname.

### Task 3: Custom domains and recoverable DNS cutover

**Files:**
- External: Container Apps custom domains and Porkbun DNS
- External: `C:\Users\Owner\backups\porkbun`

- [ ] Retrieve and save the current Porkbun zone outside Git.
- [ ] Add the Azure ownership TXT records without changing traffic.
- [ ] Replace only the GitHub Pages apex A and AAAA records and `www` CNAME.
- [ ] Bind free Azure-managed certificates for the apex and `www`.
- [ ] Verify authoritative and public DNS, both HTTPS names, all routes, redirects, and security headers.
- [ ] Recheck after a short delay and restore the backup automatically if the release regresses.

### Task 4: Accessibility and durable handoff

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/deployment.md`
- Modify: `C:\Users\Owner\Documents\note\NotesMain\Notes\Projects\Kernel Kittens.md`
- Modify: current Obsidian session note

- [ ] Run live accessibility audits on `/`, `/results/`, `/writeups/`, and `/accessibility/`.
- [ ] Update project guidance and deployment documentation with the tested commit, workflow run, edge resources, budget, DNS, and rollback path.
- [ ] Commit and push the documentation through a normal pull request.
- [ ] Verify the follow-up main workflow and public domain remain healthy.
