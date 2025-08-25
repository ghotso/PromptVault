import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { Icon } from '../components/icons'
import LoginPrompt from '../components/LoginPrompt'
import { User, Shield, Building2, Save, CheckCircle } from 'lucide-react'

export default function Account() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [teams, setTeams] = useState<{id: string; name: string}[]>([])

  useEffect(() => { 
    if (user) { 
      setName(user.name || ''); 
    } 
    // Fetch teams to display team names
    api<{id: string; name: string}[]>("/admin/teams").then(setTeams).catch(() => setTeams([]))
  }, [user])

  if (!user) return <LoginPrompt />

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await api('/auth/profile', { 
        method: 'PUT', 
        body: JSON.stringify({ 
          name, 
          password: password || undefined 
        }) 
      })
      setPassword('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Get team name from teams array
  const teamName = user.team ? teams.find(t => t.id === user.team)?.name || user.team : null

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Icon icon={User} size={36} color="rgb(198 247 40)" />
          Account Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <Icon icon={User} size={24} color="rgb(198 247 40)" />
            <h2 className="text-2xl font-semibold">Profile Information</h2>
          </div>
        </div>
        <div className="card-content space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
            <input 
              className="input" 
              placeholder="Enter your full name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Team Assignment</label>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border-primary bg-surface-secondary">
              <Icon icon={Building2} size={20} className="text-accent-secondary" />
              <span className={teamName ? "text-foreground font-medium" : "text-muted-foreground italic"}>
                {teamName || 'No team assigned'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Team assignments are managed by administrators
            </p>
          </div>
        </div>
      </div>

      {/* Security Settings Card */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <Icon icon={Shield} size={24} className="text-accent-secondary" />
            <h2 className="text-2xl font-semibold">Security Settings</h2>
          </div>
        </div>
        <div className="card-content">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">New Password</label>
            <input 
              className="input" 
              placeholder="Enter new password (leave blank to keep current)" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <p className="text-sm text-muted-foreground mt-2">
              Leave this field empty if you don't want to change your password
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button 
          className="btn-primary flex items-center gap-2 px-8 py-3 text-lg"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Icon icon={isSaving ? CheckCircle : Save} size={20} color="rgb(13 27 42)" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        
        {showSuccess && (
          <div className="flex items-center gap-2 text-success">
            <Icon icon={CheckCircle} size={20} />
            <span className="font-medium">Profile saved successfully!</span>
          </div>
        )}
      </div>
    </div>
  )
}


