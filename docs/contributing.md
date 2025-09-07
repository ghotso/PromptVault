# Contributing to PromptVault

Thank you for your interest in contributing to PromptVault! This guide will help you get started with contributing to the project, whether it's fixing bugs, adding features, or improving documentation.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug Reports**: Report issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Fix bugs or implement features
- **Documentation**: Improve or add documentation
- **Testing**: Add tests or improve test coverage
- **Design**: UI/UX improvements and design suggestions

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up development environment** (see [Development Setup](development-setup.md))
4. **Create a feature branch** for your changes
5. **Make your changes** and test them
6. **Submit a pull request** with a clear description

## 🐛 Reporting Issues

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Check if it's already fixed** in the latest version
3. **Verify it's a bug** and not expected behavior
4. **Gather information** about your environment

### Issue Template

When creating an issue, please include:

```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Windows 10, macOS 12, Ubuntu 20.04]
- Browser: [e.g., Chrome 91, Firefox 89, Safari 14]
- PromptVault Version: [e.g., 1.0.0]
- Node.js Version: [e.g., 18.0.0]

## Additional Context
Any other context about the problem.

## Screenshots
If applicable, add screenshots to help explain your problem.
```

### Feature Requests

For feature requests, please include:

```markdown
## Feature Description
A clear description of the feature you'd like to see.

## Use Case
Describe the problem this feature would solve.

## Proposed Solution
Describe how you think this feature should work.

## Alternatives
Describe any alternative solutions you've considered.

## Additional Context
Any other context about the feature request.
```

## 💻 Code Contributions

### Development Workflow

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/PromptVault.git
cd PromptVault

# Add upstream remote
git remote add upstream https://github.com/ghotso/PromptVault.git
```

#### 2. Create Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-number-description
```

#### 3. Set Up Development Environment

```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
cd backend
npx prisma migrate dev
npx prisma generate
```

#### 4. Make Changes

- **Follow coding standards** (see below)
- **Write tests** for new functionality
- **Update documentation** as needed
- **Test your changes** thoroughly

#### 5. Commit Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new feature description"

# Push to your fork
git push origin feature/your-feature-name
```

#### 6. Create Pull Request

1. **Go to your fork** on GitHub
2. **Click "New Pull Request"**
3. **Select your feature branch**
4. **Fill out the PR template**
5. **Submit the pull request**

### Coding Standards

#### TypeScript/JavaScript

```typescript
// Use TypeScript for type safety
interface User {
  id: string;
  email: string;
  name?: string;
}

// Use meaningful variable names
const userEmail = user.email;

// Use const/let appropriately
const API_BASE = 'https://api.example.com';
let currentUser: User | null = null;

// Use arrow functions for callbacks
const users = data.map(user => ({
  id: user.id,
  email: user.email
}));

// Use async/await for promises
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${id}`);
  return response.json();
}
```

#### React Components

```typescript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

interface Props {
  title: string;
  onSave: (data: FormData) => void;
}

export function MyComponent({ title, onSave }: Props) {
  const [data, setData] = useState<FormData>({});
  
  useEffect(() => {
    // Side effects
  }, []);
  
  return (
    <div>
      <h1>{title}</h1>
      {/* Component JSX */}
    </div>
  );
}
```

#### CSS/Styling

```css
/* Use Tailwind CSS classes */
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

/* Use CSS variables for theming */
.custom-component {
  background-color: var(--color-background);
  color: var(--color-text);
}

/* Use semantic class names */
.prompt-card {
  @apply bg-white rounded-lg shadow-md p-4;
}

.prompt-card__title {
  @apply text-lg font-semibold text-gray-900;
}
```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

#### Examples

```bash
feat(auth): add JWT token refresh functionality
fix(ui): correct button alignment in header
docs(readme): update installation instructions
style(components): format code with prettier
refactor(api): simplify error handling logic
test(prompts): add unit tests for prompt creation
chore(deps): update dependencies to latest versions
```

### Testing

#### Writing Tests

```typescript
// Backend tests
import { describe, it, expect } from 'jest';

describe('Prompt API', () => {
  it('should create a new prompt', async () => {
    const promptData = {
      title: 'Test Prompt',
      body: 'Test content'
    };
    
    const response = await request(app)
      .post('/api/prompts')
      .send(promptData)
      .expect(200);
      
    expect(response.body.title).toBe('Test Prompt');
  });
});

// Frontend tests
import { render, screen, fireEvent } from '@testing-library/react';
import { PromptForm } from './PromptForm';

describe('PromptForm', () => {
  it('should submit form with valid data', () => {
    const onSave = jest.fn();
    render(<PromptForm onSave={onSave} />);
    
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Prompt' }
    });
    fireEvent.click(screen.getByText('Save'));
    
    expect(onSave).toHaveBeenCalledWith({
      title: 'Test Prompt'
    });
  });
});
```

#### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# All tests
npm run test:all

# Test coverage
npm run test:coverage
```

### Code Review Process

#### Before Submitting

1. **Self-review** your code
2. **Run tests** and ensure they pass
3. **Check linting** and fix any issues
4. **Update documentation** if needed
5. **Test your changes** thoroughly

#### Pull Request Guidelines

1. **Clear title** describing the change
2. **Detailed description** of what was changed
3. **Reference issues** if applicable
4. **Screenshots** for UI changes
5. **Testing instructions** for reviewers

#### Review Checklist

- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

## 📚 Documentation Contributions

### Types of Documentation

- **User Guides**: How to use features
- **Developer Guides**: Technical documentation
- **API Documentation**: API reference
- **Troubleshooting**: Common issues and solutions
- **Examples**: Code examples and tutorials

### Writing Guidelines

#### Style Guide

- **Clear and concise** language
- **Step-by-step instructions** with examples
- **Consistent formatting** and structure
- **Code examples** with syntax highlighting
- **Screenshots** for UI documentation

#### Markdown Formatting

```markdown
# Main Heading

## Section Heading

### Subsection Heading

**Bold text** for emphasis

*Italic text* for subtle emphasis

`inline code` for code snippets

```typescript
// Code blocks with language specification
const example = 'code';
```

- Bullet points for lists
- Multiple items
- Easy to scan

1. Numbered lists for steps
2. Sequential instructions
3. Clear progression

> Blockquotes for important notes
> or warnings

[Link text](https://example.com)

![Alt text](image-url)
```

### Documentation Structure

```
docs/
├── README.md              # Main documentation index
├── overview.md            # Project overview
├── quick-start.md         # Getting started guide
├── installation.md        # Installation instructions
├── user-interface.md      # UI guide
├── creating-prompts.md    # User guides
├── team-collaboration.md  # Feature guides
├── api-reference.md       # API documentation
├── development-setup.md   # Developer guides
├── architecture.md        # Technical docs
└── contributing.md        # This file
```

## 🎨 Design Contributions

### UI/UX Improvements

- **Design mockups** for new features
- **User experience** improvements
- **Accessibility** enhancements
- **Responsive design** improvements
- **Theme** and styling updates

### Design Guidelines

- **Consistent** with existing design system
- **Accessible** following WCAG guidelines
- **Responsive** for all screen sizes
- **User-friendly** and intuitive
- **Modern** and clean aesthetic

### Design Tools

- **Figma** for design mockups
- **Sketch** for UI designs
- **Adobe XD** for prototypes
- **InVision** for design collaboration

## 🧪 Testing Contributions

### Types of Tests

- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Full user workflow testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability testing

### Test Writing Guidelines

```typescript
// Good test structure
describe('ComponentName', () => {
  describe('when condition is met', () => {
    it('should behave correctly', () => {
      // Arrange
      const input = 'test input';
      const expected = 'expected output';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## 🚀 Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version numbers updated
- [ ] Release notes prepared
- [ ] Docker images built
- [ ] GitHub release created

## 🆘 Getting Help

### Community Support

- **GitHub Discussions**: Ask questions and discuss ideas
- **GitHub Issues**: Report bugs and request features
- **Discord/Slack**: Real-time community chat (if available)
- **Email**: Contact maintainers directly

### Resources

- **Documentation**: Comprehensive guides and references
- **Code Examples**: Sample code and tutorials
- **Video Tutorials**: Step-by-step video guides
- **Community Wiki**: Community-maintained documentation

## 📋 Contributor Checklist

Before submitting your contribution:

- [ ] I have read and understood the contributing guidelines
- [ ] I have followed the coding standards
- [ ] I have added tests for my changes
- [ ] I have updated documentation as needed
- [ ] My changes are backward compatible (or documented)
- [ ] I have tested my changes thoroughly
- [ ] My commit messages follow the convention
- [ ] I have created a clear pull request description

## 🎉 Recognition

Contributors are recognized in:

- **README.md**: Contributor list
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributor statistics
- **Documentation**: Credit where appropriate

Thank you for contributing to PromptVault! Your contributions help make the project better for everyone.

---

**Ready to contribute?** Check out the [Development Setup](development-setup.md) guide to get started with your development environment!
