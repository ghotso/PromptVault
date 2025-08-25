import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, requireAdmin } from '../middleware/auth'

const router = Router()

// Get all users
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        team: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Create user
router.post('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { email, password, name, role, team } = req.body
    
    // Hash password if provided
    let hashedPassword = password
    if (password) {
      const bcrypt = await import('bcryptjs')
      hashedPassword = await bcrypt.default.hash(password, 10)
    }
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER',
        team
      }
    })
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Update user
router.put('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { email, password, name, role, team } = req.body
    
    // Prepare update data
    const updateData: any = { email, name, role, team }
    if (password) {
      const bcrypt = await import('bcryptjs')
      updateData.password = await bcrypt.default.hash(password, 10)
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// Delete user
router.delete('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    await prisma.user.delete({ where: { id } })
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// Get settings
router.get('/settings', requireAuth, requireAdmin, async (req, res) => {
  try {
    const settings = await prisma.settings.findFirst()
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

// Update settings
router.put('/settings', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { allowRegistration } = req.body
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { allowRegistration },
      create: { id: 1, allowRegistration }
    })
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

export default router


