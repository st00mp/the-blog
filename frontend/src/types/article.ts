export type Article = {
    id: number
    title: string
    excerpt: string
    content: string
    slug: string
    updated_at: string
    created_at: string
    author: {
        name: string
        id: number
    }
}
