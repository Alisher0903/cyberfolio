# Contributing to AlisherDev

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/my-site.git
cd my-site
```

### 2. Create a Branch

Use the branch naming convention:

```bash
# Feature
git checkout -b feat/amazing-feature

# Bug fix
git checkout -b fix/bug-name

# Documentation
git checkout -b docs/add-guide

# Performance
git checkout -b perf/optimize-something

# Testing
git checkout -b test/add-tests
```

### 3. Install and Validate

```bash
pnpm install
pnpm validate  # Run all checks
```

## Development Workflow

### Making Changes

1. **Write code** following the project style
2. **Run validation**:
   ```bash
   pnpm lint:fix      # Auto-fix lint issues
   pnpm format        # Format code
   pnpm type-check    # Check types
   ```
3. **Test locally**:
   ```bash
   pnpm dev           # Start dev server at localhost:3000
   ```

### Code Style

- **Formatting**: Prettier (auto-formatted on commit)
- **Linting**: ESLint with TypeScript support
- **Naming**:
  - Components: PascalCase (e.g., `MyComponent.tsx`)
  - Utilities: camelCase (e.g., `myUtil.ts`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_ITEMS`)

### TypeScript

- Use strict types (no `any` unless unavoidable)
- Add JSDoc for complex functions:

```typescript
/**
 * Calculates the sum of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 */
export function sum(a: number, b: number): number {
  return a + b;
}
```

### Component Guidelines

```typescript
// Good component structure
import React from 'react';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onClick,
}) => {
  return <div onClick={onClick}>{title}</div>;
};
```

## Committing Changes

We use **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting, semicolons, etc)
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Build, dependencies, tooling
- `ci:` CI/CD configuration

### Examples

```bash
# Feature
git commit -m "feat(hero): add animated background"

# Bug fix
git commit -m "fix(navbar): correct mobile menu alignment"

# Documentation
git commit -m "docs: update installation instructions"
```

### Commit Guidelines

- Keep commits atomic (one logical change per commit)
- Write clear commit messages
- Reference issues: `fixes #123` or `closes #456`

## Pull Request Process

### Before Submitting

- [ ] Runs locally without errors
- [ ] All tests pass: `pnpm validate`
- [ ] No console errors or warnings
- [ ] Code follows project style
- [ ] Documentation updated if needed

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Related Issues
Closes #123

## How to Test
Steps to test the changes

## Screenshots (if applicable)
Before/after screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes
```

### PR Guidelines

- Keep PRs focused (one feature per PR)
- Explain the "why" not just the "what"
- Link related issues
- Be responsive to feedback
- Force-push to keep history clean before merge

## Testing

### Running Tests

```bash
pnpm test          # Run all tests
pnpm test:watch   # Watch mode
pnpm test:coverage # Coverage report
```

### Writing Tests

- Test behavior, not implementation
- Use descriptive test names
- Keep tests focused
- Mock external dependencies

Example:

```typescript
describe('MyComponent', () => {
  it('should render with provided title', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeInTheDocument();
  });
});
```

## Documentation

- Update README for user-facing changes
- Add JSDoc comments for exported functions
- Update CHANGELOG for significant changes
- Include examples for complex features

## Performance Considerations

- Profile before optimizing
- Avoid unnecessary re-renders in React
- Lazy load components when appropriate
- Monitor bundle size

## Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML (`<button>` not `<div>` for buttons)
- Keyboard navigation support
- ARIA labels where needed

Example:

```typescript
<button
  aria-label="Close menu"
  onClick={onClose}
>
  ✕
</button>
```

## Git Workflow Summary

```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Make changes
# ... edit files ...

# 3. Validate and commit
pnpm validate
git add .
git commit -m "feat: describe the feature"

# 4. Push and create PR
git push origin feat/new-feature

# 5. Address review feedback
# ... make changes ...
git add .
git commit -m "refactor: address review comments"
git push origin feat/new-feature

# 6. Merge (after approval)
```

## Common Issues

### "Lint errors on commit"

Auto-fix them:
```bash
pnpm lint:fix
pnpm format
git add .
git commit -m "chore: fix linting issues"
```

### "Type errors"

Check types:
```bash
pnpm type-check
```

### "Commit message rejected"

Follow conventional commits format:
```bash
git commit -m "type(scope): message"
# Examples: "feat(navbar): add dark mode toggle"
```

## Need Help?

- **Questions?** Open a GitHub Discussion
- **Bug?** Open an Issue with details
- **Security?** Email info@alisherdev.uz
- **Feature Request?** Open an Issue with use case

## Recognition

Contributors are recognized in:
- Git commit history
- Project README (upon request)
- Release notes for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AlisherDev! 🚀
