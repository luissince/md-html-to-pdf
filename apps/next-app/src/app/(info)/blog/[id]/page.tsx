import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Simulamos una base de datos de posts
const posts = [
    {
        id: 1,
        title: "Introducing our new MD/HTML to PDF Converter",
        date: "2023-06-01",
        content:
            "We're excited to announce the launch of our new conversion tool. This tool allows you to easily convert Markdown and HTML files to PDF format, with a variety of customization options. Whether you're creating documentation, reports, or any other type of document, our converter makes it simple to generate professional-looking PDFs. In this post, we'll walk you through the key features and how to get started.",
    },
    {
        id: 2,
        title: "5 Tips for Creating Beautiful PDFs from Markdown",
        date: "2023-06-15",
        content:
            "Markdown is a powerful tool for creating structured documents, but are you using it to its full potential when converting to PDF? In this post, we'll share five tips to help you create stunning PDFs from your Markdown files. We'll cover topics like using custom CSS, leveraging Markdown extensions, optimizing images, creating table of contents, and more. By the end of this post, you'll be able to take your PDF outputs to the next level.",
    },
    {
        id: 3,
        title: "How to Use CSS with HTML to PDF Conversion",
        date: "2023-07-01",
        content:
            "When converting HTML to PDF, CSS can be your best friend in creating beautifully styled documents. In this comprehensive guide, we'll explore how to effectively use CSS in your HTML to create professionally designed PDFs. We'll cover topics such as page layouts, custom fonts, print-specific styles, and how to handle page breaks. Whether you're a beginner or an experienced developer, you'll find valuable insights to enhance your PDF conversions.",
    },
    {
        id: 4,
        title: "Optimizing PDFs for Thermal Printers",
        date: "2023-07-15",
        content:
            "Thermal printers are widely used in various industries, from retail to healthcare. However, creating PDFs that print well on thermal paper can be challenging. In this post, we'll dive into the specifics of optimizing your PDFs for 80mm and 58mm thermal printers. We'll discuss considerations like paper width, dpi settings, image handling, and font choices. By following these tips, you'll be able to create PDFs that look great and print perfectly on thermal printers.",
    },
    {
        id: 5,
        title: "The Power of Custom Paper Sizes in PDF Creation",
        date: "2023-08-01",
        content:
            "While standard paper sizes like A4 are commonly used, there are many situations where custom paper sizes can be beneficial. In this post, we'll explore the power of custom paper sizes in PDF creation. We'll show you how to set up custom sizes, discuss use cases where they're particularly useful, and provide tips for ensuring your content looks great on non-standard paper sizes. Whether you're creating unique marketing materials or specialized documents, mastering custom paper sizes will give you more flexibility in your PDF designs.",
    },
]

export default function BlogPost({ params }: { params: { id: string } }) {
    const post = posts.find((p) => p.id === Number.parseInt(params.id))

    if (!post) {
        notFound()
    }

    return (
        <article className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-500 mb-4">Published on {post.date}</p>
            <div className="prose max-w-none mb-6">
                {post.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                        {paragraph}
                    </p>
                ))}
            </div>
            <Link href="/blog">
                <Button variant="outline">Back to Blog</Button>
            </Link>
        </article>
    )
}

