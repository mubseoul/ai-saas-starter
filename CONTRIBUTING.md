# Contributing to AI SaaS Starter

First off, thank you for considering contributing to AI SaaS Starter! It's people like you that make this project such a great tool for the developer community.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible using our bug report template.

**Good bug reports include:**
- A clear and descriptive title
- Exact steps to reproduce the problem
- Expected vs. actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, use our feature request template and include:

- A clear and descriptive title
- A detailed description of the proposed feature
- The problem it solves
- Any alternatives you've considered
- Mockups or examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages** following our commit conventions
6. **Submit a pull request** using our PR template

## Development Setup

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- PostgreSQL database

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ai-saas-starter.git
cd ai-saas-starter

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with your credentials

# Set up database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Maintain strict type checking
- Avoid using `any` types
- Add proper JSDoc comments for public APIs

### Code Style

We use ESLint and Prettier to maintain code quality:

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_REQUESTS`)
- **Types/Interfaces**: PascalCase with descriptive names

### Component Structure

```typescript
// 1. Imports
import { useState } from "react";
import { ComponentProps } from "./types";

// 2. Types/Interfaces
interface Props extends ComponentProps {
  // ...
}

// 3. Component
export function MyComponent({ ...props }: Props) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return <div>...</div>;
}
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add Google OAuth support

fix(billing): resolve subscription update issue

docs(readme): update installation instructions
```

## Project Structure

```
ai-saas-starter/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-related pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── (marketing)/       # Public pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Auth components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility functions
├── prisma/              # Database schema
└── public/              # Static assets
```

## Testing

### Running Tests

```bash
# Run all tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for all new features
- Maintain existing test coverage
- Follow the AAA pattern (Arrange, Act, Assert)
- Use descriptive test names

## Documentation

### Code Documentation

- Add JSDoc comments for public functions
- Document complex logic with inline comments
- Update README.md for major changes
- Update relevant documentation files

### Documentation Files

- `README.md` - Project overview and quick start
- `docs/DEPLOYMENT.md` - Deployment instructions
- `docs/DATABASE.md` - Database management
- `docs/TESTING.md` - Testing guidelines
- `docs/EMAIL.md` - Email configuration

## What Should I Know Before I Get Started?

### Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication
- **Stripe** - Payment processing
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives

### Architecture Decisions

- We use **Server Components** by default
- Client Components marked with `"use client"`
- API routes follow RESTful conventions
- Database operations use Prisma
- Authentication uses JWT sessions

## Review Process

1. **Automated Checks**: PRs must pass all automated checks
2. **Code Review**: At least one maintainer review required
3. **Testing**: All tests must pass
4. **Documentation**: Documentation must be updated
5. **Conflict Resolution**: PRs must be rebased if needed

## Getting Help

- **Documentation**: Check our [docs](./docs) folder
- **Issues**: Search existing issues for solutions
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community (coming soon)

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project website (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask questions in GitHub Discussions or by opening an issue. We're here to help!

---

Thank you for contributing to AI SaaS Starter! 🚀
