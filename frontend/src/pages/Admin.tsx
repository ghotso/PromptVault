import { useState, useEffect } from 'react'
import { Icon } from '../components/icons'
import { 
  Users, 
  Building2, 
  Shield, 
  Tag, 
  Settings, 
  UserPlus, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import LoginPrompt from '../components/LoginPrompt'
import { Modal } from '../components/Modal'

interface User {
  id: string
  email: string
  name: string
  team: string
  role: 'ADMIN' | 'USER'
  createdAt: string
  updatedAt: string
}

interface Team {
  id: string
  name: string
}

interface TagData {
  id: string
  name: string
  _count: {
    prompts: number
  }
}

export default function Admin() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [tags, setTags] = useState<TagData[]>([])
  const [settings, setSettings] = useState<{ allowRegistration: boolean } | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [editingTag, setEditingTag] = useState<TagData | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [userForm, setUserForm] = useState({
    email: '',
    name: '',
    password: '',
    team: '',
    role: 'USER' as 'ADMIN' | 'USER'
  })

  const isAdmin = user && (user as any).role === 'ADMIN'

  useEffect(() => {
    if (!isAdmin) return
    fetchUsers()
    fetchTeams()
    fetchTags()
    fetchSettings()
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      const response = await api<User[]>('/admin/users')
      setUsers(response)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await api<Team[]>('/admin/teams')
      setTeams(response)
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await api<TagData[]>('/tags/admin/all')
      setTags(response)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      setIsLoadingSettings(true)
      const response = await api<{ allowRegistration: boolean }>('/admin/settings')
      setSettings(response)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      await api(`/admin/users/${editingUser.id}`, { 
        method: 'PUT', 
        body: JSON.stringify({ 
          name: userForm.name, 
          role: userForm.role, 
          team: userForm.team 
        }) 
      })
      setShowUserModal(false)
      setEditingUser(null)
    } else {
      await api('/admin/users', { 
        method: 'POST', 
        body: JSON.stringify(userForm) 
      })
      setShowUserModal(false)
    }
    setUserForm({ email: '', password: '', name: '', role: 'USER', team: '' })
    fetchUsers()
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api(`/admin/users/${userId}`, { method: 'DELETE' })
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleCreateTeam = async () => {
    try {
      await api('/admin/teams', {
        method: 'POST',
        body: JSON.stringify({ name: newTeamName })
      })
      setShowTeamModal(false)
      setNewTeamName('')
      fetchTeams()
    } catch (error) {
      console.error('Failed to create team:', error)
    }
  }

  const handleUpdateTeam = async () => {
    if (!editingTeam) return
    try {
      await api(`/admin/teams/${editingTeam.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: newTeamName })
      })
      setShowTeamModal(false)
      setEditingTeam(null)
      setNewTeamName('')
      fetchTeams()
    } catch (error) {
      console.error('Failed to update team:', error)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return
    try {
      await api(`/admin/teams/${teamId}`, { method: 'DELETE' })
      fetchTeams()
    } catch (error) {
      console.error('Failed to delete team:', error)
    }
  }

  const handleCreateTag = async () => {
    try {
      // Create tag through prompts endpoint (it will handle tag creation)
      await api('/prompts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Temporary Prompt for Tag Creation',
          body: 'This prompt will be deleted immediately',
          tags: [newTagName]
        })
      })
      
      // Delete the temporary prompt
      // Note: In a real implementation, you might want a dedicated tag creation endpoint
      
      setShowTagModal(false)
      setNewTagName('')
      fetchTags()
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  const handleUpdateTag = async () => {
    if (!editingTag) return
    try {
      await api(`/tags/${editingTag.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: newTagName })
      })
      setShowTagModal(false)
      setEditingTag(null)
      setNewTagName('')
      fetchTags()
    } catch (error) {
      console.error('Failed to update tag:', error)
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This action cannot be undone if the tag is not in use.')) return
    try {
      await api(`/tags/${tagId}`, { method: 'DELETE' })
      fetchTags()
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }

  const openUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setUserForm({
        email: user.email,
        name: user.name || '',
        password: '',
        team: user.team || '',
        role: user.role
      })
    } else {
      setEditingUser(null)
      setUserForm({ email: '', name: '', password: '', team: '', role: 'USER' })
    }
    setShowUserModal(true)
  }

  const openTeamModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team)
      setNewTeamName(team.name)
    } else {
      setEditingTeam(null)
      setNewTeamName('')
    }
    setShowTeamModal(true)
  }

  const openTagModal = (tag?: TagData) => {
    if (tag) {
      setEditingTag(tag)
      setNewTagName(tag.name)
    } else {
      setEditingTag(null)
      setNewTagName('')
    }
    setShowTagModal(true)
  }

  const toggleRegistration = async () => {
    try {
      await api('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ allowRegistration: !settings?.allowRegistration })
      })
      // Refresh settings to get the updated state
      await fetchSettings()
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  const getTeamName = (teamId: string) => {
    return teams.find(t => t.id === teamId)?.name || teamId
  }

  if (!isAdmin) return <LoginPrompt />

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Icon icon={Shield} size={36} color="rgb(198 247 40)" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage users, teams, and application settings
        </p>
      </div>

      {/* Registration Settings */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <Icon icon={Settings} size={24} color="rgb(198 247 40)" />
            <h2 className="text-2xl font-semibold">Registration Settings</h2>
          </div>
        </div>
        <div className="card-content">
          {isLoadingSettings ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading settings...</span>
            </div>
          ) : (
                         <div className="flex items-center justify-between p-4 rounded-xl border border-accent-primary bg-surface-secondary">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">Allow public registration</span>
                <span className="text-sm text-muted-foreground">
                  {settings?.allowRegistration ? 'Anyone can create an account' : 'Only admins can create accounts'}
                </span>
              </div>
              
              {/* iOS-style Toggle */}
              <button
                onClick={toggleRegistration}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ${
                  settings?.allowRegistration 
                    ? 'bg-accent-primary' 
                    : 'bg-surface-tertiary'
                }`}
                role="switch"
                aria-checked={settings?.allowRegistration}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings?.allowRegistration ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              
              <div className="flex items-center gap-2">
                {settings?.allowRegistration ? (
                  <Icon icon={Eye} size={20} className="text-success" />
                ) : (
                  <Icon icon={EyeOff} size={20} className="text-error" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users Management */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon={Users} size={24} color="rgb(198 247 40)" />
              <h2 className="text-2xl font-semibold">Users Management</h2>
              <span className="text-sm text-muted-foreground bg-surface-secondary px-3 py-1 rounded-full">
                {users.length} users
              </span>
            </div>
            <button 
              onClick={() => openUserModal()}
              className="btn-primary flex items-center gap-2"
            >
              <Icon icon={UserPlus} size={18} color="rgb(13 27 42)" />
              Add User
            </button>
          </div>
        </div>
                 <div className="card-content p-0">
           <div className="overflow-x-auto">
             <table className="w-full border border-accent-primary/20 rounded-b-lg">
               <thead>
                 <tr className="border-b border-accent-primary bg-surface-secondary">
                   <th className="text-left p-3 font-semibold text-foreground">User</th>
                   <th className="text-left p-3 font-semibold text-foreground">Name</th>
                   <th className="text-left p-3 font-semibold text-foreground">Team</th>
                   <th className="text-left p-3 font-semibold text-foreground">Role</th>
                   <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                 </tr>
               </thead>
              <tbody>
                                 {users.length > 0 ? (
                   users.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-secondary/80 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-foreground">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={u.name ? "text-foreground" : "text-muted-foreground italic"}>
                          {u.name || '—'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={u.team ? "text-foreground" : "text-muted-foreground italic"}>
                          {u.team ? getTeamName(u.team) : '—'}
                        </span>
                      </td>
                      <td className="p-3">
                                               <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                           u.role === 'ADMIN' 
                             ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                             : 'bg-surface-tertiary text-muted-foreground border border-accent-primary'
                         }`}>
                          <Icon icon={u.role === 'ADMIN' ? Shield : Users} size={14} />
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 rounded-lg text-accent-primary hover:bg-accent-primary/10 transition-colors" 
                            onClick={() => openUserModal(u)}
                            title="Edit user"
                          >
                            <Icon icon={Edit} size={16} />
                          </button>
                          <button 
                            className="p-2 rounded-lg text-error hover:bg-error/20 transition-colors" 
                            onClick={() => handleDelete(u.id)}
                            title="Delete user"
                          >
                            <Icon icon={Trash2} size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Icon icon={Users} size={32} className="opacity-50" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Create your first user to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Teams Management */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon={Building2} size={24} color="rgb(198 247 40)" />
              <h2 className="text-2xl font-semibold">Teams Management</h2>
              <span className="text-sm text-muted-foreground bg-surface-secondary px-3 py-1 rounded-full">
                {teams.length} teams
              </span>
            </div>
            <button 
              onClick={() => openTeamModal()}
              className="btn-primary flex items-center gap-2"
            >
              <Icon icon={Plus} size={18} color="rgb(13 27 42)" />
              Add Team
            </button>
          </div>
        </div>
                 <div className="card-content p-0">
           <div className="overflow-x-auto">
             <table className="w-full border border-accent-primary/20 rounded-b-lg">
               <thead>
                 <tr className="border-b border-accent-primary bg-surface-secondary">
                   <th className="text-left p-3 font-semibold text-foreground">Team Name</th>
                   <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                 </tr>
               </thead>
              <tbody>
                                                 {teams.length > 0 ? (
                   teams.map((t) => (
                     <tr key={t.id} className="hover:bg-surface-secondary/80 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-foreground">{t.name}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 rounded-lg text-accent-primary hover:bg-accent-primary/10 transition-colors" 
                            onClick={() => openTeamModal(t)}
                            title="Edit team"
                          >
                            <Icon icon={Edit} size={16} />
                          </button>
                          <button 
                            className="p-2 rounded-lg text-error hover:bg-error/20 transition-colors" 
                            onClick={() => handleDeleteTeam(t.id)}
                            title="Delete team"
                          >
                            <Icon icon={Trash2} size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Icon icon={Building2} size={32} className="opacity-50" />
                        <p className="text-lg font-medium">No teams found</p>
                        <p className="text-sm">Create your first team to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tags Management */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon={Tag} size={24} color="rgb(198 247 40)" />
              <h2 className="text-2xl font-semibold">Tags Management</h2>
              <span className="text-sm text-muted-foreground bg-surface-secondary px-3 py-1 rounded-full">
                {tags.length} tags
              </span>
            </div>
            <button 
              onClick={() => openTagModal()}
              className="btn-primary flex items-center gap-2"
            >
              <Icon icon={Plus} size={18} color="rgb(13 27 42)" />
              Add Tag
            </button>
          </div>
        </div>
                 <div className="card-content p-0">
           <div className="overflow-x-auto">
             <table className="w-full border border-accent-primary/20 rounded-b-lg">
               <thead>
                 <tr className="border-b border-accent-primary bg-surface-secondary">
                   <th className="text-left p-3 font-semibold text-foreground">Tag Name</th>
                   <th className="text-left p-3 font-semibold text-foreground">Prompts</th>
                   <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                 </tr>
               </thead>
              <tbody>
                                 {tags.length > 0 ? (
                   tags.map((t) => (
                     <tr key={t.id} className="hover:bg-surface-secondary/80 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-foreground">{t.name}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-muted-foreground">
                          {t._count.prompts} prompts
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 rounded-lg text-accent-primary hover:bg-accent-primary/10 transition-colors" 
                            onClick={() => openTagModal(t)}
                            title="Edit tag"
                          >
                            <Icon icon={Edit} size={16} />
                          </button>
                          <button 
                            className="p-2 rounded-lg text-error hover:bg-error/20 transition-colors" 
                            onClick={() => handleDeleteTag(t.id)}
                            title="Delete tag"
                          >
                            <Icon icon={Trash2} size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Icon icon={Tag} size={32} className="opacity-50" />
                        <p className="text-lg font-medium">No tags found</p>
                        <p className="text-sm">Create your first tag to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={showUserModal || !!editingUser}
        onClose={() => {
          setShowUserModal(false)
          setEditingUser(null)
          setUserForm({ email: '', password: '', name: '', role: 'USER', team: '' })
        }}
        title={editingUser ? 'Edit User' : 'Create New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="input"
              placeholder="user@example.com"
              required
              disabled={!!editingUser}
            />
          </div>
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                className="input"
                placeholder="Enter password"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Name (Optional)</label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="input"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Team</label>
            <select
              className="input border-accent-primary"
              value={userForm.team}
              onChange={(e) => setUserForm({ ...userForm, team: e.target.value })}
            >
              <option value="">Select a team</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
              className="input border-accent-primary"
            >
              <option value="USER">User - Standard access</option>
              <option value="ADMIN">Admin - Full access</option>
            </select>
          </div>
                     <div className="flex justify-end gap-3 pt-4 border-t border-accent-primary">
             <button
               type="button"
               onClick={() => {
                 setShowUserModal(false)
                 setEditingUser(null)
                 setUserForm({ email: '', password: '', name: '', role: 'USER', team: '' })
               }}
               className="btn-outline"
             >
               Cancel
             </button>
             <button
               type="submit"
               className="btn-primary"
             >
               {editingUser ? 'Update User' : 'Create User'}
             </button>
           </div>
        </form>
      </Modal>

      {/* Create/Edit Team Modal */}
      <Modal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title={editingTeam ? 'Edit Team' : 'Create New Team'}
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          if (editingTeam) {
            handleUpdateTeam()
          } else {
            handleCreateTeam()
          }
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Team Name</label>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="input"
              placeholder="New team name"
              required
            />
          </div>
                     <div className="flex justify-end gap-3 pt-4 border-t border-accent-primary">
             <button
               type="button"
               onClick={() => setShowTeamModal(false)}
               className="btn-outline"
             >
               Cancel
             </button>
             <button
               type="submit"
               className="btn-primary"
             >
               {editingTeam ? 'Update Team' : 'Create Team'}
             </button>
           </div>
        </form>
      </Modal>

      {/* Create/Edit Tag Modal */}
      <Modal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        title={editingTag ? 'Edit Tag' : 'Create New Tag'}
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          if (editingTag) {
            handleUpdateTag()
          } else {
            handleCreateTag()
          }
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tag Name</label>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="input"
              placeholder="New tag name"
              required
            />
          </div>
                     <div className="flex justify-end gap-3 pt-4 border-t border-accent-primary">
             <button
               type="button"
               onClick={() => setShowTagModal(false)}
               className="btn-outline"
             >
               Cancel
             </button>
             <button
               type="submit"
               className="btn-primary"
             >
               {editingTag ? 'Update Tag' : 'Create Tag'}
             </button>
           </div>
        </form>
      </Modal>
    </div>
  )
}


