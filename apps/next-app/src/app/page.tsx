import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const examples = [
  { title: "CV Template", description: "Professional resume layout", type: "html", size: "a4" },
  { title: "Invoice", description: "Clean, simple invoice design", type: "md", size: "a4" },
  { title: "Product Catalog", description: "Showcase your products", type: "html", size: "a4" },
  { title: "Newsletter", description: "Engaging email newsletter", type: "md", size: "a4" },
  { title: "Receipt", description: "Compact receipt for point of sale", type: "md", size: "80mm" },
  { title: "Ticket", description: "Event or transportation ticket", type: "md", size: "58mm" },
  { title: "Estimate", description: "Simple, clean estimate template", type: "html", size: "a4" },
]

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="mb-12 w-full max-w-6xl text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to MD/HTML/URL to PDF Converter</h1>
        <p className="text-xl mb-8">
          Convert your MD/HTML/URL documents to PDF files with ease. Choose from a variety of templates and styles, or create your own.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link href="/convert/md">
            <Button size="lg">Convert MD to PDF</Button>
          </Link>
          <Link href="/convert/html">
            <Button size="lg" variant="outline">
              Convert HTML to PDF
            </Button>
          </Link>
          <Link href="/convert/url">
            <Button size="lg" variant="outline">
              Convert URL to PDF
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Badge variant="outline">A4 (210 × 297 mm)</Badge>
          <Badge variant="outline">80mm (Thermal printer)</Badge>
          <Badge variant="outline">58mm (Thermal printer)</Badge>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {example.title}
                  <div className="flex gap-2">
                    <Badge variant="outline">{example.type.toUpperCase()}</Badge>
                    <Badge>{example.size.toUpperCase()}</Badge>
                  </div>
                </CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link
                  href={`/convert/${example.type}?template=${example.title.toLowerCase().replace(" ", "-")}&size=${example.size}&css=css-${example.title.toLowerCase().replace(" ", "-")}`}
                >
                  <Button variant="outline">Use Template</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

