import Database from '@tauri-apps/plugin-sql'

interface Prompt {
  id: number
  title: string
  content: string
  imagePath?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

interface TagStat {
  tag: string
  count: number
}

class TauriDatabase {
  private db: Database | null = null

  async init() {
    if (this.db) return this.db
    
    try {
      this.db = await Database.load('sqlite:prompt_manager.db')
      await this.createTables()
      return this.db
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_path TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  async getAllPrompts(): Promise<Prompt[]> {
    const db = await this.init()
    const result = await db.select<Prompt[]>(
      'SELECT id, title, content, image_path as imagePath, tags, created_at as createdAt, updated_at as updatedAt FROM prompts ORDER BY created_at DESC'
    )
    return result
  }

  async getPromptById(id: number): Promise<Prompt | null> {
    const db = await this.init()
    const result = await db.select<Prompt[]>(
      'SELECT id, title, content, image_path as imagePath, tags, created_at as createdAt, updated_at as updatedAt FROM prompts WHERE id = ?',
      [id]
    )
    return result[0] || null
  }

  async createPrompt(data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt> {
    const db = await this.init()
    const result = await db.execute(
      'INSERT INTO prompts (title, content, image_path, tags) VALUES (?, ?, ?, ?)',
      [data.title, data.content, data.imagePath || null, data.tags || null]
    )
    
    const newPrompt = await this.getPromptById(result.lastInsertId as number)
    if (!newPrompt) throw new Error('Failed to create prompt')
    return newPrompt
  }

  async updatePrompt(id: number, data: Partial<Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Prompt> {
    const db = await this.init()
    
    const updates: string[] = []
    const values: any[] = []
    
    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.content !== undefined) {
      updates.push('content = ?')
      values.push(data.content)
    }
    if (data.imagePath !== undefined) {
      updates.push('image_path = ?')
      values.push(data.imagePath)
    }
    if (data.tags !== undefined) {
      updates.push('tags = ?')
      values.push(data.tags)
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    await db.execute(
      `UPDATE prompts SET ${updates.join(', ')} WHERE id = ?`,
      values
    )
    
    const updatedPrompt = await this.getPromptById(id)
    if (!updatedPrompt) throw new Error('Failed to update prompt')
    return updatedPrompt
  }

  async deletePrompt(id: number): Promise<void> {
    const db = await this.init()
    await db.execute('DELETE FROM prompts WHERE id = ?', [id])
  }

  async getTagStats(): Promise<TagStat[]> {
    const db = await this.init()
    const prompts = await db.select<{ tags: string }[]>(
      'SELECT tags FROM prompts WHERE tags IS NOT NULL AND tags != ""'
    )
    
    const tagCounts = new Map<string, number>()
    
    prompts.forEach(prompt => {
      if (prompt.tags) {
        try {
          const tags = JSON.parse(prompt.tags) as string[]
          tags.forEach(tag => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          })
        } catch (error) {
          console.warn('Failed to parse tags:', prompt.tags)
        }
      }
    })
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  }
}

export const tauriDatabase = new TauriDatabase()

export const useTauriDatabase = () => {
  return {
    database: tauriDatabase
  }
}