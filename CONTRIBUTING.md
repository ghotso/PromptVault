---
hidden: true
---

# Contributing to PromptVault

Thank you for your interest in contributing to PromptVault! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

We welcome contributions from the community! Here are some ways you can help:

* 🐛 **Report bugs** by creating an issue
* 💡 **Suggest new features** through discussions or issues
* 📝 **Improve documentation** by submitting pull requests
* 🔧 **Fix bugs** or implement features
* 🎨 **Improve the UI/UX** with design suggestions or code
* 🧪 **Write tests** to improve code quality
* 🌍 **Translate** the application to other languages

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm or yarn
* Git
* Basic knowledge of React, TypeScript, and Node.js

### Development Setup

1.  **Fork and clone the repository**

    ```bash
    git clone https://github.com/yourusername/PromptVault.git
    cd PromptVault
    ```
2.  **Install dependencies**

    ```bash
    npm install
    cd frontend && npm install
    cd ../backend && npm install
    ```
3.  **Set up environment variables**

    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```
4.  **Set up the database**

    ```bash
    cd backend
    npx prisma migrate dev
    npx prisma generate
    ```
5.  **Start development servers**

    ```bash
    # Terminal 1 - Backend
    npm run dev

    # Terminal 2 - Frontend
    cd ../frontend
    npm run dev
    ```

## 📋 Development Guidelines

### Code Style

* **TypeScript**: Use strict mode and proper typing
* **ESLint**: Follow the project's ESLint configuration
* **Prettier**: Use the project's Prettier configuration
* **Naming**: Use descriptive names for variables, functions, and files

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(auth): add OAuth2 support
fix(ui): resolve modal positioning issue
docs(readme): update installation instructions
style(components): improve button hover effects
refactor(api): simplify user creation logic
test(auth): add login validation tests
chore(deps): update dependencies
```

### Pull Request Process

1.  **Create a feature branch**

    ```bash
    git checkout -b feature/your-feature-name
    ```
2. **Make your changes**
   * Write clean, well-documented code
   * Add tests if applicable
   * Update documentation if needed
3.  **Test your changes**

    ```bash
    # Backend tests
    cd backend && npm test

    # Frontend tests
    cd frontend && npm test

    # Linting
    npm run lint
    npm run lint:fix
    ```
4.  **Commit your changes**

    ```bash
    git add .
    git commit -m "feat(scope): description of changes"
    ```
5.  **Push and create a PR**

    ```bash
    git push origin feature/your-feature-name
    ```
6. **Submit a Pull Request**
   * Use the PR template
   * Describe your changes clearly
   * Link any related issues
   * Request reviews from maintainers

### Code Review

All contributions require review before merging. Reviewers will check for:

* Code quality and style
* Functionality and edge cases
* Security considerations
* Performance implications
* Test coverage
* Documentation updates

## 🏗️ Project Structure

### Frontend (`frontend/`)

```
src/
├── components/          # Reusable UI components
│   ├── icons/          # Icon components
│   └── ui/             # Basic UI components
├── pages/              # Application pages
├── lib/                # Utilities and API client
├── styles/             # Global styles and theme
└── types/              # TypeScript type definitions
```

### Backend (`backend/`)

```
src/
├── routes/             # API route handlers
├── lib/                # Database and utilities
├── middleware/         # Express middleware
└── types/              # TypeScript type definitions
```

### Key Technologies

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
* **Backend**: Node.js, Express, TypeScript, Prisma ORM
* **Database**: SQLite (dev) / PostgreSQL (prod)
* **Authentication**: JWT with http-only cookies

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage reports
npm run test:coverage
```

### Writing Tests

* Write tests for new features
* Ensure good test coverage
* Use descriptive test names
* Test both success and error cases

## 📚 Documentation

### Code Documentation

* Use JSDoc comments for functions and classes
* Document complex business logic
* Keep README and docs up to date
* Include examples for API endpoints

### API Documentation

* Document all API endpoints
* Include request/response examples
* Document error codes and messages
* Keep OpenAPI/Swagger specs updated

## 🐛 Issue Reporting

### Before Creating an Issue

1. Check existing issues for duplicates
2. Search discussions for similar problems
3. Try to reproduce the issue
4. Gather relevant information

### Issue Template

Use the provided issue template and include:

* **Description**: Clear description of the problem
* **Steps to reproduce**: Detailed reproduction steps
* **Expected behavior**: What should happen
* **Actual behavior**: What actually happens
* **Environment**: OS, browser, Node.js version
* **Screenshots**: If applicable
* **Additional context**: Any other relevant information

## 🚀 Feature Requests

### Before Suggesting Features

1. Check if the feature already exists
2. Consider if it aligns with the project's goals
3. Think about implementation complexity
4. Consider maintenance implications

### Feature Request Template

Include in your feature request:

* **Problem**: What problem does this solve?
* **Solution**: How should it work?
* **Alternatives**: What alternatives exist?
* **Additional context**: Screenshots, mockups, etc.

## 🏷️ Labels and Milestones

We use labels to categorize issues and PRs:

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention needed
* `priority: high` - High priority items
* `priority: low` - Low priority items

## 📞 Getting Help

### Communication Channels

* **GitHub Issues**: For bugs and feature requests
* **GitHub Discussions**: For questions and general discussion
* **Pull Requests**: For code contributions
* **Wiki**: For detailed documentation

### Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards.

## 🎯 Contribution Ideas

### For Beginners

* Fix typos in documentation
* Improve error messages
* Add missing TypeScript types
* Write basic tests
* Improve accessibility

### For Experienced Developers

* Implement new features
* Optimize performance
* Add advanced testing
* Improve security
* Create new UI components

### For Designers

* Improve UI/UX
* Create new icon sets
* Design new components
* Improve accessibility
* Create design system documentation

## 🏆 Recognition

Contributors will be recognized in:

* GitHub contributors list
* Project README (for significant contributions)
* Release notes
* Community acknowledgments

## 📄 License

By contributing to PromptVault, you agree that your contributions will be licensed under the same license as the project (MIT License).

***

Thank you for contributing to PromptVault! 🎉

If you have any questions about contributing, feel free to open a discussion or reach out to the maintainers.
