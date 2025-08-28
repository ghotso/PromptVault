import { CustomIcon } from '../components/CustomIcon'
import { Github, Bug, Heart, Shield, Zap, Users, Code, BookOpen } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-accent-primary/10 rounded-3xl mb-8">
            <CustomIcon type="icon" size={56} className="text-accent-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            About PromptVault
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A self-hosted, privacy-friendly vault for AI prompts with advanced features including tagging, versioning, team sharing, and full-text search.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
                     <div className="bg-surface-primary p-8 rounded-3xl border-2 border-accent-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)]">
             <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-accent-primary/15 rounded-2xl">
                 <Shield className="w-6 h-6 text-accent-primary" />
               </div>
               <h3 className="text-xl font-bold text-foreground">Privacy-First</h3>
             </div>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Your prompts stay on your infrastructure. No data is sent to external services.
             </p>
           </div>

                     <div className="bg-surface-primary p-8 rounded-3xl border-2 border-accent-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)]">
             <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-accent-primary/15 rounded-2xl">
                 <Zap className="w-6 h-6 text-accent-primary" />
               </div>
               <h3 className="text-xl font-bold text-foreground">Lightning Fast</h3>
             </div>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Built with modern technologies for optimal performance and user experience.
             </p>
           </div>

                     <div className="bg-surface-primary p-8 rounded-3xl border-2 border-accent-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)]">
             <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-accent-primary/15 rounded-2xl">
                 <Users className="w-6 h-6 text-accent-primary" />
               </div>
               <h3 className="text-xl font-bold text-foreground">Team Collaboration</h3>
             </div>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Share prompts with your team, manage permissions, and collaborate effectively.
             </p>
           </div>

                                          <div className="bg-surface-primary p-8 rounded-3xl border-2 border-accent-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)]">
             <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-accent-primary/15 rounded-2xl">
                 <Code className="w-6 h-6 text-accent-primary" />
               </div>
               <h3 className="text-xl font-bold text-foreground">Open Source</h3>
             </div>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Built with transparency in mind. Review, modify, and contribute to the codebase.
             </p>
           </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-surface-primary p-10 rounded-3xl border-2 border-accent-primary shadow-lg mb-16 hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)] transition-all duration-300">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Built with Modern Technologies</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">Frontend</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                React 18, TypeScript, Tailwind CSS, shadcn/ui
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">Backend</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Node.js, Express, TypeScript, Prisma ORM
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">Database</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                SQLite with FTS5, PostgreSQL ready
              </p>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-surface-primary p-10 rounded-3xl border-2 border-accent-primary shadow-lg mb-16 hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)] transition-all duration-300">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Get Involved</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <a
              href="https://github.com/ghotso/PromptVault"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface-secondary border-2 border-accent-primary rounded-3xl p-8 hover:border-accent-primary transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-primary/15 rounded-2xl group-hover:bg-accent-primary/25 transition-colors">
                  <Github className="w-6 h-6" color="rgb(var(--color-icon-primary))" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-accent-primary transition-colors">
                  GitHub Repository
                </h3>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed">
                View the source code, contribute, or report issues on GitHub.
              </p>
            </a>

            <a
              href="https://github.com/ghotso/PromptVault/issues/new?template=bug_report.md"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface-secondary border-2 border-accent-primary rounded-3xl p-8 hover:border-accent-primary transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-primary/15 rounded-2xl group-hover:bg-accent-primary/25 transition-colors">
                  <Bug className="w-6 h-6" color="rgb(var(--color-icon-primary))" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-accent-primary transition-colors">
                  Report a Bug
                </h3>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed">
                Found an issue? Help us improve by reporting it with our template.
              </p>
            </a>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-surface-primary p-10 rounded-3xl border-2 border-accent-primary shadow-lg mb-16 hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)] transition-all duration-300">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Documentation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <a
              href="https://github.com/ghotso/PromptVault/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface-secondary border-2 border-accent-primary rounded-3xl p-8 hover:border-accent-primary transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:shadow-[var(--glow-accent)] dark:hover:shadow-[var(--glow-accent-strong)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-primary/15 rounded-2xl group-hover:bg-accent-primary/25 transition-colors">
                  <BookOpen className="w-6 h-6" color="rgb(var(--color-icon-primary))" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-accent-primary transition-colors">
                  README
                </h3>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed">
                Comprehensive setup and usage instructions for PromptVault.
              </p>
            </a>

            <a
              href="https://github.com/ghotso/PromptVault/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface-secondary border-2 border-accent-primary rounded-3xl p-8 hover:border-accent-primary transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:shadow-[var(--glow-accent)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-primary/15 rounded-2xl group-hover:bg-accent-primary/25 transition-colors">
                  <Code className="w-6 h-6" color="rgb(var(--color-icon-primary))" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-accent-primary transition-colors">
                  Contributing Guide
                </h3>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed">
                Learn how to contribute to the project and development guidelines.
              </p>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-3 mb-3 text-lg">
            Made with <Heart className="w-5 h-5 text-red-500" /> by the PromptVault community
          </p>
          <p className="text-base">
            Version 1.0.0 • GNU General Public License v3.0
          </p>
        </div>
      </div>
    </div>
  )
}
