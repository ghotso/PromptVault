import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Icon } from '../components/icons'
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Eye, 
  Users, 
  Lock, 
  History, 
  Tag,
  Calendar,
  Clock,
  CheckCircle,
  Trash2,
  AlertTriangle,
  Copy,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Globe,
  Link
} from 'lucide-react'
import { Modal } from '../components/Modal'

export default function PromptDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [currentVersionPage, setCurrentVersionPage] = useState(1)
  const [visibility, setVisibility] = useState<'PRIVATE'|'TEAM'>('PRIVATE')
  const [isPubliclyShared, setIsPubliclyShared] = useState(false)
  const [publicShareId, setPublicShareId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [notes, setNotes] = useState('')
  const [modelHints, setModelHints] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagSearch, setTagSearch] = useState('')
  const [existingTags, setExistingTags] = useState<string[]>([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const VERSIONS_PER_PAGE = 10

  useEffect(() => {
    if (!id) return
    api(`/prompts/${id}`).then((d:any)=>{ 
      setData(d); 
      // Handle visibility and public sharing
      setVisibility(d.visibility);
      setIsPubliclyShared(d.isPubliclyShared || false);
             if (d.isPubliclyShared && d.publicShareId) {
         setPublicShareId(d.publicShareId);
       } else {
        setPublicShareId(null);
      }
      setTitle(d.title || '');
      setBody(d.body || '');
      setNotes(d.notes || '');
      setModelHints(d.modelHints || '');
      const tagList = d.tags && Array.isArray(d.tags) ? d.tags.map((t:any)=>t.tag?.name).filter(Boolean) : [];
      setSelectedTags(tagList);
    })
    
    // Fetch existing tags for autocomplete
    api<{name: string}[]>('/tags').then((tags) => {
      const tagNames = tags.map(t => t.name).filter(Boolean);
      setExistingTags(tagNames);
    }).catch(() => setExistingTags([]));
  }, [id])

  if (!id) return null
  if (!data) return <div className="p-6">Loading...</div>

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updated = await api(`/prompts/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify({ title, body, notes, modelHints, tags: selectedTags }) 
      })
      setData(updated)
      setIsEditing(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save prompt:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleVisibilitySave = async () => {
    try {
      await api(`/prompts/${id}/visibility`, { 
        method: 'PUT', 
        body: JSON.stringify({ visibility }) 
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to update visibility:', error)
    }
  }

  const handlePublicToggle = async () => {
    try {
      if (isPubliclyShared) {
        // Disable public sharing
        await api(`/share/${id}/public`, { 
          method: 'DELETE' 
        })
        setIsPubliclyShared(false)
        setPublicShareId(null)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        // Enable public sharing
        const response = await api(`/share/${id}/public`, { 
          method: 'POST' 
        }) as { publicUrl: string }
        setIsPubliclyShared(true)
        // Extract share ID from URL
        const shareId = response.publicUrl.split('/').pop()
        setPublicShareId(shareId || null)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Failed to toggle public status:', error)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api(`/prompts/${id}`, { method: 'DELETE' })
      navigate('/prompts')
    } catch (error) {
      console.error('Failed to delete prompt:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopy = async () => {
    try {
      // Only copy the prompt content/body
      await navigator.clipboard.writeText(data.body)
      
      // Show success feedback
      setShowCopySuccess(true)
      setTimeout(() => setShowCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = data.body
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setShowCopySuccess(true)
      setTimeout(() => setShowCopySuccess(false), 2000)
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return <Icon icon={Lock} size={16} variant="primary" />
      case 'TEAM': return <Icon icon={Users} size={16} variant="primary" />
      default: return <Icon icon={Lock} size={16} variant="primary" />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'Private'
      case 'TEAM': return 'Team'
      default: return 'Private'
    }
  }

  // Tag management functions
  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim()
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag])
      setTagSearch('')
      setShowTagDropdown(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const createNewTag = () => {
    if (tagSearch.trim() && !existingTags.includes(tagSearch.trim())) {
      addTag(tagSearch.trim())
    }
  }

  const filteredTags = existingTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase()) && 
    !selectedTags.includes(tag)
  )

  // Version history pagination
  const totalVersions = data.versions?.length || 0
  const totalPages = Math.ceil(totalVersions / VERSIONS_PER_PAGE)
  const startIndex = (currentVersionPage - 1) * VERSIONS_PER_PAGE
  const endIndex = startIndex + VERSIONS_PER_PAGE
  const currentVersions = data.versions?.slice(startIndex, endIndex) || []

  const handleVersionPageChange = (page: number) => {
    setCurrentVersionPage(page)
  }

  const toggleVersionHistory = () => {
    setShowVersionHistory(!showVersionHistory)
    if (!showVersionHistory) {
      setCurrentVersionPage(1) // Reset to first page when expanding
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/prompts')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon icon={ArrowLeft} size={20} variant="primary" />
          Back to Prompts
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
              <Icon icon={Edit} size={36} variant="primary" />
              {isEditing ? 'Edit Prompt' : 'Prompt Details'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isEditing ? 'Make changes to your prompt' : 'View and manage your prompt'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing && (
              <>
                <button
                  onClick={handleCopy}
                  className="btn-outline flex items-center gap-2"
                  title="Copy prompt content to clipboard"
                >
                  <Icon icon={showCopySuccess ? CheckCircle : Copy} size={18} variant="primary" />
                  {showCopySuccess ? 'Copied!' : 'Copy Content'}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Icon icon={Edit} size={18} variant="on-bg" />
                  Edit Prompt
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-destructive flex items-center gap-2"
                >
                  <Icon icon={Trash2} size={18} variant="primary" />
                  Delete Prompt
                </button>
              </>
            )}
            {isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-outline flex items-center gap-2"
                >
                  <Icon icon={X} size={18} variant="primary" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Icon icon={isSaving ? CheckCircle : Save} size={18} variant="on-bg" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Messages */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-2 text-success">
          <Icon icon={CheckCircle} size={20} variant="primary" />
          <span className="font-medium">Changes saved successfully!</span>
        </div>
      )}
      
      {showCopySuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-2 text-success">
          <Icon icon={CheckCircle} size={20} variant="primary" />
          <span className="font-medium">Prompt content copied to clipboard!</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Content Card */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <Icon icon={Edit} size={24} variant="primary" />
                <h2 className="text-2xl font-semibold">Prompt Content</h2>
              </div>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Title</label>
                <input 
                  className="input" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter prompt title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Content</label>
                <textarea 
                  className="textarea" 
                  value={body} 
                  onChange={e => setBody(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your prompt content..."
                  rows={8}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Notes (Optional)</label>
                <textarea 
                  className="textarea" 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Add any notes or context..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Model Hints (Optional)</label>
                <input 
                  className="input" 
                  value={modelHints} 
                  onChange={e => setModelHints(e.target.value)}
                  placeholder="e.g., GPT-4, Claude, etc."
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Tags (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    className="input pl-10"
                    value={tagSearch}
                    onChange={e => {
                      setTagSearch(e.target.value)
                      setShowTagDropdown(e.target.value.length > 0)
                    }}
                    onFocus={() => setTagSearch.length > 0 && setShowTagDropdown(true)}
                    onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        createNewTag()
                      }
                    }}
                    placeholder="Search existing tags or type new ones..."
                    disabled={!isEditing}
                  />
                  <Icon icon={Search} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  
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
                  {showTagDropdown && tagSearch.trim() && !existingTags.includes(tagSearch.trim()) && !selectedTags.includes(tagSearch.trim()) && (
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
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 bg-accent-primary/10 text-accent-primary text-sm font-medium px-3 py-1.5 rounded-full border-2 border-accent-primary/30 hover:bg-accent-primary/20 transition-colors"
                      >
                        <Icon icon={Tag} size={14} variant="primary" />
                        {tag}
                        {isEditing && (
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                            title="Remove tag"
                          >
                            <Icon icon={X} size={14} variant="primary" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Versions History Card */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon icon={History} size={24} variant="primary" />
                  <h2 className="text-2xl font-semibold">Version History</h2>
                  <span className="text-sm text-muted-foreground bg-surface-secondary px-3 py-1 rounded-full">
                    {totalVersions} versions
                  </span>
                </div>
                <button
                  onClick={toggleVersionHistory}
                  className="flex items-center gap-2 text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
                >
                  {showVersionHistory ? 'Hide Details' : 'Show Details'}
                  <Icon icon={showVersionHistory ? ChevronUp : ChevronDown} size={16} variant="primary" />
                </button>
              </div>
            </div>
            <div className="card-content">
              {totalVersions === 0 ? (
                <p className="text-muted-foreground text-center py-8">No version history yet</p>
              ) : (
                <div className="space-y-4">
                  {/* Detailed version history (toggleable) */}
                  {showVersionHistory && (
                    <div className="space-y-4">
                      {currentVersions.map((v: any, index: number) => (
                        <div key={v.id} className="p-4 rounded-2xl border-2 border-accent-primary bg-surface-secondary hover:bg-surface-tertiary transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon icon={Calendar} size={14} variant="primary" />
                              {new Date(v.createdAt).toLocaleDateString()}
                              <Icon icon={Clock} size={14} variant="primary" />
                              {new Date(v.createdAt).toLocaleTimeString()}
                            </div>
                            <div className="flex items-center gap-2">
                              {startIndex + index === 0 && (
                                <span className="text-xs bg-accent-primary/10 text-accent-primary px-2 py-1 rounded-full border border-accent-primary/20">
                                  Current
                                </span>
                              )}
                              <button
                                onClick={async (event) => {
                                  try {
                                    await navigator.clipboard.writeText(v.body)
                                    // Show temporary success feedback
                                    const button = event.currentTarget as HTMLButtonElement
                                    if (button) {
                                      const originalContent = button.innerHTML
                                      button.innerHTML = '<Icon icon={CheckCircle} size={14} />'
                                      button.className = 'p-1.5 rounded-xl bg-success/20 text-success border border-success/30 transition-all duration-200'
                                      setTimeout(() => {
                                        button.innerHTML = originalContent
                                        button.className = 'p-1.5 rounded-xl hover:bg-accent-primary/20 text-accent-primary hover:text-accent-primary border border-border-primary transition-all duration-200'
                                      }, 1500)
                                    }
                                  } catch (error) {
                                    console.error('Failed to copy version content:', error)
                                  }
                                }}
                                className="p-1.5 rounded-xl hover:bg-accent-primary/20 text-accent-primary hover:text-accent-primary border border-border-primary transition-all duration-200"
                                title="Copy this version's content"
                              >
                                <Icon icon={Copy} size={14} variant="primary" />
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
                        <div className="flex items-center justify-between pt-4 border-t border-border-primary">
                          <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1}-{Math.min(endIndex, totalVersions)} of {totalVersions} versions
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVersionPageChange(currentVersionPage - 1)}
                              disabled={currentVersionPage === 1}
                              className="p-2 rounded-lg border border-border-primary hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Icon icon={ChevronLeft} size={16} variant="primary" />
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
                              className="p-2 rounded-lg border border-border-primary hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Visibility Settings Card */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <Icon icon={Eye} size={24} variant="primary" />
                <h2 className="text-2xl font-semibold">Visibility & Sharing</h2>
              </div>
            </div>
            <div className="card-content space-y-6">
              {/* Team Visibility Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon icon={Users} size={20} className="text-accent-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Team Visibility</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Who can see this prompt?</label>
                  <select 
                    className="input border-2 border-accent-primary/30 focus:border-accent-primary transition-colors" 
                    value={visibility} 
                    onChange={e => setVisibility(e.target.value as 'PRIVATE' | 'TEAM')}
                    disabled={isEditing}
                  >
                    <option value="PRIVATE">🔒 Private - Only you can see</option>
                    <option value="TEAM">👥 Team - Visible to your team</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-accent-primary/20 bg-gradient-to-r from-surface-secondary to-surface-tertiary">
                  {getVisibilityIcon(visibility)}
                  <div>
                    <span className="text-sm font-medium text-foreground">{getVisibilityLabel(visibility)}</span>
                    <p className="text-xs text-muted-foreground">
                      {visibility === 'PRIVATE' 
                        ? 'This prompt is only visible to you' 
                        : 'This prompt is visible to your team members'
                      }
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleVisibilitySave}
                  disabled={isEditing}
                  className="btn-primary w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-secondary hover:to-accent-primary transition-all duration-200"
                >
                  <Icon icon={Save} size={18} className="mr-2" />
                  Save Visibility Settings
                </button>
              </div>

              {/* Public Sharing Section */}
              <div className="pt-6 border-t-2 border-accent-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon icon={Globe} size={20} variant="primary" />
                    <h3 className="text-lg font-semibold text-foreground">Public Sharing</h3>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border-2 border-accent-primary/20 bg-gradient-to-r from-surface-secondary to-surface-tertiary">
                    <div>
                      <p className="text-sm font-medium text-foreground">Share with anyone via public link</p>
                      <p className="text-xs text-muted-foreground">
                        {isPubliclyShared 
                          ? 'This prompt is publicly accessible' 
                          : 'This prompt is not publicly shared'
                        }
                      </p>
                    </div>
                    <button
                      onClick={handlePublicToggle}
                      disabled={isEditing}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isPubliclyShared 
                          ? 'bg-error/20 text-error hover:bg-error/30 border-2 border-error/30' 
                          : 'bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 border-2 border-accent-primary/30'
                      }`}
                    >
                      {isPubliclyShared ? '🔒 Disable' : '🌐 Enable'}
                    </button>
                  </div>
                  
                  {isPubliclyShared && publicShareId && (
                    <div className="p-4 bg-gradient-to-r from-accent-primary/10 to-accent-primary/5 rounded-xl border-2 border-accent-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon icon={Link} size={16} variant="primary" />
                        <span className="text-sm font-medium text-accent-primary">Public URL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={`${window.location.origin}/share/${publicShareId}`}
                          readOnly
                          className="input text-sm bg-background flex-1 border-2 border-accent-primary/30"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/share/${publicShareId}`)}
                          className="p-3 rounded-xl text-accent-primary hover:bg-accent-primary/20 transition-colors border-2 border-accent-primary/30"
                          title="Copy URL"
                        >
                          <Icon icon={Copy} size={16} variant="primary" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Anyone with this link can view your prompt
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Info Card */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <Icon icon={Tag} size={24} variant="primary" />
                <h2 className="text-2xl font-semibold">Prompt Info</h2>
              </div>
            </div>
            <div className="card-content space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon icon={Calendar} size={14} variant="primary" />
                <span>Created: {new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon icon={Clock} size={14} variant="primary" />
                <span>Updated: {new Date(data.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon icon={History} size={14} variant="primary" />
                <span>{totalVersions} versions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Prompt"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl">
            <Icon icon={AlertTriangle} size={24} variant="primary" />
            <div>
              <h3 className="font-semibold text-error">Warning: This action cannot be undone</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Deleting this prompt will permanently remove it and all its version history.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Prompt Details:</h4>
            <div className="p-3 bg-surface-secondary rounded-lg border border-border-primary">
              <p className="font-medium">{data.title}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {data.body}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {totalVersions} versions • Created {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-destructive flex items-center gap-2"
            >
              <Icon icon={isDeleting ? CheckCircle : Trash2} size={18} variant="primary" />
              {isDeleting ? 'Deleting...' : 'Delete Prompt'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


