# Creating Prompts

This guide will teach you how to create, edit, and manage prompts effectively in PromptVault. Learn the best practices for organizing your AI prompts and maximizing their usefulness.

## 📝 Creating Your First Prompt

### Step 1: Access the Create Form

1. **From the Prompts page**: Click the "New Prompt" button
2. **From the navigation**: Use the "+" button in the top navigation
3. **Keyboard shortcut**: `Ctrl+N` (or `Cmd+N` on Mac)

### Step 2: Fill in the Basic Information

#### Title
- **Purpose**: Give your prompt a descriptive, memorable name
- **Best Practices**:
  - Use clear, descriptive titles
  - Include the purpose or use case
  - Keep it concise but informative
  - Examples: "Email Writing Assistant", "Code Review Checklist", "Creative Story Generator"

#### Content
- **Purpose**: The actual prompt text that you'll use with AI
- **Best Practices**:
  - Be specific and detailed
  - Include examples when helpful
  - Use clear instructions
  - Test your prompts before saving
  - Examples:
    ```
    Write a professional email response to a client inquiry. 
    The email should be:
    - Polite and professional
    - Address all their questions
    - Include next steps
    - Be concise but complete
    
    Client inquiry: [INSERT INQUIRY HERE]
    ```

### Step 3: Add Optional Fields

#### Variables
- **Purpose**: Define placeholders that can be filled in when using the prompt
- **Format**: Use square brackets `[VARIABLE_NAME]`
- **Examples**:
  ```
  [TOPIC] - The subject to write about
  [TONE] - The writing tone (formal, casual, friendly)
  [LENGTH] - Desired length (short, medium, long)
  [AUDIENCE] - Target audience
  ```

#### Notes
- **Purpose**: Additional context, tips, or instructions
- **Best Practices**:
  - Explain when to use this prompt
  - Include tips for better results
  - Note any limitations or considerations
  - Examples:
    ```
    This prompt works best with GPT-4 and Claude.
    Use for formal business communications.
    Adjust the tone based on the client relationship.
    ```

#### Model Hints
- **Purpose**: Specify which AI models work best with this prompt
- **Examples**:
  ```
  GPT-4, Claude-3, Gemini Pro
  Best with: GPT-4
  Avoid: GPT-3.5 (inconsistent results)
  ```

### Step 4: Add Tags

#### Tag System
- **Purpose**: Organize and categorize your prompts
- **Features**:
  - Autocomplete with existing tags
  - Create new tags on the fly
  - See tag usage counts
  - Color-coded for easy identification

#### Tagging Best Practices
- **Use consistent naming**: `ai-writing`, `code-review`, `customer-service`
- **Create hierarchies**: `ai-writing/emails`, `ai-writing/blog-posts`
- **Use descriptive tags**: `urgent`, `draft`, `production-ready`
- **Tag by function**: `writing`, `coding`, `analysis`, `creative`
- **Tag by domain**: `marketing`, `development`, `customer-support`

#### Common Tag Categories
- **By Function**: `writing`, `coding`, `analysis`, `creative`, `research`
- **By Domain**: `marketing`, `development`, `sales`, `support`, `hr`
- **By Urgency**: `urgent`, `normal`, `low-priority`
- **By Status**: `draft`, `review`, `approved`, `deprecated`
- **By AI Model**: `gpt-4`, `claude`, `gemini`, `universal`

### Step 5: Set Visibility

#### Visibility Options
- **Private**: Only you can see and use this prompt
- **Team**: All team members can see and use this prompt
- **Public**: Anyone with the link can view this prompt

#### Choosing Visibility
- **Private**: Personal prompts, work-in-progress, sensitive content
- **Team**: Shared workflows, team standards, collaborative prompts
- **Public**: Templates, examples, educational content

### Step 6: Save Your Prompt

1. **Click "Save"** to create the prompt
2. **Review the confirmation** message
3. **Navigate to the prompt details** to see your new prompt

## ✏️ Editing Prompts

### Accessing Edit Mode

#### From Prompt Details
1. Click the "Edit" button in the prompt details page
2. Make your changes
3. Click "Save" to update

#### From Prompts List
1. Click the edit icon on a prompt card
2. Make your changes
3. Click "Save" to update

### Version History

#### Automatic Versioning
- **Every save creates a new version**
- **Previous versions are preserved**
- **You can view and copy any version**
- **Version history is paginated for large histories**

#### Viewing Versions
1. **Go to prompt details**
2. **Click "Version History"**
3. **Browse through versions**
4. **Click on a version to view it**
5. **Use "Copy Version" to copy specific version content**

#### Version Information
- **Timestamp**: When the version was created
- **Changes**: What was modified (title, content, notes)
- **Author**: Who made the changes
- **Size**: Character count of the content

## 🏷️ Tag Management

### Adding Tags

#### Method 1: Type and Create
1. **Start typing** in the tag input field
2. **Select from suggestions** or press Enter to create new
3. **Tags are created automatically** when you press Enter

#### Method 2: Select from Existing
1. **Click the dropdown arrow** in the tag input
2. **Browse existing tags** with usage counts
3. **Click to select** a tag

### Managing Tags

#### Viewing Tag Usage
- **In tag dropdown**: See usage count for each tag
- **In admin panel**: View detailed tag statistics
- **In prompt details**: See all tags associated with a prompt

#### Tag Best Practices
- **Use consistent naming conventions**
- **Create tag hierarchies** with forward slashes
- **Regularly review and clean up unused tags**
- **Use descriptive, searchable tag names**

## 🔍 Search and Discovery

### Finding Prompts

