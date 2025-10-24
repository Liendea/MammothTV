# Sanity CMS Integration Guide

This guide provides step-by-step instructions for integrating Sanity CMS with the MammothTV Next.js application.

## Overview

This setup allows you to run both the Next.js frontend and Sanity Studio with a single `npm run dev` command, eliminating the need to manage two separate localhost servers.

---

## Prerequisites

- Node.js installed
- npm or yarn package manager
- A Sanity account (free to create at [sanity.io](https://sanity.io))

---

## Step 1: Install Sanity Dependencies

Navigate to the project root and install the required packages:

```bash
cd /Users/bonnysentrosi/Documents/GitHub/MammothTV
npm install @sanity/client @sanity/image-url next-sanity
npm install -D @sanity/vision sanity
```

**What these packages do:**
- `@sanity/client` - Core client for querying Sanity data
- `@sanity/image-url` - Helper for generating image URLs
- `next-sanity` - Next.js-specific Sanity utilities
- `sanity` - Sanity Studio
- `@sanity/vision` - Query testing tool for Sanity Studio

---

## Step 2: Create Sanity Studio Folder

Create a dedicated folder for your Sanity Studio configuration:

```bash
mkdir -p sanity
```

---

## Step 3: Initialize Sanity Project

Run the Sanity CLI to create a new project:

```bash
npx sanity@latest init
```

**During initialization, you'll be prompted for:**

1. **Login**: Sign in with Google, GitHub, or email
2. **Create new project**: Select "Create new project"
3. **Project name**: Enter a name (e.g., "MammothTV CMS")
4. **Use default dataset**: Choose "Yes" (creates a "production" dataset)
5. **Project output path**: Enter `./sanity`
6. **Schema template**: Choose "Clean project with no predefined schemas"

**⚠️ Important**: Save the **Project ID** that's generated during this process - you'll need it for configuration.

---

## Step 4: Get Your API Token

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your newly created project
3. Navigate to **API** → **Tokens**
4. Click **Add API Token**
5. Name it (e.g., "Development Token")
6. Set permissions:
   - **Editor** - for read/write access
   - **Viewer** - for read-only access
7. **Copy the token immediately** (it won't be shown again)

---

## Step 5: Create Environment Variables

Create a `.env.local` file in your project root:

```bash
touch .env.local
```

Add the following content (replace with your actual values):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token_here
```

**⚠️ Security Note**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

---

## Step 6: Create Sanity Configuration Files

Create a Sanity client configuration in your Next.js app:

```bash
mkdir -p src/sanity
touch src/sanity/config.ts
touch src/sanity/client.ts
```

### File: `src/sanity/config.ts`

```typescript
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
```

### File: `src/sanity/client.ts`

```typescript
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './config'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
```

---

## Step 7: Configure Sanity Studio

Update your `sanity/sanity.config.ts` file to include proper configuration:

```typescript
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'MammothTV',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
```

---

## Step 8: Create a Sample Schema

Create a basic schema to test your setup:

```bash
mkdir -p sanity/schemas
touch sanity/schemas/index.ts
touch sanity/schemas/post.ts
```

### File: `sanity/schemas/post.ts`

```typescript
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
    },
  ],
}
```

### File: `sanity/schemas/index.ts`

```typescript
import post from './post'

export const schemaTypes = [post]
```

---

## Step 9: Update Package.json Scripts

Install the package to run multiple commands in parallel:

```bash
npm install -D npm-run-all
```

Modify your `package.json` scripts section to:

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:next dev:sanity",
    "dev:next": "next dev --turbopack",
    "dev:sanity": "cd sanity && sanity dev",
    "build": "next build --turbopack && cd sanity && sanity build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

---

## Step 10: Update .gitignore

Ensure your `.gitignore` includes Sanity-specific entries:

```
# Environment variables
.env.local

# Sanity
sanity/dist
```

---

## Step 11: Start Development

Now you can run both servers with a single command:

```bash
npm run dev
```

This will start:
- **Next.js frontend**: http://localhost:3000
- **Sanity Studio**: http://localhost:3333

---

## Final Folder Structure

```
MammothTV/
├── sanity/                    # Sanity Studio
│   ├── schemas/
│   │   ├── index.ts
│   │   └── post.ts
│   └── sanity.config.ts
├── src/
│   ├── sanity/               # Sanity client for Next.js
│   │   ├── config.ts
│   │   └── client.ts
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── .env.local                # Environment variables (not in git)
├── package.json
└── sanityreadme.md          # This file
```

---

## Key Information Checklist

Before starting development, ensure you have:

- ✅ **Project ID**: From `sanity init` or [sanity.io/manage](https://sanity.io/manage)
- ✅ **API Token**: From sanity.io/manage → API → Tokens
- ✅ **Dataset**: "production" (default)
- ✅ **Environment variables**: Configured in `.env.local`

---

## Usage Example

### Querying Data in Next.js

```typescript
import { client } from '@/sanity/client'

// Fetch all posts
const posts = await client.fetch(`*[_type == "post"]`)

// Fetch a single post by slug
const post = await client.fetch(
  `*[_type == "post" && slug.current == $slug][0]`,
  { slug: 'your-post-slug' }
)
```

### Using in Server Components (Next.js 15)

```typescript
import { client } from '@/sanity/client'

export default async function PostsPage() {
  const posts = await client.fetch(`*[_type == "post"]`)
  
  return (
    <div>
      {posts.map((post: any) => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}
```

---

## Troubleshooting

### Issue: "Project ID not found"
- Ensure `.env.local` exists and contains the correct `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Restart your development server after adding environment variables

### Issue: "Cannot connect to Sanity"
- Verify your API token has the correct permissions
- Check that your project ID and dataset name are correct
- Ensure you're using the correct API version

### Issue: "Sanity Studio won't start"
- Make sure you're in the correct directory
- Try running `cd sanity && sanity dev` separately to see detailed errors
- Check that all Sanity dependencies are installed

---

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/sanity-nextjs-guide)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Schema Types](https://www.sanity.io/docs/schema-types)

---

## Support

For issues specific to this integration, contact the development team. For Sanity-specific issues, refer to the [Sanity Community](https://www.sanity.io/community).
