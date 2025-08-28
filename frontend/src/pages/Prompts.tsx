import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { Modal } from '../components/Modal'
import { Icon } from '../components/icons'
import LoginPrompt from '../components/LoginPrompt'
import { 
  Plus, 
  Search, 
  Tag, 
  Clock,
  CheckCircle,
  X,
  Lock,
  Users,
  Copy,
  Calendar
} from 'lucide-react'

type Prompt = {
  id: string
  title: string
  body: string
  notes?: string | null
  modelHints?: string | null
  visibility: 'PRIVATE' | 'TEAM'
  tags: { tag: { name: string } }[]
  updatedAt: string
  _count?: { versions: number }
}

interface PromptForm {
  title: string
  body: string
  notes: string
  modelHints: string
  visibility: 'PRIVATE' | 'TEAM'
  tags: string[]
}

export default function Prompts() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [existingTags, setExistingTags] = useState<string[]>([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [tagSearch, setTagSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCopySuccess, setShowCopySuccess] = useState<string | null>(null)
  const [form, setForm] = useState<PromptForm>({
    title: '',
    body: '',
    notes: '',
    modelHints: '',
    visibility: 'PRIVATE',
    tags: []
  })

  useEffect(() => {
    fetchPrompts()
    fetchExistingTags()
  }, [])

  const fetchPrompts = async () => {
    try {
      const response = await api<Prompt[]>('/prompts')
      setPrompts(response)
    } catch (error) {
      console.error('Failed to fetch prompts:', error)
    }
  }

  const fetchExistingTags = async () => {
    try {
      const response = await api<{name: string}[]>('/tags')
      const tagNames = response.map(t => t.name).filter(Boolean)
      setExistingTags(tagNames)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
      setExistingTags([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const created = await api<Prompt>('/prompts', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          body: form.body,
          notes: form.notes || undefined,
          modelHints: form.modelHints || undefined,
          tags: form.tags
        })
      })
      
      setPrompts([created, ...prompts])
      setIsCreateModalOpen(false)
      setForm({ title: '', body: '', notes: '', modelHints: '', visibility: 'PRIVATE', tags: [] })
    } catch (error) {
      console.error('Failed to create prompt:', error)
    }
  }

  const handleCardClick = (promptId: string) => {
    navigate(`/prompts/${promptId}`)
  }

  const handleCopy = async (promptBody: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(promptBody)
      // Show temporary success feedback
      setShowCopySuccess(promptId)
      setTimeout(() => setShowCopySuccess(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = promptBody
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setShowCopySuccess(promptId)
      setTimeout(() => setShowCopySuccess(null), 2000)
    }
  }

  // Tag management functions
  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim()
    if (trimmedTag && !form.tags.includes(trimmedTag)) {
      setForm({ ...form, tags: [...form.tags, trimmedTag] })
      setTagSearch('')
      setShowTagDropdown(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) })
  }

  const createNewTag = () => {
    if (tagSearch.trim() && !existingTags.includes(tagSearch.trim())) {
      addTag(tagSearch.trim())
    }
  }

  const filteredTags = existingTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase()) && 
    !form.tags.includes(tag)
  )

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return <Icon icon={Lock} size={16} />
      case 'TEAM': return <Icon icon={Users} size={16} />
      default: return <Icon icon={Lock} size={16} />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'Private'
      case 'TEAM': return 'Team'
      default: return 'Private'
    }
  }

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prompt.tags?.some(tag => tag.tag.name.toLowerCase().includes(searchTerm.toLowerCase())) || false)
  )

  if (!user) return <LoginPrompt />

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Icon icon={Plus} size={36} color="rgb(198 247 40)" />
          My Prompts
        </h1>
        <p className="text-muted-foreground text-lg">
          Create, organize, and manage your AI prompts with full version history
          <span className="mx-3">•</span>
          <a 
            href="/about" 
            className="text-accent-primary hover:text-accent-secondary transition-colors duration-200 underline decoration-dotted underline-offset-4 font-medium"
          >
            Learn more about PromptVault
          </a>
        </p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Icon icon={Search} size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-6"
        >
          <Icon icon={Plus} size={18} color="rgb(13 27 42)" />
          New Prompt
        </button>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-16">
          <Icon icon={Plus} size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchTerm ? 'No prompts found' : 'No prompts yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first prompt to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              Create Your First Prompt
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map(prompt => (
            <div 
              key={prompt.id} 
              className="card hover:shadow-lg transition-all duration-200 group border-2 border-accent-primary bg-gradient-to-br from-surface-primary to-surface-secondary cursor-pointer relative"
              onClick={() => handleCardClick(prompt.id)}
            >
              <div className="card-header pb-4">
                <div className="flex items-start justify-between">
                  <h3 className="card-title text-lg line-clamp-2 group-hover:text-accent-primary transition-colors">
                    {prompt.title}
                  </h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(prompt.body, prompt.id)
                      }}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        showCopySuccess === prompt.id
                          ? 'bg-success/20 text-success'
                          : 'hover:bg-accent-primary/20 text-accent-primary hover:text-accent-primary'
                      }`}
                      title="Copy prompt content"
                    >
                      <Icon icon={showCopySuccess === prompt.id ? CheckCircle : Copy} size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getVisibilityIcon(prompt.visibility)}
                  <span>{getVisibilityLabel(prompt.visibility)}</span>
                  <span className="text-accent-secondary">•</span>
                  <span className="text-accent-primary">{prompt._count?.versions || 0} versions</span>
                </div>
              </div>

              <div className="card-content">
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {prompt.body}
                </p>

                {(prompt.tags?.length || 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags?.map(tag => (
                        <span
                          key={tag.tag.name}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs rounded-full border-2 border-accent-primary/30"
                        >
                          <Icon icon={Tag} size={12} />
                          {tag.tag.name}
                        </span>
                      ))}
                  </div>
                )}

                {prompt.notes && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    <strong>Notes:</strong> {prompt.notes}
                  </p>
                )}

                {prompt.modelHints && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Model:</strong> {prompt.modelHints}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon icon={Calendar} size={12} />
                    {new Date(prompt.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon={Clock} size={12} />
                    {new Date(prompt.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setForm({ title: '', body: '', notes: '', modelHints: '', visibility: 'PRIVATE', tags: [] })
        }}
        title="Create New Prompt"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="Enter prompt title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="textarea"
              placeholder="Enter your prompt content..."
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="textarea"
              placeholder="Add any notes or context..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Model Hints (Optional)</label>
            <input
              type="text"
              value={form.modelHints}
              onChange={(e) => setForm({ ...form, modelHints: e.target.value })}
              className="input"
              placeholder="e.g., GPT-4, Claude, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (Optional)</label>
            <div className="relative">
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => {
                  setTagSearch(e.target.value)
                  setShowTagDropdown(e.target.value.length > 0)
                }}
                onFocus={() => setTagSearch.length > 0 && setShowTagDropdown(true)}
                onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    createNewTag()
                  }
                }}
                className="input pl-10"
                placeholder="Search existing tags or type new ones..."
              />
              <Icon icon={Tag} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              
              {/* Tag Dropdown */}
              {showTagDropdown && filteredTags.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-surface-primary border border-border-primary rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredTags.map(tag => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 p-3 cursor-pointer hover:bg-surface-secondary transition-colors first:rounded-t-xl last:rounded-b-xl"
                      onClick={() => addTag(tag)}
                    >
                      <Icon icon={Plus} size={16} className="text-accent-primary" />
                      <span className="text-foreground">{tag}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Create New Tag Option */}
              {showTagDropdown && tagSearch.trim() && !existingTags.includes(tagSearch.trim()) && !form.tags.includes(tagSearch.trim()) && (
                <div className="absolute z-20 w-full mt-1 bg-surface-primary border border-border-primary rounded-xl shadow-lg">
                  <div
                    className="flex items-center gap-2 p-3 cursor-pointer hover:bg-surface-secondary transition-colors rounded-xl"
                    onClick={() => createNewTag()}
                  >
                    <Icon icon={Plus} size={16} className="text-accent-primary" />
                    <span className="text-foreground">Create "{tagSearch.trim()}"</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected Tags Display */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 bg-accent-primary/10 text-accent-primary text-sm font-medium px-3 py-1.5 rounded-full border-2 border-accent-primary/30 hover:bg-accent-primary/20 transition-colors"
                  >
                    <Icon icon={Tag} size={14} />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                      title="Remove tag"
                    >
                      <Icon icon={X} size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Visibility</label>
            <select
              value={form.visibility}
              onChange={(e) => setForm({ ...form, visibility: e.target.value as any })}
              className="input border-accent-primary"
            >
                             <option value="PRIVATE">Private - Only you can see</option>
               <option value="TEAM">Team - Visible to your team</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false)
                setForm({ title: '', body: '', notes: '', modelHints: '', visibility: 'PRIVATE', tags: [] })
              }}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Create Prompt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}



