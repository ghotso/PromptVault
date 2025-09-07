# Search & Organization

Learn how to effectively search, filter, and organize your prompts in PromptVault. This guide covers the search functionality, tagging system, and best practices for keeping your prompt library organized.

## 🔍 Search Functionality

### Full-Text Search

PromptVault uses SQLite's FTS5 (Full-Text Search) engine to provide powerful search capabilities across your prompts.

#### What Gets Searched
- **Prompt Titles**: Search by prompt names
- **Prompt Content**: Search within prompt text
- **Notes**: Search in additional notes
- **Model Hints**: Search in AI model recommendations
- **Tags**: Search by tag names

#### Search Features
- **Real-time Results**: Search as you type
- **Highlighted Matches**: Search terms are highlighted in results
- **Fuzzy Matching**: Finds similar terms and variations
- **Case Insensitive**: Search works regardless of case
- **Partial Matching**: Finds prompts with partial matches

### Using the Search Bar

#### Basic Search
1. **Click the search bar** in the top navigation
2. **Type your search query**
3. **View results** as they appear
4. **Click on a result** to open the prompt

#### Search Tips
- **Use quotes** for exact phrases: `"email template"`
- **Use wildcards** for partial matches: `email*`
- **Combine terms** with spaces: `email template customer`
- **Exclude terms** with minus: `email -template`

#### Advanced Search Operators
```
"exact phrase"     # Exact phrase matching
word1 word2        # Both words must be present
word1 OR word2     # Either word can be present
word1 -word2       # Include word1, exclude word2
word*              # Wildcard matching
```

### Search Results

#### Result Display
- **Prompt Cards**: Each result shown as a card
- **Relevance Ranking**: Most relevant results first
- **Context Preview**: Snippet of matching content
- **Tag Highlighting**: Matching tags are highlighted
- **Quick Actions**: Copy, view, or edit directly from results

#### Result Information
- **Title**: Prompt title with highlighted matches
- **Content Snippet**: Preview of matching content
- **Tags**: Relevant tags with highlighting
- **Last Updated**: When the prompt was last modified
- **Version Count**: Number of versions available

## 🏷️ Tagging System

### Understanding Tags

Tags are labels that help you categorize and organize your prompts. They provide a flexible way to group related prompts and make them easier to find.

#### Tag Features
- **Autocomplete**: Smart suggestions as you type
- **Usage Tracking**: See how many prompts use each tag
- **Color Coding**: Visual distinction between tags
- **Hierarchical**: Support for tag hierarchies
- **Global Management**: Admins can manage all tags

### Creating and Using Tags

#### Adding Tags to Prompts

##### Method 1: During Creation
1. **Create a new prompt**
2. **Scroll to the Tags section**
3. **Start typing** a tag name
4. **Select from suggestions** or press Enter to create new
5. **Add multiple tags** as needed

##### Method 2: Editing Existing Prompts
1. **Open prompt details**
2. **Click "Edit"**
3. **Modify tags** in the Tags section
4. **Save changes**

#### Tag Input Features
- **Autocomplete**: Shows existing tags as you type
- **Create New**: Press Enter to create new tags
- **Remove Tags**: Click the X on any tag
- **Tag Validation**: Prevents duplicate tags

### Tag Organization

#### Tag Hierarchies
Use forward slashes to create tag hierarchies:

```
writing/
├── emails/
│   ├── customer-service
│   ├── sales
│   └── support
├── blog-posts/
│   ├── technical
│   ├── marketing
│   └── personal
└── social-media/
    ├── twitter
    ├── linkedin
    └── facebook
```

#### Tag Naming Conventions

##### By Function
- `writing` - All writing-related prompts
- `coding` - Programming and development
- `analysis` - Data analysis and research
- `creative` - Creative writing and content

##### By Domain
- `marketing` - Marketing and advertising
- `development` - Software development
- `sales` - Sales and customer relations
- `support` - Customer support

##### By Status
- `draft` - Work in progress
- `review` - Needs review
- `approved` - Ready for use
- `deprecated` - No longer recommended

