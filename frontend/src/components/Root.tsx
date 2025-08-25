import { Nav } from './Nav'
import { Outlet } from 'react-router-dom'
import { CustomIcon } from './CustomIcon'

export default function Root() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border-primary/50 bg-background/95 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CustomIcon type="icon" size={20} className="text-accent-primary" />
              <span className="text-sm text-muted-foreground">
                PromptVault • Secure AI Prompt Management
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a 
                href="/about" 
                className="text-muted-foreground hover:text-accent-primary transition-colors duration-200 font-medium"
              >
                About
              </a>
              <a 
                href="https://github.com/ghotso/PromptVault" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent-primary transition-colors duration-200 font-medium"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


