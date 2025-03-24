interface ArticleProps {
    article: {
        id: number
        title: string
        excerpt: string
        date: string
        author: string
    }
}

export function ArticleCard({ article }: { article: any }) {
    return (
        <div
            className="
          border border-white/10
          rounded-none
          p-8
          hover:bg-white/5
          transition-colors
        "
        >
            <p className="text-sm text-white/60 mb-2">
                {new Date(article.date).toDateString()}
            </p>
            <h2 className="text-2xl font-bold mb-4">
                {article.title}
            </h2>
            <p className="text-white/70 leading-relaxed">
                {article.excerpt}
            </p>
            <div className="text-sm text-white/50 mt-5">
                {article.author}
            </div>
        </div>
    )
}
