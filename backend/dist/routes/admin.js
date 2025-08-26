"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all users
router.get('/users', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                team: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Create user
router.post('/users', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const { email, password, name, role, team } = req.body;
        // Hash password if provided
        let hashedPassword = password;
        if (password) {
            const bcrypt = await Promise.resolve().then(() => __importStar(require('bcryptjs')));
            hashedPassword = await bcrypt.default.hash(password, 10);
        }
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'USER',
                team
            }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});
// Update user
router.put('/users/:id', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, name, role, team } = req.body;
        // Prepare update data
        const updateData = { email, name, role, team };
        if (password) {
            const bcrypt = await Promise.resolve().then(() => __importStar(require('bcryptjs')));
            updateData.password = await bcrypt.default.hash(password, 10);
        }
        const user = await prisma_1.prisma.user.update({
            where: { id },
            data: updateData
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});
// Delete user
router.delete('/users/:id', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
// Get settings
router.get('/settings', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const settings = await prisma_1.prisma.settings.findFirst();
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});
// Update settings
router.put('/settings', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const { allowRegistration } = req.body;
        const settings = await prisma_1.prisma.settings.upsert({
            where: { id: 1 },
            update: { allowRegistration },
            create: { id: 1, allowRegistration }
        });
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});
exports.default = router;
