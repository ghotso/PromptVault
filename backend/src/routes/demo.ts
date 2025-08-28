import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Demo API key for seeding - must be set via environment variable
const DEMO_API_KEY = process.env.DEMO_API_KEY;

if (!DEMO_API_KEY) {
  console.warn('WARNING: DEMO_API_KEY environment variable not set. Demo endpoints will be disabled.');
}

// Demo data
const demoData = {
  users: [
    {
      email: "demo.admin@promptvault.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo12345
      name: "Demo Admin",
      team: "Engineering",
      role: "ADMIN" as const,
    },
    {
      email: "demo.user@promptvault.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo12345
      name: "Demo User",
      team: "Marketing",
      role: "USER" as const,
    },
    {
      email: "demo.team@promptvault.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo12345
      name: "Team Member",
      team: "Engineering",
      role: "USER" as const,
    },
  ],
  teams: [
    { name: "Engineering" },
    { name: "Marketing" },
    { name: "Sales" },
    { name: "Design" },
  ],
  tags: [
    "AI",
    "Productivity",
    "Writing",
    "Code",
    "Marketing",
    "Sales",
    "Design",
    "Analysis",
    "Creative",
    "Technical",
  ],
  prompts: [
    {
      title: "Professional Email Writer",
      body: "Write a professional email to {recipient} regarding {subject}. The tone should be {tone} and include {specific_details}.",
      variables: "recipient, subject, tone, specific_details",
      notes: "Perfect for business communication. Adjust tone based on recipient seniority.",
      modelHints: "You are a professional business communication expert.",
      visibility: "TEAM" as const,
      isPubliclyShared: true,
      tags: ["Writing", "Business", "Communication"],
      ratings: [5, 4, 5],
    },
    {
      title: "Code Review Assistant",
      body: "Review this {language} code for {review_focus}: {code_snippet}. Provide specific feedback on {aspects}.",
      variables: "language, review_focus, code_snippet, aspects",
      notes: "Great for code quality improvement. Focus on readability and best practices.",
      modelHints: "You are a senior software engineer with expertise in code review.",
      visibility: "TEAM" as const,
      isPubliclyShared: false,
      tags: ["Code", "Technical", "Review"],
      ratings: [5, 5, 4],
    },
    {
      title: "Social Media Post Generator",
      body: "Create a {platform} post about {topic} with {tone} tone. Include {call_to_action} and target {audience}.",
      variables: "platform, topic, tone, call_to_action, audience",
      notes: "Optimized for engagement. Use platform-specific best practices.",
      modelHints: "You are a social media marketing expert.",
      visibility: "PRIVATE" as const,
      isPubliclyShared: true,
      tags: ["Marketing", "Social Media", "Creative"],
      ratings: [4, 4, 5],
    },
    {
      title: "Meeting Agenda Creator",
      body: "Create a meeting agenda for {meeting_type} with {duration} duration. Include {key_topics} and assign {responsibilities}.",
      variables: "meeting_type, duration, key_topics, responsibilities",
      notes: "Structured approach to meeting planning. Ensures productivity.",
      modelHints: "You are a project management professional.",
      visibility: "TEAM" as const,
      isPubliclyShared: false,
      tags: ["Productivity", "Business", "Planning"],
      ratings: [5, 4, 4],
    },
    {
      title: "Data Analysis Framework",
      body: "Analyze {data_type} data focusing on {analysis_goal}. Provide insights on {key_metrics} and recommendations for {improvement_areas}.",
      variables: "data_type, analysis_goal, key_metrics, improvement_areas",
      notes: "Comprehensive data analysis approach. Good for reports and presentations.",
      modelHints: "You are a data analyst with expertise in business intelligence.",
      visibility: "PRIVATE" as const,
      isPubliclyShared: false,
      tags: ["Analysis", "Data", "Business"],
      ratings: [4, 5, 4],
    },
    {
      title: "Creative Writing Prompt",
      body: "Write a {genre} story about {main_character} who discovers {discovery}. The story should explore {theme} and include {plot_elements}.",
      variables: "genre, main_character, discovery, theme, plot_elements",
      notes: "Creative writing inspiration. Great for writers block.",
      modelHints: "You are a creative writing instructor and published author.",
      visibility: "TEAM" as const,
      isPubliclyShared: true,
      tags: ["Creative", "Writing", "Storytelling"],
      ratings: [5, 5, 5],
    },
  ],
};

