# Vercel Deployment

## Target

Production must deploy from GitHub to Vercel without manual server setup.

## Checklist

- repository pushed to GitHub;
- Vercel project connected;
- framework detected as Next.js;
- environment variables configured;
- production DB reachable;
- migrations handled safely;
- build command passes;
- lint/type errors resolved;
- no secret committed.

## Environment example

```bash
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
```

Provider-specific variables can be added later.

## Preview deployments

Every pull request should be able to create a preview deployment when possible.

## Production rule

Do not use:
- SQLite production file;
- local upload folder as permanent storage;
- localhost service dependency.
