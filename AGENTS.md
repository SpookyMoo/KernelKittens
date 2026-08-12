# Kernel Kittens project guidance

## Public content boundary

- Treat every file in this repository as deployable public content, even while the source remote is private.
- Never add embargoed challenge text, flags, private draft markers, personal identities, credential IDs, or local archive paths.
- A write-up needs `status: public` and a specific `publicationBasis` before it can generate a route.
- Attribute the 2026 Cyber Apocalypse result to the prior team `1337_PwnSp4c3`.
- Label expired credentials as expired. Do not imply that they are active.

## Copy and interface

- Use plain, direct language. Do not use em dashes, en dashes, smart quotes, corporate filler, or generic security hype.
- Keep the primary navigation visible without client-side JavaScript.
- Every page needs an obvious route home, visible keyboard focus, and one `main` landmark.
- Do not add analytics, cookies, remote fonts, forms, or third-party scripts without a new privacy and security review.

## Required release checks

Run `npm test`, `npm audit`, and `git diff --check`. Inspect desktop and 320-pixel mobile screenshots before deployment. Critical or serious accessibility findings block release.