##### By Priority
- `urgent` - High priority
- `normal` - Standard priority
- `low` - Low priority

##### By AI Model
- `gpt-4` - Optimized for GPT-4
- `claude` - Optimized for Claude
- `gemini` - Optimized for Gemini
- `universal` - Works with any model

### Tag Management

#### Viewing Tag Usage
- **In Tag Dropdown**: See usage count for each tag
- **In Admin Panel**: Detailed tag statistics
- **In Prompt Details**: All tags associated with a prompt

#### Tag Best Practices
- **Be Consistent**: Use the same naming convention
- **Keep It Simple**: Use clear, descriptive names
- **Avoid Duplicates**: Check for similar tags before creating
- **Regular Cleanup**: Remove unused tags periodically
- **Document Conventions**: Share tag standards with your team

## 📊 Filtering and Sorting

### Filter Options

#### By Tags
- **Single Tag**: Filter by one specific tag
- **Multiple Tags**: Filter by multiple tags (AND logic)
- **Tag Hierarchy**: Filter by parent tags to include children

#### By Visibility
- **Private**: Only your personal prompts
- **Team**: Prompts shared with your team
- **Public**: Publicly shared prompts

#### By Date
- **Created Date**: When the prompt was first created
- **Updated Date**: When the prompt was last modified
- **Date Ranges**: Custom date ranges

#### By Rating
- **High Rated**: Prompts with high ratings
- **Unrated**: Prompts without ratings
- **Rating Ranges**: Specific rating ranges

### Sorting Options

#### Sort by Date
- **Recently Updated**: Most recently modified first
- **Recently Created**: Most recently created first
- **Oldest First**: Oldest prompts first

#### Sort by Name
- **Alphabetical A-Z**: Sort by title alphabetically
- **Alphabetical Z-A**: Reverse alphabetical order

#### Sort by Usage
- **Most Used**: Most frequently accessed prompts
- **Least Used**: Least frequently accessed prompts

#### Sort by Rating
- **Highest Rated**: Best-rated prompts first
- **Lowest Rated**: Lowest-rated prompts first

### Advanced Filtering

#### Combining Filters
- **Multiple Criteria**: Combine different filter types
- **Save Filters**: Save frequently used filter combinations
- **Quick Filters**: Predefined filter sets

#### Search + Filter
- **Search First**: Use search to narrow down results
- **Then Filter**: Apply additional filters to search results
- **Refine Results**: Continuously refine your results

## 📁 Organization Strategies

### Folder-like Organization

#### Using Tag Hierarchies
Create folder-like structures using tag hierarchies:

```
my-prompts/
├── work/
│   ├── marketing/
│   │   ├── email-campaigns
│   │   ├── social-media
│   │   └── content-creation
│   ├── development/
│   │   ├── code-review
│   │   ├── debugging
│   │   └── documentation
│   └── management/
│       ├── team-meetings
│       ├── project-planning
│       └── performance-reviews
└── personal/
    ├── learning/
    ├── creative-writing
    └── hobbies
```

#### Naming Conventions
- **Prefix by Category**: `[Work] Email Templates`
- **Include Version**: `Code Review v2.1`
- **Add Status**: `[DRAFT] Marketing Copy`
- **Use Dates**: `2024-Q1 Planning`

### Project-based Organization

#### Project Tags
Create tags for specific projects:

```
project-alpha/
project-beta/
project-gamma/
```

#### Project Phases
Organize by project phases:

```
planning/
development/
testing/
deployment/
maintenance/
```

### Team Organization

#### Team-specific Tags
Use team tags for collaboration:

```
team-marketing/
team-development/
team-sales/
team-support/
```

#### Role-based Tags
Organize by user roles:

```
admin-only/
manager-level/
team-lead/
junior-level/
```

## 🔄 Maintenance and Cleanup

### Regular Maintenance

