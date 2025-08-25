import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import LoginPrompt from '../components/LoginPrompt'
import { Icon } from '../components/icons'
import { Building2, ArrowLeft, Users, Calendar, Tag, Copy, Eye, Clock, CheckCircle } from 'lucide-react'

interface TeamPrompt {
  id: string
  title: string
  body: string
  notes?: string | null
  modelHints?: string | null
  visibility: 'PRIVATE' | 'TEAM' | 'PUBLIC'
  tags: { tag: { name: string } }[]
  updatedAt: string
  createdAt: string
  _count?: { versions: number }
  user: {
    name?: string
    email: string
  }
}

export default function TeamFeed() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<TeamPrompt[]>([])
  const [showCopySuccess, setShowCopySuccess] = useState<string | null>(null)
  
  useEffect(() => { 
    if (user?.team) {
      api<TeamPrompt[]>('/prompts/feed/team').then(setItems).catch(() => setItems([]))
    }
  }, [user?.team])

  const handleCopyContent = async (content: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setShowCopySuccess(promptId)
      setTimeout(() => setShowCopySuccess(null), 2000)
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }

  const handleCardClick = (promptId: string) => {
    navigate(`/team-feed/${promptId}`)
  }

  if (!user) return <LoginPrompt />
  if (!user.team) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-primary to-surface-secondary p-6">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-secondary/10 rounded-2xl mb-6">
          <Icon icon={Building2} size={40} className="text-accent-secondary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          No Team Assigned
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          You need to be assigned to a team to view the team feed. Please contact an administrator.
        </p>
        <Link
          to="/prompts"
          className="btn-primary flex items-center justify-center gap-2 h-12 text-base font-medium mx-auto"
        >
          <Icon icon={ArrowLeft} size={20} color="rgb(13 27 42)" />
          Back to Prompts
        </Link>
      </div>
    </div>
  )
  
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Icon icon={Users} size={36} color="rgb(198 247 40)" />
          Team Feed
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover and explore prompts shared by your team members
        </p>
      </div>

      {/* Team Feed Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-primary/10 rounded-3xl mb-6">
            <Icon icon={Users} size={48} color="rgb(198 247 40)" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No Team Prompts Yet</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Your team hasn't shared any prompts yet. Be the first to share a useful prompt!
          </p>
          <Link
            to="/prompts"
            className="btn-primary flex items-center justify-center gap-2 h-12 text-base font-medium mx-auto"
          >
            <Icon icon={ArrowLeft} size={20} color="rgb(13 27 42)" />
            Create Your First Prompt
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((prompt: TeamPrompt) => (
            <div
              key={prompt.id}
              className="card hover:shadow-lg transition-all duration-200 group cursor-pointer relative overflow-hidden"
              onClick={() => handleCardClick(prompt.id)}
            >
              {/* Card Header */}
              <div className="card-header border-b-2 border-accent-primary/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent-primary transition-colors line-clamp-2">
                      {prompt.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Icon icon={Users} size={14} />
                      <span className="truncate">
                        {prompt.user?.name || prompt.user?.email}
                      </span>
                    </div>
                  </div>
                  
                  {/* Copy Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyContent(prompt.body, prompt.id)
                    }}
                    className="p-2 rounded-xl text-accent-primary hover:bg-accent-primary/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy prompt content"
                  >
                    {showCopySuccess === prompt.id ? (
                      <Icon icon={CheckCircle} size={16} className="text-success" />
                    ) : (
                      <Icon icon={Copy} size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="card-content p-4">
                {/* Prompt Preview */}
                <div className="mb-4">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground line-clamp-3 bg-surface-secondary p-3 rounded-xl border border-accent-primary/20">
                    {prompt.body}
                  </pre>
                </div>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.tag.name}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs rounded-full border border-accent-primary/30"
                      >
                        <Icon icon={Tag} size={12} />
                        {tag.tag.name}
                      </span>
                    ))}
                    {prompt.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{prompt.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Card Footer */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Icon icon={Calendar} size={14} />
                    <span>{new Date(prompt.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Icon icon={Clock} size={14} />
                    <span>{new Date(prompt.updatedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Version Count */}
                {prompt._count?.versions && prompt._count.versions > 1 && (
                  <div className="mt-3 pt-3 border-t border-accent-primary/20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon icon={Eye} size={14} />
                      <span>{prompt._count.versions} versions available</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


