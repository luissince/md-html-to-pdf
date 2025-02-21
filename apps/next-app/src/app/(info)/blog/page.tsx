export default function Blog() {
    const posts = [
      {
        id: 1,
        title: "Introducing our new MD/HTML to PDF Converter",
        date: "2023-06-01",
        excerpt:
          "We're excited to announce the launch of our new conversion tool. Learn about its features and how it can streamline your workflow.",
      },
      {
        id: 2,
        title: "5 Tips for Creating Beautiful PDFs from Markdown",
        date: "2023-06-15",
        excerpt:
          "Markdown is powerful, but are you using it to its full potential? Check out these tips to create stunning PDFs from your Markdown files.",
      },
      {
        id: 3,
        title: "How to Use CSS with HTML to PDF Conversion",
        date: "2023-07-01",
        excerpt:
          "Did you know you can use CSS to style your PDFs? Learn how to leverage CSS in your HTML to create professionally designed PDFs.",
      },
      {
        id: 4,
        title: "Optimizing PDFs for Thermal Printers",
        date: "2023-07-15",
        excerpt:
          "Thermal printers have unique requirements. Discover how to create perfect PDFs for 80mm and 58mm thermal printers.",
      },
      {
        id: 5,
        title: "The Power of Custom Paper Sizes in PDF Creation",
        date: "2023-08-01",
        excerpt:
          "Don't let standard paper sizes limit you. Learn how to use custom sizes to create PDFs that perfectly fit your needs.",
      },
    ]
  
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Blog</h1>
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground mb-2">Published on {post.date}</p>
              <p className="mb-2">{post.excerpt}</p>
              <a href={`/blog/${post.id}`} className="text-primary hover:underline mt-2 inline-block">
                Read more
              </a>
            </article>
          ))}
        </div>
      </div>
    )
  }
  
  