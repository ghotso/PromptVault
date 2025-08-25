# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.1.1 (2025-08-25)

## [1.0.0] - 2024-12-25

### Added
- 🎉 Initial release of PromptVault
- 🔐 JWT-based authentication with http-only cookies
- 👥 User role management (Admin/User)
- 🏢 Team creation and management
- 📝 Prompt creation, editing, and deletion
- 🏷️ Advanced tagging system with autocomplete
- 📚 Automatic version history for prompts
- 🔍 Full-text search across prompts
- 👁️ Visibility controls (Private/Team/Public)
- 📋 Copy to clipboard functionality
- 🎨 Modern UI with dark/light mode support
- 📱 Responsive design for all devices
- 🚀 Docker deployment support
- 🔧 Admin dashboard for system management
- 📊 Registration toggle functionality
- 🎯 Team-based prompt sharing
- 📖 Comprehensive documentation

### Technical Features
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: SQLite with FTS5 full-text search
- **Authentication**: Secure JWT implementation
- **Styling**: Custom design system with CSS variables
- **Icons**: Lucide React icon library
- **Build**: Optimized production builds
- **Testing**: Jest and Vitest test frameworks

### Security Features
- JWT authentication with secure cookie handling
- Input validation and sanitization
- SQL injection protection via Prisma ORM
- CORS protection
- Rate limiting capabilities
- Secure password handling with bcrypt

## [0.9.0] - 2024-12-20

### Added
- Basic authentication system
- Prompt CRUD operations
- Simple tag system
- Basic UI components

### Changed
- Improved error handling
- Enhanced user experience

### Fixed
- Various bug fixes and improvements

## [0.8.0] - 2024-12-15

### Added
- Initial project structure
- Basic Express server setup
- Prisma database integration
- React frontend foundation

### Changed
- Project architecture improvements
- Development workflow enhancements

---

## Version Numbering

We use [Semantic Versioning](https://semver.org/) for version numbers:

- **MAJOR** version for incompatible API changes
- **MINOR** version for added functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

## Release Types

- **Major Release**: New features, breaking changes
- **Minor Release**: New features, no breaking changes
- **Patch Release**: Bug fixes and minor improvements
- **Pre-release**: Alpha, beta, or release candidate versions

## Migration Guides

For major version releases that include breaking changes, we provide detailed migration guides in the [docs/migrations](docs/migrations/) directory.

## Contributing

To add entries to this changelog:

1. Follow the existing format
2. Use clear, concise language
3. Group changes by type (Added, Changed, Deprecated, Removed, Fixed, Security)
4. Include issue numbers when applicable
5. Use emojis for better readability
6. Keep entries in reverse chronological order

## Links

- [GitHub Releases](https://github.com/yourusername/PromptVault/releases)
- [Migration Guides](docs/migrations/)
- [API Documentation](docs/api/)
- [Contributing Guidelines](CONTRIBUTING.md)
