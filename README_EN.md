# Prompt Manager - User Guide

An intelligent Prompt management tool built with Vue 3 + Nuxt 3 + SQLite, designed for AI creators and content creators.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Main Functions](#main-functions)
- [Interface Overview](#interface-overview)
- [User Tutorial](#user-tutorial)
- [Import & Export](#import--export)
- [Civitai Integration](#civitai-integration)
- [Tech Stack](#tech-stack)
- [FAQ](#faq)

## ✨ Features

- 🎯 **Smart Category Management** - Support for manual creation and Civitai-sourced prompt categorization
- 🔍 **Powerful Search** - Full-text search across titles, content, and tags
- 🏷️ **Intelligent Tag System** - Auto-suggest tags, tag filtering and statistics
- ⭐ **Favorites** - Quick bookmark important prompts
- 🖼️ **Image Support** - Upload and manage prompt-related images
- 📤 **Import/Export** - Support JSON, Markdown, ZIP formats for data management
- 🌐 **Civitai Integration** - Direct integration with Civitai for model information and prompts
- 📱 **Responsive Design** - Perfect adaptation for desktop and mobile devices
- 🎨 **Modern UI** - Beautiful interface design based on Naive UI

## 🚀 Quick Start

### Requirements

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   ```bash
   npm run dev
   ```
   First run will automatically create SQLite database and execute migrations.

3. **Start Application**
   ```bash
   npm run dev
   ```
   Application will start at `http://localhost:3000`.

## 🎯 Main Functions

### 1. Prompt Management
- **Create Prompt**: Complete information entry including title, content, images, and tags
- **Edit Prompt**: Modify existing prompt information anytime
- **Delete Prompt**: Safely remove unwanted prompts
- **Favorites**: Mark important prompts for quick access

### 2. Category Management
- **Manual Creation**: User-created prompts
- **Civitai Sourced**: Prompts obtained from Civitai platform

### 3. Search & Filter
- **Full-text Search**: Search keywords in titles, content, and tags
- **Tag Filter**: Filter prompts by tags
- **Favorites Filter**: Show only favorited prompts
- **Sorting**: Sort by creation time in ascending or descending order

## 🖥️ Interface Overview

### Main Interface

The main interface consists of several areas:

1. **Top Navigation**
   - Application title and statistics
   - Tab switching (Manual Creation / Civitai Sourced)

2. **Toolbar**
   - Sort button: Toggle time sorting order
   - Favorites filter: Show/hide favorited prompts
   - Tag filter: Filter content by tags
   - Civitai LORA: Open Civitai integration tool
   - Import/Export: Data management functions

3. **Search Bar**
   - Real-time search input
   - New Prompt button

4. **Content Area**
   - Prompt cards in grid layout
   - Each card displays title, content preview, tags, timestamps, etc.

### Prompt Card

Each prompt card contains:
- **Favorite Button**: Star-shaped button in top-right corner for favoriting/unfavoriting
- **Image**: Associated image displayed at the top (if available)
- **Title**: Prompt title
- **Content Preview**: Preview of the first few lines of content
- **Tags**: List of related tags
- **Timestamp**: Creation and update times
- **Action Buttons**: View, edit, and delete functions

## 📖 User Tutorial

### Creating a New Prompt

1. Click the **"New Prompt"** button in the top-right corner of the main interface
2. Fill in the following information:
   - **Title**: Give the prompt a descriptive name
   - **Content**: Enter the complete prompt text
   - **Image**: Optional, upload related images (supports drag & drop, paste, file selection)
   - **Tags**: Add category tags, system will suggest commonly used tags
3. Click **"Create Prompt"** to complete creation

### Editing a Prompt

1. Click the **"Edit"** button on a prompt card
2. Modify the information that needs updating
3. Click **"Save Changes"** to complete editing

### Searching Prompts

1. Enter keywords in the search bar
2. System will search in real-time for prompts containing keywords in titles, content, or tags
3. Search results will be displayed immediately below

### Using Tag Filters

1. Click the **"Tag Filter"** button in the toolbar
2. Select tags to filter by in the popup tag panel
3. Multiple tags can be selected for combined filtering
4. Click outside the tag panel to close the filter panel

### Managing Favorites

1. **Favorite a Prompt**: Click the star-shaped button in the top-right corner of a prompt card
2. **View Favorites**: Click the **"Filter Favorites"** button in the toolbar to show only favorited content
3. **Unfavorite**: Click the star button again to remove from favorites

## 📁 Import & Export

### Export Function

1. Click the **"Export"** button in the toolbar
2. Select export format:
   - **JSON Format**: Structured data, convenient for program processing and re-importing
   - **Markdown Format**: Document format, convenient for reading and sharing (text only)
   - **Markdown ZIP Format**: Compressed package containing Markdown documents and related images
3. Click **"Confirm Export"** to download the file

### Import Function

1. Click the **"Import"** button in the toolbar
2. Select the file to import (supports .json, .md, .markdown, .zip formats)
3. System will automatically parse the file and import data
4. Import statistics will be displayed after completion

#### Supported Import Formats

- **JSON Files**: Standard JSON format data
- **Markdown Files**: Markdown documents written in specific format
- **ZIP Archives**: Compressed packages containing Markdown files and images

## 🌐 Civitai Integration

### Using Civitai LORA Tool

1. Click the **"Civitai LORA"** button in the toolbar to open the floating window
2. Paste a Civitai model page link in the input box
   - Example: `https://civitai.com/models/12345`
3. Click the **"Get Information"** button
4. System will automatically retrieve model information including:
   - Model name and description
   - Example images
   - Recommended prompts
   - Related tags
5. Select prompts to save and click save

### Civitai Data Characteristics

- Prompts obtained from Civitai automatically get the "civitai" tag
- Displayed separately in the "Civitai Sourced" tab on the main interface
- Contains model-related metadata information

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 + Nuxt 3
- **UI Component Library**: Naive UI
- **CSS Framework**: Tailwind CSS
- **Database**: SQLite + Prisma ORM
- **Image Processing**: Sharp + Nuxt Image
- **File Processing**: Formidable + JSZip
- **Search Functionality**: Fuse.js

## ❓ FAQ

### Q: How do I backup my data?
A: Use the export function and select JSON format to completely backup all data, including image path information.

### Q: What happens when importing duplicate data?
A: The system automatically detects duplicate prompts (based on title and content), duplicate items will be skipped without creating copies.

### Q: What to do when image upload fails?
A: Please check:
- Image format is supported (JPG, PNG, GIF, WebP)
- Image size doesn't exceed limits
- Network connection is stable

### Q: Civitai link cannot retrieve information?
A: Please confirm:
- Link format is correct (https://civitai.com/models/numeric-ID)
- Network connection is stable
- Model page is publicly accessible

### Q: How to clean up unused tags?
A: After deleting all prompts using a tag, the tag will automatically disappear from the suggestion list.

### Q: Where is data stored?
A: Data is stored in the SQLite database file in the project directory, images are stored in the `public/uploads` directory.

### Q: How to reset the application?
A: Delete the database file and uploads directory, then run `npm run dev` again to reset.

## 🔧 Advanced Features

### Batch Operations
- Use export function for batch backup of all prompts
- Use import function for batch addition of prompts

### Data Migration
- Support importing data from other prompt management tools (requires conversion to supported format)
- Support cross-device data synchronization (via export/import)

### Custom Tags
- Tag system supports Chinese, English, and special characters
- System recommends tags based on usage frequency
- Support multi-tag combination filtering

---

**Tip**: If you encounter issues during use, please check browser console error messages or try refreshing the page.