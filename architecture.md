# dev-cdn Architecture

## Structure Map

```text
dev-cdn
|-- fonts/           -> canonical font assets
|-- font/            -> compatibility font path
|-- styles/          -> canonical stylesheet assets
|-- style/           -> compatibility style path
`-- package.json     -> package metadata
```

## Flow Map

```text
Asset source file
  -> stored in canonical fonts/ or styles/
  -> mirrored by compatibility path when needed
  -> consumed by downstream projects
```

## Boundaries

- Asset folders are the maintained source surface.
- Compatibility folders preserve existing consumers.
- Hosting and CDN rollout are downstream concerns.