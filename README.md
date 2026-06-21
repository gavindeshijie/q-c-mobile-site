# Q-C Mobile Website

Mobile-first company homepage for `q-c.hk`.

## Stack

- Next.js 16.2.9
- React 19.2.7
- Tailwind CSS 4.3.1
- TypeScript
- Framer Motion 12.40.0
- Lucide React 1.21.0

## Local Development

```bash
npm install
npm run dev
```

Open the local URL shown by Next.js. If the default port is busy, Next.js will choose another port.

## Content Editing

Most replaceable homepage content lives in:

```text
src/data/siteContent.ts
```

Main components:

```text
src/components/Header.tsx
src/components/Hero3D.tsx
src/components/BusinessCards.tsx
src/components/CapabilitySection.tsx
src/components/ProcessSection.tsx
src/components/CTASection.tsx
src/components/Footer.tsx
```

Hero asset:

```text
public/images/hero-abstract-3d.png
```

## Deploy To Vercel

```bash
npm run build
npx vercel
npx vercel --prod
```

After the Vercel project is created, add `q-c.hk` in Vercel Project Settings -> Domains.

Current production URL:

```text
https://q-c-hk.vercel.app
```

Recommended DNS records from Vercel for the current DNS provider:

```text
Type: A
Name: @
Value: 76.76.21.21

Type: A
Name: www
Value: 76.76.21.21
```

If Vercel asks for a verification TXT record, add the exact TXT record shown in the Vercel domain screen.

Alternative: change the domain nameservers to Vercel:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```
