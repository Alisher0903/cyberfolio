# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not** open a public issue. Instead, please email security concerns to `info@alisherdev.uz` with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if available)

We will acknowledge receipt of your report within 48 hours and provide updates on our progress every 7 days.

## Security Practices

This project implements the following security measures:

### Code Security

- ✅ **Strict TypeScript**: Full strict mode enabled
- ✅ **No Inline Scripts**: All scripts are external (except safe JSON-LD)
- ✅ **Input Validation**: All user inputs are validated
- ✅ **No Sensitive Data**: Credentials never committed to repo
- ✅ **Dependency Scanning**: Regular updates and audits

### Authentication & Authorization

- Users cannot execute arbitrary code
- No authentication backend (static site)
- All client-side interactions are safe

### Content Security Policy

The site is configured to be CSP-friendly:

```
- No unsafe-inline scripts
- No eval() or related functions
- External resources from trusted sources only
```

### Dependencies

- All dependencies are from npm registry
- `pnpm audit` run regularly
- Lock file committed to prevent version drift
- Known vulnerabilities are addressed promptly

### Environment Variables

- Never commit `.env` files
- Use `.env.example` as template
- Sensitive credentials stored in `.env.local` (gitignored)
- All public keys prefixed with `NEXT_PUBLIC_`

### Data Privacy

- No user data is collected
- No cookies set except session (if applicable)
- No third-party tracking (unless explicitly enabled)
- GDPR compliant

## Security Headers

Recommended security headers for production:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Development Security

### Pre-commit Checks

- ESLint ensures no insecure patterns
- Prettier maintains code consistency
- TypeScript catches type errors
- Commitlint validates commit messages

### Testing

- Unit tests for critical functions
- Integration tests for API endpoints
- Security-focused tests for sensitive features

## Deployment Security

### Vercel Deployment

- Automatic HTTPS
- DDoS protection
- WAF (Web Application Firewall)
- Automatic SSL certificates

### Environment Variables

- Never log sensitive data
- Use Vercel's encrypted environment variables
- Rotate secrets regularly

## Third-Party Services

Review the `package.json` for all dependencies:

- GSAP - Animation library (reputable, security-conscious)
- Next.js - Web framework (actively maintained)
- Tailwind CSS - CSS framework (safe utility CSS)
- Zustand - State management (minimal, secure)

All dependencies are regularly audited with `pnpm audit`.

## Vulnerability Disclosure Timeline

1. **Initial Report**: Acknowledged within 48 hours
2. **Investigation**: 5-7 days
3. **Patch Development**: 7-14 days
4. **Testing**: 3-5 days
5. **Release**: Coordinated timing

## Security Updates

Subscribe to updates:

- GitHub Watch: Get notified of security releases
- npm: Run `npm audit` regularly
- Dependabot: Automated dependency updates

## Compliance

This project adheres to:

- OWASP Top 10 prevention practices
- WCAG 2.1 accessibility standards
- Data protection regulations (GDPR-ready)
- Node.js security best practices

## Questions?

For security-related questions (non-vulnerability), open a GitHub Discussion or email `hello@karimov.dev`.

---

Last Updated: 2026-06-17