#### Search Bar
- **Full-text search** across titles, content, and tags
- **Real-time results** as you type
- **Highlighted matches** in search results
- **Search history** for quick access

#### Filtering
- **By tags**: Filter prompts by specific tags
- **By visibility**: Show only private, team, or public prompts
- **By date**: Filter by creation or update date
- **By rating**: Filter by prompt ratings

#### Sorting Options
- **Recently updated**: Most recently modified first
- **Alphabetical**: Sort by title A-Z
- **Most used**: Sort by usage frequency
- **Highest rated**: Sort by average rating

## 📊 Prompt Analytics

### Viewing Statistics

#### Prompt Details
- **Version count**: How many versions exist
- **Last updated**: When it was last modified
- **Usage frequency**: How often it's accessed
- **Rating**: Average user rating

#### Team Analytics
- **Most popular prompts**: Most accessed team prompts
- **Active contributors**: Who's sharing the most
- **Tag usage**: Most common tags across team

## 🔄 Sharing and Collaboration

### Team Sharing

#### Making Prompts Team Visible
1. **Edit the prompt**
2. **Change visibility to "Team"**
3. **Save the prompt**
4. **Team members can now see it in Team Feed**

#### Team Feed Features
- **Read-only access**: Team members can view but not edit
- **Copy functionality**: Copy team prompts to your personal library
- **Author attribution**: See who shared each prompt
- **Search and filter**: Find team prompts easily

### Public Sharing

#### Making Prompts Public
1. **Go to prompt details**
2. **Click "Share Publicly"**
3. **Copy the generated URL**
4. **Share the URL with anyone**

#### Public Prompt Features
- **No authentication required**: Anyone with the URL can view
- **Read-only**: Public users cannot edit
- **Copy functionality**: Copy public prompts to your library
- **Responsive design**: Works on all devices

## 💡 Best Practices

### Writing Effective Prompts

#### Structure Your Prompts
1. **Clear objective**: What should the AI accomplish?
2. **Context**: Provide necessary background information
3. **Instructions**: Step-by-step guidance
4. **Examples**: Show the desired output format
5. **Constraints**: Set boundaries and limitations

#### Example of a Well-Structured Prompt
```
# Email Response Generator

## Objective
Generate a professional email response to a client inquiry.

## Context
You are a customer service representative for [COMPANY_NAME].

## Instructions
1. Acknowledge the client's inquiry
2. Address each of their questions
3. Provide clear next steps
4. Maintain a professional, helpful tone
5. Keep the response concise but complete

## Format
- Subject: Re: [ORIGINAL_SUBJECT]
- Greeting: Dear [CLIENT_NAME],
- Body: [RESPONSE_CONTENT]
- Closing: Best regards, [YOUR_NAME]

## Example
Client inquiry: "I'm having trouble with my account login. Can you help?"

Response should include:
- Acknowledgment of the issue
- Step-by-step troubleshooting
- Contact information for further help
- Offer to escalate if needed
```

### Organizing Your Prompts

#### Use Consistent Naming
- **Prefix by category**: `AI-Writing: Email Templates`
- **Include version info**: `Code Review v2.1`
- **Add status indicators**: `[DRAFT] Marketing Copy`

#### Create Tag Hierarchies
- **Function/domain/topic**: `writing/emails/customer-service`
- **Priority/status**: `urgent/production-ready`
- **AI model compatibility**: `gpt-4/claude-3/universal`

#### Regular Maintenance
- **Review and update** prompts regularly
- **Archive outdated** prompts
- **Consolidate similar** prompts
- **Update tags** as your needs change

### Team Collaboration

#### Sharing Guidelines
- **Document your prompts** with clear notes
- **Use consistent tagging** across the team
- **Regular team reviews** of shared prompts
- **Version control** for important prompts

#### Team Standards
- **Naming conventions** for team prompts
- **Tag standards** for consistency
- **Quality guidelines** for shared content
- **Review processes** for new prompts

## 🚨 Common Mistakes to Avoid

### Content Issues
- **Too vague**: "Write something good" vs "Write a professional email"
- **Missing context**: Not providing enough background information
- **Unclear instructions**: Ambiguous or confusing directions
- **No examples**: Not showing the desired output format

### Organization Issues
- **Inconsistent naming**: Using different naming patterns
- **Poor tagging**: Using too many or too few tags
- **No version control**: Not tracking changes over time
- **Duplicate prompts**: Creating similar prompts instead of updating existing ones

### Collaboration Issues
- **Poor documentation**: Not explaining how to use prompts
- **Inconsistent standards**: Not following team conventions
- **No review process**: Sharing prompts without quality checks
- **Over-sharing**: Making everything public when team access would suffice

## 🔧 Advanced Features

### Prompt Templates

#### Creating Templates
1. **Create a prompt** with variables
2. **Add detailed notes** on how to use it
3. **Tag as "template"** for easy finding
4. **Share with team** for consistent use

#### Using Templates
1. **Find template** in your prompt library
2. **Copy the content** to a new prompt
3. **Fill in variables** with specific values
4. **Customize as needed** for your use case

### Bulk Operations

#### Importing Prompts
1. **Go to Account settings**
2. **Use Import feature** to upload JSON file
3. **Review imported prompts** before saving
4. **Organize and tag** imported prompts

#### Exporting Prompts
1. **Go to Account settings**
2. **Use Export feature** to download JSON file
3. **Backup your prompts** regularly
4. **Share exports** with team members

---

**Ready to start creating?** Check out the [Team Collaboration](team-collaboration.md) guide to learn how to share and collaborate on prompts with your team!
