# Prompt Manager

A powerful AI Prompt management tool built with **Vue 3 + Nuxt 3 + TypeScript + SQLite**, designed for AI creators and content creators.

![Prompt Manager](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js)
![Nuxt](https://img.shields.io/badge/Nuxt-4.0-00DC82?style=flat-square&logo=nuxt.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-3.0-003B57?style=flat-square&logo=sqlite)

<img src=".assets/202508300506413.png" alt="Prompt Manager Interface Preview" style="zoom:50%;" />

## ✨ Core Features

### 🎯 Smart Prompt Management
- **Complete CRUD Operations** - Create, read, edit, delete prompts
- **Multi-Image Support** - Associate multiple images with each prompt, drag-and-drop upload
- **Intelligent Tag System** - Auto-suggest tags, multi-tag filtering
- **Favorites Feature** - Quick bookmark and access important prompts
- **Highlight Display** - Support keyword highlighting in prompt content

### 🔍 Powerful Search & Filtering
- **Full-Text Search** - Real-time search across titles, content, and tags
- **Tag Filtering** - Filter by single or multiple tag combinations
- **Favorites Filtering** - Quick view of favorited prompts
- **Smart Sorting** - Sort by creation time in ascending/descending order
- **Category Management** - Separate display for manual and Civitai-fetched content

### 🌐 Deep Civitai Integration
- **One-Click Fetch** - Get prompts directly from Civitai model links
- **Model Info Parsing** - Auto-extract model names, descriptions, sample images
- **Prompt Recommendations** - Suggest related prompts based on model metadata
- **Auto Tag Generation** - Generate relevant tags from Civitai data
- **Floating Tool Window** - Independent Civitai fetch tool window

### 📁 Data Management & Backup
- **Multi-Format Export** - Support JSON, Markdown, ZIP format exports
- **Batch Import** - Import data from multiple formats in bulk
- **Data Backup** - Complete database backup and restore functionality
- **Image Management** - Auto-handle image storage and path management
- **Data Validation** - Auto-validate data integrity during import

### 🎨 Modern User Experience
- **Responsive Design** - Perfect adaptation for desktop and mobile devices
- **Dark Theme** - Support light/dark theme switching
- **Drag Operations** - Support image drag-and-drop upload and window dragging
- **Real-time Preview** - Live preview of images and content
- **Quick Actions** - Rich keyboard shortcut support

## 🛠️ Technical Architecture

### Frontend Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue 3 | 3.5+ | Reactive frontend framework |
| Nuxt 3 | 4.0+ | Full-stack framework, SSR/SSG |
| TypeScript | 5.9+ | Type-safe JavaScript |
| Naive UI | 2.42+ | Modern UI component library |
| Tailwind CSS | 3.0+ | Utility-first CSS framework |
| Vite | 7.1+ | Fast build tool |

### Backend Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Nitro | Built-in | Server-side runtime |
| Prisma | 6.15+ | Modern ORM |
| SQLite | 3.0+ | Lightweight database |
| Sharp | 0.33+ | High-performance image processing |
| Formidable | 3.5+ | File upload handling |

### Core Feature Modules
```
├── 🎯 Prompt Management
│   ├── CRUD Operations
│   ├── Multi-Image Support
│   ├── Tag System
│   └── Favorites Feature
├── 🔍 Search & Filtering
│   ├── Full-Text Search
│   ├── Tag Filtering
│   └── Smart Sorting
├── 🌐 Civitai Integration
│   ├── Model Info Fetching
│   ├── Prompt Extraction
│   └── Auto Tag Generation
├── 📁 Data Management
│   ├── Import/Export
│   ├── Data Backup
│   └── Format Conversion
└── 🎨 User Interface
    ├── Responsive Design
    ├── Theme Switching
    └── Interaction Optimization
```

## 🚀 Quick Start

### Requirements
- **Node.js** 18.0 or higher
- **npm** or **pnpm** package manager
- **Modern Browser** with ES2020+ support

### Installation Steps

1. **Clone the Project**
   ```bash
   git clone <repository-url>
   cd prompt-manager
   ```

2. **Install Dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using pnpm (recommended)
   pnpm install
   ```

3. **Initialize Database**
   ```bash
   # Generate Prisma client and create database
   npm run dev
   ```
   First run will automatically create SQLite database file and execute migrations.

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Application will start at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build production version |
| `npm run preview` | Preview production version |
| `npm run fix-db` | Fix database issues |
| `npm run init-db` | Reinitialize database |
| `npm run clear-cache` | Clear all caches |
| `npm run dev-safe` | Safe mode start (fix database then start) |
| `npm run dev-clean` | Clean mode start (clear cache and reinitialize) |

## 📖 User Guide

### Basic Operations

#### Creating Prompts
1. Click **"New Prompt"** button on the main interface
2. Fill in title and content
3. Optionally upload related images (supports drag-drop, paste, file selection)
4. Add tags (system will auto-suggest)
5. Click **"Create"** to finish

#### Search & Filtering
- **Search**: Enter keywords in search box, supports title, content, tag search
- **Tag Filtering**: Click tag filter button, select one or multiple tags
- **Favorites Filtering**: Click favorites button to show only favorited prompts
- **Sorting**: Click sort button to toggle time sorting order

#### Using Civitai Integration
1. Click **"Civitai LORA"** button in toolbar
2. Paste Civitai model link in popup window
   ```
   Example: https://civitai.com/models/12345
   ```
3. Click **"Get Info"** to auto-parse model data
4. Select desired prompts and save

### Data Management

#### Exporting Data
1. Click **"Export"** button in toolbar
2. Choose export format:
   - **JSON**: Complete data, supports re-import
   - **Markdown**: Document format, easy to read
   - **ZIP**: Complete backup including images
3. Click **"Confirm Export"** to download file

#### Importing Data
1. Click **"Import"** button in toolbar
2. Select file (supports .json, .md, .markdown, .zip)
3. System auto-parses and imports data
4. View import statistics report

## 🗂️ Project Structure

```
prompt-manager/
├── 📁 app/                    # Nuxt application entry
│   ├── app.vue               # Root component
│   └── lib/
│       └── prisma.ts         # Prisma client configuration
├── 📁 assets/                # Static resources
│   └── css/
│       └── main.css          # Global styles
├── 📁 components/            # Vue components
│   ├── CivitaiLora.vue      # Civitai integration tool
│   ├── PromptCard.vue       # Prompt card component
│   ├── SmartImageUpload.vue # Smart image upload
│   ├── SmartTagInput.vue    # Smart tag input
│   └── TagFilter.vue        # Tag filter
├── 📁 composables/           # Composable functions
│   ├── useCache.ts          # Cache management
│   └── useClipboardImage.ts # Clipboard image handling
├── 📁 layouts/               # Layout components
│   └── default.vue          # Default layout
├── 📁 pages/                 # Page components
│   ├── index.vue            # Home page
│   ├── create.vue           # Create page
│   ├── admin.vue            # Admin page
│   └── edit/[id].vue        # Edit page
├── 📁 prisma/                # Database related
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Database migrations
│   └── dev.db              # SQLite database file
├── 📁 server/api/            # API routes
│   ├── prompts/             # Prompt related APIs
│   ├── database/            # Database management APIs
│   ├── civitai/             # Civitai integration APIs
│   ├── upload/              # File upload APIs
│   ├── import.post.ts       # Data import
│   └── export.get.ts        # Data export
├── 📁 types/                 # TypeScript type definitions
│   ├── civitai.ts           # Civitai related types
│   └── import-export.ts     # Import/export types
├── 📁 utils/                 # Utility functions
│   ├── civitai.ts           # Civitai utility functions
│   └── tags.ts              # Tag processing utilities
└── 📁 scripts/               # Script files
    ├── init-database.js     # Database initialization
    ├── fix-database.js      # Database repair
    └── clear-all-cache.js   # Cache cleanup
```

## 🔧 Configuration

### Environment Variables
Create `.env` file to configure environment variables:
```env
# Database configuration
DATABASE_URL="file:./prisma/dev.db"

# Application configuration
NUXT_PUBLIC_API_BASE="/api"
```

### Database Configuration
Database schema defined in `prisma/schema.prisma`:
```prisma
model Prompt {
  id          Int      @id @default(autoincrement())
  title       String   // Prompt title
  content     String   // Prompt content
  imagePath   String?  // Single image path (backward compatibility)
  images      String?  // Multiple image paths (JSON format)
  tags        String?  // Tags (JSON format)
  highlights  String?  // Highlight info (JSON format)
  isFavorited Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🚀 Deployment Guide

### Production Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   node .output/server/index.mjs
   ```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### Platform Deployment
- **Vercel**: Zero-config deployment support
- **Netlify**: Static generation deployment support
- **Railway**: Full-stack application deployment support
- **Self-hosted**: Node.js server deployment support

## 🤝 Contributing

We welcome all forms of contributions!

### Development Workflow
1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

### Code Standards
- Use TypeScript for type-safe development
- Follow Vue 3 Composition API best practices
- Use ESLint and Prettier to maintain consistent code style
- Write clear commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Nuxt.js](https://nuxt.com/) - Intuitive Vue framework
- [Naive UI](https://www.naiveui.com/) - Vue 3 component library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Civitai](https://civitai.com/) - AI model sharing platform

---

**If this project helps you, please give it a ⭐️!**