#### Weekly Tasks
- **Review New Prompts**: Check recently created prompts
- **Update Tags**: Ensure proper tagging
- **Rate Prompts**: Provide feedback on prompt quality
- **Clean Up**: Remove or archive unused prompts

#### Monthly Tasks
- **Tag Audit**: Review and consolidate similar tags
- **Archive Old Prompts**: Move outdated prompts to archive
- **Update Documentation**: Keep prompt notes current
- **Team Review**: Review team-shared prompts

#### Quarterly Tasks
- **Full Cleanup**: Comprehensive organization review
- **Tag Standardization**: Ensure consistent tagging
- **Performance Review**: Identify most/least used prompts
- **Process Improvement**: Refine organization strategies

### Tag Cleanup

#### Identifying Unused Tags
- **Check Usage Counts**: Look for tags with zero usage
- **Review Tag Lists**: Identify similar or duplicate tags
- **Team Feedback**: Ask team members about tag usage

#### Consolidating Tags
- **Merge Similar Tags**: Combine tags with similar meanings
- **Rename Tags**: Standardize tag naming conventions
- **Delete Unused Tags**: Remove tags that are no longer needed

#### Tag Migration
- **Update Prompts**: Change tags on existing prompts
- **Update Documentation**: Update any tag references
- **Communicate Changes**: Inform team members of changes

### Prompt Cleanup

#### Archiving Prompts
- **Identify Candidates**: Find prompts that are no longer used
- **Archive Process**: Move to archive instead of deleting
- **Update References**: Update any references to archived prompts

#### Deleting Prompts
- **Confirm Deletion**: Ensure prompts are truly no longer needed
- **Check Dependencies**: Look for references in other prompts
- **Backup First**: Create backup before deletion
- **Document Changes**: Keep record of deleted prompts

## 📈 Analytics and Insights

### Usage Analytics

#### Most Used Prompts
- **Access Frequency**: How often prompts are viewed
- **Copy Frequency**: How often prompts are copied
- **Edit Frequency**: How often prompts are modified

#### Tag Analytics
- **Most Popular Tags**: Most commonly used tags
- **Tag Growth**: How tag usage changes over time
- **Tag Effectiveness**: Which tags help with organization

#### Team Analytics
- **Team Activity**: How active team members are
- **Collaboration Metrics**: How much teams share prompts
- **Quality Metrics**: Average ratings of team prompts

### Performance Insights

#### Search Performance
- **Search Success Rate**: How often searches find relevant results
- **Search Patterns**: What users search for most
- **Search Refinement**: How users refine their searches

#### Organization Effectiveness
- **Tag Coverage**: How well prompts are tagged
- **Organization Consistency**: How consistent tagging is
- **User Satisfaction**: How satisfied users are with organization

## 🚀 Best Practices

### Search Best Practices

#### Effective Search Queries
- **Use Specific Terms**: Be specific in your search terms
- **Combine Keywords**: Use multiple relevant keywords
- **Use Quotes**: Use quotes for exact phrase matching
- **Try Different Terms**: Use synonyms and variations

#### Search Optimization
- **Regular Searches**: Search regularly to find new content
- **Save Searches**: Bookmark frequently used searches
- **Share Searches**: Share effective search strategies with team

### Organization Best Practices

#### Consistent Tagging
- **Follow Conventions**: Stick to established tagging conventions
- **Regular Review**: Regularly review and update tags
- **Team Standards**: Ensure team follows same standards
- **Documentation**: Document tagging conventions

#### Prompt Maintenance
- **Regular Updates**: Keep prompts current and relevant
- **Version Control**: Use version history effectively
- **Quality Control**: Regularly review prompt quality
- **User Feedback**: Incorporate user feedback and ratings

#### Team Collaboration
- **Shared Standards**: Establish shared organization standards
- **Regular Reviews**: Regular team reviews of organization
- **Knowledge Sharing**: Share organization strategies
- **Continuous Improvement**: Continuously improve organization

---

**Ready to organize your prompts?** Check out the [Account Management](account-management.md) guide to learn about managing your personal account and preferences!
