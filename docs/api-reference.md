# API Reference

Complete API documentation for PromptVault. All endpoints are prefixed with `/api/` and require authentication unless otherwise specified.

## 🔐 Authentication

PromptVault uses JWT-based authentication with HTTP-only cookies. All API requests (except public endpoints) require a valid authentication token.

### Authentication Flow

1. **Login**: `POST /api/auth/login`
2. **Token Storage**: JWT token stored in HTTP-only cookie
3. **API Requests**: Cookie automatically included in requests
4. **Logout**: `POST /api/auth/logout` clears the cookie

## 📋 Base URL

All API endpoints are relative to your PromptVault installation:

- **Local Development**: `http://localhost:3000/api`
- **Docker Default**: `http://localhost:8080/api`
- **Production**: `https://yourdomain.com/api`

## 🔑 Authentication Endpoints

### POST /api/auth/login

Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "team": "team_id",
  "role": "USER"
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid input
- `401` - Invalid credentials

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "team": null,
  "role": "USER"
}
```

**Status Codes:**
- `200` - Registration successful
- `400` - Invalid input
- `409` - Email already in use
- `403` - Registration disabled

### POST /api/auth/logout

Logout the current user and clear the session.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## 📝 Prompt Endpoints

### GET /api/prompts

Get all prompts for the authenticated user.

**Response:**
```json
[
  {
    "id": "prompt_id",
    "title": "Prompt Title",
    "body": "Prompt content...",
    "variables": "Optional variables",
    "notes": "Optional notes",
    "modelHints": "Optional model hints",
    "visibility": "PRIVATE",
    "isPubliclyShared": false,
    "publicShareId": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "tags": [
      {
        "tag": {
          "name": "tag_name"
        }
      }
    ],
    "ratings": [],
    "avgRating": 0,
    "_count": {
      "versions": 5
    }
  }
]
```

### POST /api/prompts

Create a new prompt.

**Request Body:**
```json
{
  "title": "Prompt Title",
  "body": "Prompt content...",
  "variables": "Optional variables",
  "notes": "Optional notes",
  "modelHints": "Optional model hints",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "id": "prompt_id",
  "title": "Prompt Title",
  "body": "Prompt content...",
  "variables": "Optional variables",
  "notes": "Optional notes",
  "modelHints": "Optional model hints",
  "visibility": "PRIVATE",
  "isPubliclyShared": false,
  "publicShareId": null,
  "userId": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/prompts/:id

Get a specific prompt with its version history.

**Response:**
```json
{
  "id": "prompt_id",
  "title": "Prompt Title",
  "body": "Prompt content...",
  "variables": "Optional variables",
  "notes": "Optional notes",
  "modelHints": "Optional model hints",
  "visibility": "PRIVATE",
  "isPubliclyShared": false,
  "publicShareId": null,
  "userId": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "versions": [
    {
      "id": "version_id",
      "promptId": "prompt_id",
      "title": "Prompt Title",
      "body": "Prompt content...",
      "notes": "Optional notes",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "tags": [
    {
      "tag": {
        "name": "tag_name"
      }
    }
  ],
  "ratings": []
}
```

### PUT /api/prompts/:id

Update an existing prompt.

**Request Body:**
```json
{
  "title": "Updated Title",
  "body": "Updated content...",
  "variables": "Updated variables",
  "notes": "Updated notes",
  "modelHints": "Updated model hints",
  "tags": ["tag1", "tag2", "tag3"],
  "visibility": "TEAM"
}
```

**Response:**
```json
{
  "id": "prompt_id",
  "title": "Updated Title",
  "body": "Updated content...",
  "variables": "Updated variables",
  "notes": "Updated notes",
  "modelHints": "Updated model hints",
  "visibility": "TEAM",
  "isPubliclyShared": false,
  "publicShareId": null,
  "userId": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /api/prompts/:id

Delete a prompt and all its associated data.

**Response:**
```json
{
  "ok": true
}
```

### PUT /api/prompts/:id/visibility

Update prompt visibility.

**Request Body:**
```json
{
  "visibility": "TEAM"
}
```

**Response:**
```json
{
  "id": "prompt_id",
  "visibility": "TEAM",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/prompts/feed/team

Get team feed prompts for the authenticated user.

**Response:**
```json
[
  {
    "id": "prompt_id",
    "title": "Team Prompt",
    "body": "Prompt content...",
    "visibility": "TEAM",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "name": "Author Name",
      "email": "author@example.com"
    },
    "tags": [
      {
        "tag": {
          "name": "tag_name"
        }
      }
    ],
    "versions": []
  }
]
```

## 🔍 Search Endpoints

### GET /api/search

Search prompts using full-text search.

**Query Parameters:**
- `q` (string): Search query

**Response:**
```json
[
  {
    "id": "prompt_id",
    "title": "Matching Prompt",
    "body": "Content with search term...",
    "tags": [
      {
        "tag": {
          "name": "tag_name"
        }
      }
    ]
  }
]
```

## 🏷️ Tag Endpoints

### GET /api/tags

Get all tags with usage counts.

**Response:**
```json
[
  {
    "id": "tag_id",
    "name": "tag_name",
    "_count": {
      "prompts": 5
    }
  }
]
```

### GET /api/tags/:id

Get a specific tag with usage count (Admin only).

**Response:**
```json
{
  "id": "tag_id",
  "name": "tag_name",
  "_count": {
    "prompts": 5
  }
}
```

### PUT /api/tags/:id

Update tag name (Admin only).

**Request Body:**
```json
{
  "name": "new_tag_name"
}
```

**Response:**
```json
{
  "id": "tag_id",
  "name": "new_tag_name",
  "_count": {
    "prompts": 5
  }
}
```

### DELETE /api/tags/:id

Delete a tag (Admin only, only if not in use).

**Response:**
```json
{
  "message": "Tag deleted successfully"
}
```

**Status Codes:**
- `200` - Tag deleted successfully
- `400` - Tag still in use
- `404` - Tag not found

## ⭐ Rating Endpoints

### POST /api/ratings/:promptId

Rate a prompt (1-5 stars).

**Request Body:**
```json
{
  "value": 5
}
```

**Response:**
```json
{
  "id": "rating_id",
  "value": 5,
  "promptId": "prompt_id",
  "userId": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 🌐 Sharing Endpoints

### POST /api/share/:id/public

Make a prompt publicly shareable.

**Response:**
```json
{
  "publicUrl": "https://yourdomain.com/share/share_id"
}
```

### GET /api/share/public/:shareId

Get a publicly shared prompt (no authentication required).

**Response:**
```json
{
  "id": "prompt_id",
  "title": "Public Prompt",
  "body": "Prompt content...",
  "notes": "Optional notes",
  "modelHints": "Optional model hints",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /api/share/:id/public

Remove public sharing from a prompt.

**Response:**
```json
{
  "success": true
}
```

## 📤 Import/Export Endpoints

### GET /api/import-export/export

Export all user prompts as JSON.

**Response:**
```json
[
  {
    "id": "prompt_id",
    "title": "Prompt Title",
    "body": "Prompt content...",
    "variables": "Optional variables",
    "notes": "Optional notes",
    "modelHints": "Optional model hints",
    "versions": [...],
    "tags": [...],
    "ratings": [...]
  }
]
```

### POST /api/import-export/import

Import prompts from JSON.

**Request Body:**
```json
[
  {
    "title": "Imported Prompt",
    "body": "Prompt content...",
    "variables": "Optional variables",
    "notes": "Optional notes",
    "modelHints": "Optional model hints",
    "tags": ["tag1", "tag2"]
  }
]
```

**Response:**
```json
{
  "ok": true
}
```

## 👥 Admin Endpoints

### GET /api/admin/users

Get all users (Admin only).

**Response:**
```json
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "team": "team_id",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/admin/users

Create a new user (Admin only).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "USER",
  "team": "team_id"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "team": "team_id",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/admin/users/:id

Update a user (Admin only).

**Request Body:**
```json
{
  "email": "updated@example.com",
  "name": "Updated Name",
  "role": "ADMIN",
  "team": "team_id"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "updated@example.com",
  "name": "Updated Name",
  "team": "team_id",
  "role": "ADMIN",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /api/admin/users/:id

Delete a user (Admin only).

**Response:**
```json
{
  "message": "User deleted"
}
```

### GET /api/admin/teams

Get all teams (Admin only).

**Response:**
```json
[
  {
    "id": "team_id",
    "name": "Team Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/admin/teams

Create a new team (Admin only).

**Request Body:**
```json
{
  "name": "Team Name"
}
```

**Response:**
```json
{
  "id": "team_id",
  "name": "Team Name",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /api/admin/teams/:id

Delete a team (Admin only).

**Response:**
```json
{
  "ok": true
}
```

### GET /api/admin/settings

Get system settings (Admin only).

**Response:**
```json
{
  "id": 1,
  "allowRegistration": true,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/admin/settings

Update system settings (Admin only).

**Request Body:**
```json
{
  "allowRegistration": false
}
```

**Response:**
```json
{
  "id": 1,
  "allowRegistration": false,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🌐 Public Endpoints

### GET /health

Health check endpoint (no authentication required).

**Response:**
```json
{
  "ok": true
}
```

### GET /settings

Get public settings (no authentication required).

**Response:**
```json
{
  "allowRegistration": true
}
```

## 📊 Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

## 🔒 Authentication Headers

For API requests, include the authentication cookie:

```bash
curl -X GET "https://yourdomain.com/api/prompts" \
  -H "Cookie: token=your_jwt_token"
```

## 📝 Rate Limiting

Currently, PromptVault does not implement rate limiting. For production deployments, consider implementing rate limiting at the reverse proxy level.

## 🔄 Pagination

Some endpoints support pagination. Check individual endpoint documentation for pagination parameters.

## 📚 SDK Examples

### JavaScript/TypeScript

```typescript
// API client example
class PromptVaultAPI {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
  
  async getPrompts() {
    const response = await fetch(`${this.baseURL}/api/prompts`, {
      credentials: 'include'
    });
    return response.json();
  }
  
  async createPrompt(prompt: any) {
    const response = await fetch(`${this.baseURL}/api/prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(prompt)
    });
    return response.json();
  }
}
```

### Python

```python
import requests

class PromptVaultAPI:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
    
    def login(self, email, password):
        response = self.session.post(
            f"{self.base_url}/api/auth/login",
            json={"email": email, "password": password}
        )
        return response.json()
    
    def get_prompts(self):
        response = self.session.get(f"{self.base_url}/api/prompts")
        return response.json()
    
    def create_prompt(self, prompt_data):
        response = self.session.post(
            f"{self.base_url}/api/prompts",
            json=prompt_data
        )
        return response.json()
```

---

**Need more help?** Check out the [Development Setup](development-setup.md) guide or [create an issue](https://github.com/ghotso/PromptVault/issues) for API-related questions.
