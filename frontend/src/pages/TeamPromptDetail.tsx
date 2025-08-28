import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { Icon } from '../components/icons'
import LoginPrompt from '../components/LoginPrompt'
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Tag, 
  Copy, 
  Eye, 
  Clock, 
  CheckCircle, 
  History,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react'

interface TeamPrompt {
  id: string
  title: string
  body: string
  notes?: string | null
  modelHints?: string | null
  visibility: 'PRIVATE' | 'TEAM'
  tags: { tag: { name: string } }[]
  updatedAt: string
  createdAt: string
  versions?: any[]
  _count?: { versions: number }
  user: {
    name?: string
    email: string
  }
}

export default function TeamPromptDetail() {
  const { promptId } = useParams<{ promptId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [data, setData] = useState<TeamPrompt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [currentVersionPage, setCurrentVersionPage] = useState(1)
  const [showCopySuccess, setShowCopySuccess] = useState<string | null>(null)
  
  const VERSIONS_PER_PAGE = 10

  useEffect(() => {
    if (promptId && user?.team) {
      fetchPromptData()
    }
  }, [promptId, user?.team])

  const fetchPromptData = async () => {
    try {
      setIsLoading(true)
      const response = await api<TeamPrompt>(`/prompts/${promptId}`)
      setData(response)
    } catch (error) {
      console.error('Failed to fetch prompt:', error)
      navigate('/team-feed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyContent = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setShowCopySuccess(type)
      setTimeout(() => setShowCopySuccess(null), 2000)
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }

  const handleVersionPageChange = (page: number) => {
    setCurrentVersionPage(page)
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
          You need to be assigned to a team to view team prompts. Please contact an administrator.
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Prompt Not Found</h1>
          <Link to="/team-feed" className="btn-primary">
            Back to Team Feed
          </Link>
        </div>
      </div>
    )
  }

  const totalVersions = data.versions?.length || 0
  const totalPages = Math.ceil(totalVersions / VERSIONS_PER_PAGE)
  const startIndex = (currentVersionPage - 1) * VERSIONS_PER_PAGE
  const endIndex = startIndex + VERSIONS_PER_PAGE
  const currentVersions = data.versions?.slice(startIndex, endIndex) || []

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/team-feed"
            className="btn-outline flex items-center gap-2"
          >
            <Icon icon={ArrowLeft} size={18} color="rgb(198 247 40)" />
            Back to Team Feed
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Icon icon={Users} size={36} color="rgb(198 247 40)" />
          Team Prompt Details
        </h1>
        <p className="text-muted-foreground text-lg">
          Viewing prompt shared by your team member
        </p>
      </div>

      {/* Prompt Content Card */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon={Eye} size={24} color="rgb(198 247 40)" />
              <h2 className="text-2xl font-semibold">Prompt Content</h2>
            </div>
            <button
              onClick={() => handleCopyContent(data.body, 'content')}
              className="btn-outline flex items-center gap-2"
              title="Copy prompt content"
            >
              {showCopySuccess === 'content' ? (
                <Icon icon={CheckCircle} size={18} color="rgb(13 27 42)" />
              ) : (
                <Icon icon={Copy} size={18} color="rgb(13 27 42)" />
              )}
              Copy Content
            </button>
          </div>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{data.title}</h3>
              <pre className="whitespace-pre-wrap text-foreground bg-surface-secondary p-4 rounded-xl border-2 border-accent-primary">
                {data.body}
              </pre>
            </div>
            
            {data.notes && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Notes</h4>
                <p className="text-muted-foreground bg-surface-secondary p-3 rounded-xl border border-accent-primary/20">
                  {data.notes}
                </p>
              </div>
            )}
            
            {data.modelHints && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Model Hints</h4>
                <p className="text-muted-foreground bg-surface-secondary p-3 rounded-xl border border-accent-primary/20">
                  {data.modelHints}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Info Card */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <Icon icon={Tag} size={24} color="rgb(198 247 40)" />
            <h2 className="text-2xl font-semibold">Prompt Info</h2>
          </div>
        </div>
        <div className="card-content">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Author</h4>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon icon={Users} size={16} />
                <span>{data.user?.name || data.user?.email}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Visibility</h4>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  data.visibility === 'TEAM' 
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                    : 'bg-surface-tertiary text-muted-foreground border border-accent-primary'
                }`}>
                  {data.visibility === 'TEAM' ? 'Team Only' : data.visibility}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Created</h4>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon icon={Calendar} size={16} />
                <span>{new Date(data.createdAt).toLocaleDateString()}</span>
                <Icon icon={Clock} size={16} />
                <span>{new Date(data.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Last Updated</h4>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon icon={Calendar} size={16} />
                <span>{new Date(data.updatedAt).toLocaleDateString()}</span>
                <Icon icon={Clock} size={16} />
                <span>{new Date(data.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          {(data.tags?.length || 0) > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-foreground mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {data.tags?.map((tag) => (
                  <span
                    key={tag.tag.name}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-accent-primary/10 text-accent-primary text-sm rounded-full border border-accent-primary/30"
                  >
                    <Icon icon={Tag} size={14} />
                    {tag.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version History Card */}
      {totalVersions > 0 && (
        <div className="card mb-8">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon icon={History} size={24} color="rgb(198 247 40)" />
                <h2 className="text-2xl font-semibold">Version History</h2>
                <span className="text-sm text-muted-foreground bg-surface-secondary px-3 py-1 rounded-full">
                  {totalVersions} versions
                </span>
              </div>
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="btn-outline"
              >
                {showVersionHistory ? 'Hide' : 'Show'} History
              </button>
            </div>
          </div>
          <div className="card-content">
            {totalVersions === 0 ? (
              <p className="text-muted-foreground text-center py-8">No version history yet</p>
            ) : (
              <div className="space-y-4">
                {/* Compact version list (always visible) */}
                <div className="space-y-2">
                  {data.versions?.slice(0, 5).map((v: any, index: number) => (
                    <div key={v.id} className="flex items-center justify-between p-3 rounded-xl border border-accent-primary/20 bg-surface-secondary hover:bg-surface-tertiary transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon icon={Calendar} size={14} />
                          {new Date(v.createdAt).toLocaleDateString()}
                          <Icon icon={Clock} size={14} />
                          {new Date(v.createdAt).toLocaleTimeString()}
                        </div>
                        {index === 0 && (
                          <span className="text-xs bg-accent-primary/10 text-accent-primary px-2 py-1 rounded-full border border-accent-primary/20">
                            Current
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopyContent(v.body, `version-${v.id}`)}
                        className="p-1.5 rounded-xl hover:bg-accent-primary/20 text-accent-primary hover:text-accent-primary border border-accent-primary/30 transition-all duration-200"
                        title="Copy this version's content"
                      >
                        {showCopySuccess === `version-${v.id}` ? (
                          <Icon icon={CheckCircle} size={14} className="text-success" />
                        ) : (
                          <Icon icon={Copy} size={14} />
                        )}
                      </button>
                    </div>
                  ))}
                  {totalVersions > 5 && (
                    <div className="text-center text-muted-foreground text-sm py-2">
                      +{totalVersions - 5} more versions available
                    </div>
                  )}
                </div>

                {/* Detailed version history (toggleable) */}
                {showVersionHistory && (
                  <div className="space-y-4">
                    {currentVersions.map((v: any, index: number) => (
                      <div key={v.id} className="p-4 rounded-2xl border-2 border-accent-primary bg-surface-secondary hover:bg-surface-tertiary transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon icon={Calendar} size={14} />
                            {new Date(v.createdAt).toLocaleDateString()}
                            <Icon icon={Clock} size={14} />
                            {new Date(v.createdAt).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center gap-2">
                            {startIndex + index === 0 && (
                              <span className="text-xs bg-accent-primary/10 text-accent-primary px-2 py-1 rounded-full border border-accent-primary/20">
                                Current
                              </span>
                            )}
                            <button
                              onClick={() => handleCopyContent(v.body, `version-${v.id}`)}
                              className="p-1.5 rounded-xl hover:bg-accent-primary/20 text-accent-primary hover:text-accent-primary border border-accent-primary/30 transition-all duration-200"
                              title="Copy this version's content"
                            >
                              {showCopySuccess === `version-${v.id}` ? (
                                <Icon icon={CheckCircle} size={14} className="text-success" />
                              ) : (
                                <Icon icon={Copy} size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">{v.title}</h4>
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-surface-primary p-3 rounded-xl border-2 border-accent-primary">
                            {v.body}
                          </pre>
                          {v.notes && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Notes:</strong> {v.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-accent-primary">
                        <div className="text-sm text-muted-foreground">
                          Showing {startIndex + 1}-{Math.min(endIndex, totalVersions)} of {totalVersions} versions
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVersionPageChange(currentVersionPage - 1)}
                            disabled={currentVersionPage === 1}
                            className="p-2 rounded-lg border border-accent-primary hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Icon icon={ChevronLeft} size={16} />
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => handleVersionPageChange(page)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                  page === currentVersionPage
                                    ? 'bg-accent-primary text-accent-primary-on-bg'
                                    : 'bg-surface-secondary text-foreground hover:bg-surface-tertiary'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => handleVersionPageChange(currentVersionPage + 1)}
                            disabled={currentVersionPage === totalPages}
                            className="p-2 rounded-lg border border-accent-primary hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Icon icon={ChevronRight} size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-muted-foreground">
        <p className="text-sm">
          This prompt was shared by {data.user?.name || data.user?.email} • 
          {totalVersions} versions • Created {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
