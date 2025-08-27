"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all tags (for autocomplete)
router.get("/", auth_1.requireAuth, async (req, res) => {
    try {
        const tags = await prisma_1.prisma.tag.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { prompts: true }
                }
            }
        });
        return res.json(tags);
    }
    catch (error) {
        console.error('Failed to fetch tags:', error);
        return res.status(500).json({ error: "Failed to fetch tags" });
    }
});
// Get tag with usage count (admin only)
router.get("/:id", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await prisma_1.prisma.tag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { prompts: true }
                }
            }
        });
        if (!tag) {
            return res.status(404).json({ error: "Tag not found" });
        }
        return res.json(tag);
    }
    catch (error) {
        console.error('Failed to fetch tag:', error);
        return res.status(500).json({ error: "Failed to fetch tag" });
    }
});
// Update tag name (admin only)
router.put("/:id", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "Tag name is required" });
        }
        const trimmedName = name.trim();
        // Check if new name already exists
        const existingTag = await prisma_1.prisma.tag.findFirst({
            where: {
                name: trimmedName,
                id: { not: id }
            }
        });
        if (existingTag) {
            return res.status(400).json({ error: "Tag name already exists" });
        }
        const updatedTag = await prisma_1.prisma.tag.update({
            where: { id },
            data: { name: trimmedName },
            include: {
                _count: {
                    select: { prompts: true }
                }
            }
        });
        return res.json(updatedTag);
    }
    catch (error) {
        console.error('Failed to update tag:', error);
        return res.status(500).json({ error: "Failed to update tag" });
    }
});
// Delete tag (admin only) - only if not used by any prompts
router.delete("/:id", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Check if tag is used by any prompts
        const tagUsage = await prisma_1.prisma.promptTag.count({
            where: { tagId: id }
        });
        if (tagUsage > 0) {
            return res.status(400).json({
                error: "Cannot delete tag that is still in use",
                usageCount: tagUsage
            });
        }
        // Delete the tag
        await prisma_1.prisma.tag.delete({
            where: { id }
        });
        return res.json({ message: "Tag deleted successfully" });
    }
    catch (error) {
        console.error('Failed to delete tag:', error);
        return res.status(500).json({ error: "Failed to delete tag" });
    }
});
exports.default = router;