// Middleware to check demo API key
const requireDemoKey = (req: any, res: any, next: any) => {
  // Check if demo API key is configured
  if (!DEMO_API_KEY) {
    return res.status(503).json({ 
      error: "Demo mode not configured",
      message: "DEMO_API_KEY environment variable is not set"
    });
  }

  const apiKey = req.headers["x-demo-api-key"] || req.query.apiKey;
  
  if (apiKey !== DEMO_API_KEY) {
    return res.status(401).json({ 
      error: "Invalid demo API key",
      message: "Use x-demo-api-key header or apiKey query parameter"
    });
  }
  
  next();
};

// Seed demo data
router.post("/seed", requireDemoKey, async (req, res) => {
  try {
    console.log("Starting demo data seeding...");
    
    // Clear existing data (except settings)
    await prisma.$transaction(async (tx: any) => {
      console.log("Clearing existing data...");
      await tx.rating.deleteMany();
      await tx.promptVersion.deleteMany();
      await tx.promptTag.deleteMany();
      await tx.prompt.deleteMany();
      await tx.userTeam.deleteMany();
      await tx.user.deleteMany();
      await tx.team.deleteMany();
      await tx.tag.deleteMany();
      
      console.log("Existing data cleared");
    });

    // Create teams
    console.log("Creating teams...");
    const teams = await Promise.all(
      demoData.teams.map(team => 
        prisma.team.create({ data: team })
      )
    );
    console.log(`${teams.length} teams created`);

    // Create tags
    console.log("Creating tags...");
    const tags = await Promise.all(
      demoData.tags.map(tag => 
        prisma.tag.create({ data: { name: tag } })
      )
    );
    console.log(`${tags.length} tags created`);

    // Create users
    console.log("Creating users...");
    const users = await Promise.all(
      demoData.users.map(async (userData) => {
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            password: userData.password,
            name: userData.name,
            team: userData.team,
            role: userData.role,
          }
        });

        // Assign user to team
        const team = teams.find(t => t.name === userData.team);
        if (team) {
          await prisma.userTeam.create({
            data: {
              userId: user.id,
              teamId: team.id,
            }
          });
        }

        return user;
      })
    );
    console.log(`${users.length} users created`);

    // Create prompts
    console.log("Creating prompts...");
    const prompts = await Promise.all(
      demoData.prompts.map(async (promptData) => {
        const user = users.find(u => u.team === (promptData.visibility === "TEAM" ? "Engineering" : "Marketing")) || users[0];
        
        const prompt = await prisma.prompt.create({
          data: {
            title: promptData.title,
            body: promptData.body,
            variables: promptData.variables,
            notes: promptData.notes,
            modelHints: promptData.modelHints,
            visibility: promptData.visibility,
            isPubliclyShared: promptData.isPubliclyShared,
            publicShareId: promptData.isPubliclyShared ? `demo_${Math.random().toString(36).substr(2, 9)}` : null,
            userId: user.id,
          }
        });

        // Add tags
        if (promptData.tags.length > 0) {
          const promptTags = promptData.tags.map(tagName => {
            const tag = tags.find(t => t.name === tagName);
            return tag ? { promptId: prompt.id, tagId: tag.id } : null;
          }).filter((tag): tag is { promptId: string; tagId: string } => tag !== null);

          if (promptTags.length > 0) {
            await prisma.promptTag.createMany({
              data: promptTags
            });
          }
        }

        // Add ratings
        if (promptData.ratings.length > 0) {
          const ratings = promptData.ratings.map((rating, index) => ({
            value: rating,
            promptId: prompt.id,
            userId: users[index % users.length].id,
          }));

          await prisma.rating.createMany({
            data: ratings
          });
        }

        return prompt;
      })
    );
    console.log(`${prompts.length} prompts created`);

    // Ensure settings exist
    await prisma.settings.upsert({
      where: { id: 1 },
      update: { allowRegistration: true },
      create: { allowRegistration: true }
    });

    console.log("Demo data seeding completed successfully!");
    
    res.json({
      success: true,
      message: "Demo data seeded successfully",
      stats: {
        teams: teams.length,
        tags: tags.length,
        users: users.length,
        prompts: prompts.length,
      }
    });

  } catch (error) {
    console.error("Demo seeding failed:", error);
    res.status(500).json({
      error: "Demo seeding failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get demo status
router.get("/status", requireDemoKey, async (req, res) => {
  try {
    const [userCount, promptCount, tagCount, teamCount] = await Promise.all([
      prisma.user.count(),
      prisma.prompt.count(),
      prisma.tag.count(),
      prisma.team.count(),
    ]);

    res.json({
      success: true,
      stats: {
        users: userCount,
        prompts: promptCount,
        tags: tagCount,
        teams: teamCount,
      },
      lastSeeded: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get demo status",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
