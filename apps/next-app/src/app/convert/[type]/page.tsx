"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs } from "@/components/ui/tabs"
import { fetchMarkDownConvertPdf, fetchMarkDownConvertHtml, fetchHtmlConvertPdf, fetchHtmlConvertHtml, fetchUrlConvertPdf } from "@/lib/data"
import { Margin, Pdf } from "@/lib/definitions"
import { cleanHtml, isEmpty, isNumeric, isValidUrl } from "@/helper/util"
import IframePreview from "@/components/IframePreview"
import { alertKit } from "alert-kit"
import { predefinedSizes, templates } from "@/lib/templates"
import Editor from "@monaco-editor/react";

interface Params {
  params: { type: "md" | "html" | "url" }
}

export default function ConvertPage({ params }: Params) {
  const [input, setInput] = useState("")
  const refInput = useRef<HTMLInputElement>(null)
  const [css, setCss] = useState(templates.css)
  const [paperSize, setPaperSize] = useState<string>("A4")
  const [customSize, setCustomSize] = useState({ width: 210, height: 297 })
  const refCustomSize = useRef<HTMLInputElement>(null)
  const [margins, setMargins] = useState<Margin>({ top: 0, right: 0, bottom: 0, left: 0 })
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [fileName, setFileName] = useState("document")
  const refFileName = useRef<HTMLInputElement>(null)
  const [dataHtml, setDataHtml] = useState("")
  const type = params.type;
  const searchParams = useSearchParams()
  const template = searchParams.get("template")
  const style = searchParams.get("css")
  const size = searchParams.get("size")

  useEffect(() => {
    if (template && templates[template as keyof typeof templates]) {
      setInput(templates[template as keyof typeof templates])
    }
    if (style && templates[style as keyof typeof templates]) {
      setCss(templates[style as keyof typeof templates])
    }
    if (size && predefinedSizes[size as keyof typeof predefinedSizes]) {
      setPaperSize(size)
      setCustomSize(predefinedSizes[size as keyof typeof predefinedSizes])
    }
  }, [template, style, size])

  const handlePaperSizeChange = (value: string) => {
    setPaperSize(value)
    if (predefinedSizes[value as keyof typeof predefinedSizes]) {
      setCustomSize(predefinedSizes[value as keyof typeof predefinedSizes])
    }
  }

  const handleConvert = async () => {
    const width = isNumeric(customSize["width"].toString()) ? Number(customSize["width"].toString()) : 0;
    const height = isNumeric(customSize["height"].toString()) ? Number(customSize["height"].toString()) : 0;

    if (isEmpty(fileName)) {
      alertKit.warning({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "Please enter a file name for the generated PDF.",
      }, () => {
        refFileName.current?.focus();
      });
      return;
    }

    if (paperSize === "custom" && (width <= 0 || height <= 0)) {
      alertKit.warning({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "Width and height must be greater than 0.",
      }, () => {
        refCustomSize.current?.focus();
      });
      return;
    }

    if (paperSize === "custom" && (width <= 4 || height <= 4)) {
      alertKit.warning({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "Width and height must be greater than 4.",
      }, () => {
        refCustomSize.current?.focus();
      });
      return;
    }

    if (type === "url" && !isValidUrl(input)) {
      alertKit.warning({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "Please enter a valid URL.",
      }, () => {
        refInput.current?.focus();
      });
      return;
    }

    try {
      let newSize = null;
      if (paperSize === "custom") {
        newSize = null;
      } else {
        newSize = paperSize as "A4" | "mm80" | "mm58";
      }

      const pdf: Pdf = {
        title: fileName || "document",
        content: input,
        css: css,
        url: input,
        size: newSize,
        width: newSize ? customSize["width"].toString() : null,
        height: newSize ? customSize["height"].toString() : null,
        margin: margins,
      }

      alertKit.loading({ bodyMessageClass: ["mt-4"], message: "Converting to HTML..." });

      let html = null;
      if (type === "md") {
        html = await fetchMarkDownConvertHtml(pdf);
      } else if (type === "html") {
        html = await fetchHtmlConvertHtml(pdf);
      }

      alertKit.success({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "HTLM generated successfully",
      });

      setDataHtml(type === "url" ? input : cleanHtml(html!))
    } catch (error: unknown) {
      const message = (error as Error).message || "Error generating HTML";
      alertKit.error({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: message,
      });
    }
  }

  const handleDownload = async () => {
    const width = isNumeric(customSize["width"].toString()) ? Number(customSize["width"].toString()) : 0;
    const height = isNumeric(customSize["height"].toString()) ? Number(customSize["height"].toString()) : 0;

    if (isEmpty(fileName)) {
      alertKit.warning({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "Please enter a file name for the generated PDF.",
      }, () => {
        refFileName.current?.focus();
      });
      return;
    }

    if (paperSize === "custom" && (width <= 0 || height <= 0)) {
      alertKit.warning({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "Width and height must be greater than 0.",
      }, () => {
        refCustomSize.current?.focus();
      });
      return;
    }

    if (paperSize === "custom" && (width <= 4 || height <= 4)) {
      alertKit.warning({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "Width and height must be greater than 4.",
      }, () => {
        refCustomSize.current?.focus();
      });
      return;
    }

    if (type === "url" && !isValidUrl(input)) {
      alertKit.warning({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: "Please enter a valid URL.",
      }, () => {
        refInput.current?.focus();
      });
      return;
    }

    try {
      let newSize = null;
      if (paperSize === "custom") {
        newSize = null;
      } else {
        newSize = paperSize as "A4" | "mm80" | "mm58";
      }

      const pdf: Pdf = {
        title: fileName || "document",
        content: input,
        css: css,
        url: input,
        size: newSize,
        width: newSize ? customSize["width"].toString() : null,
        height: newSize ? customSize["height"].toString() : null,
        margin: margins,
      }

      alertKit.loading({ bodyMessageClass: ["mt-4"], message: "Generating PDF..." });

      let url = null;
      if (type === "md") {
        url = await fetchMarkDownConvertPdf(pdf);
      } else if (type === "html") {
        url = await fetchHtmlConvertPdf(pdf);
      } else {
        url = await fetchUrlConvertPdf(pdf);
      }

      alertKit.close();

      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Limpia el objeto URL después de la descarga
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error: unknown) {
      const message = (error as Error).message || "Error generating PDF";
      alertKit.error({
        headerStyle: "background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;",
        headerTitle: "MD/HTML to PDF",
        message: message
      });
    }
  }

  const tabs = [
    {
      id: "content",
      label: type,
      content: (
        <Editor
          height="400px"
          defaultLanguage={type === "md" ? "markdown" : "html"}
          value={input}
          onChange={(value) => setInput(value ?? "")}
        />
      ),
    },
    {
      id: "css",
      label: "CSS",
      content: (
        <Editor
          height="400px"
          defaultLanguage={"css"}
          value={css}
          onChange={(value) => setInput(value ?? "")}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Convert {type.toUpperCase()} to PDF</h1>
        <Badge variant="outline">{type.toUpperCase()}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {type !== "url" ? (
            <Tabs tabs={tabs} />
          ) : (
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-xl font-semibold mb-2">URL</h2>
              <div className="flex gap-2">
                <Input
                  ref={refInput}
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  className="flex-1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">Enter a URL to fetch content for conversion</p>
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="fileName" className="mb-2">File Name</Label>
            <Input
              id="fileName"
              ref={refFileName}
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name (without .pdf)"
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleConvert}>Convert</Button>
            <Button variant="outline" onClick={handleDownload}>
              Download PDF
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Preview</h2>

          <div className="border rounded-md h-[440px] overflow-auto flex justify-center p-10">
            <IframePreview
              source={{
                type: type,
                content: dataHtml,
              }}
              customSize={customSize}
              margins={margins}
              backgroundColor={backgroundColor}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Document Settings</h3>
          <div className="mb-4">
            <Label htmlFor="paperSize" className="mb-2">Paper Size</Label>
            <Select
              value={paperSize}
              onValueChange={handlePaperSizeChange}
              placeholder="Select paper size"
              className="w-full md:w-[180px]">
              <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
              <SelectItem value="80mm">80mm (Thermal printer)</SelectItem>
              <SelectItem value="58mm">58mm (Thermal printer)</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </Select>
            {paperSize === "custom" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width">Width (mm)</Label>
                  <Input
                    id="width"
                    ref={refCustomSize}
                    type="number"
                    value={customSize.width}
                    onChange={(e) => setCustomSize({ ...customSize, width: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (mm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={customSize.height}
                    onChange={(e) => setCustomSize({ ...customSize, height: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}
            <div className="mt-4">
              <Label>Print Area</Label>
              <p className="text-sm text-muted-foreground">
                {paperSize !== "custom"
                  ? `${predefinedSizes[paperSize as keyof typeof predefinedSizes].printWidth} × ${predefinedSizes[paperSize as keyof typeof predefinedSizes].printHeight} mm`
                  : "Varies based on margins"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Margins (mm)</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="marginTop" className="mb-2">Top</Label>
                <Input
                  id="marginTop"
                  type="number"
                  value={margins.top}
                  onChange={(e) => setMargins({ ...margins, top: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="marginRight" className="mb-2">Right</Label>
                <Input
                  id="marginRight"
                  type="number"
                  value={margins.right}
                  onChange={(e) => setMargins({ ...margins, right: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="marginBottom" className="mb-2">Bottom</Label>
                <Input
                  id="marginBottom"
                  type="number"
                  value={margins.bottom}
                  onChange={(e) => setMargins({ ...margins, bottom: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="marginLeft" className="mb-2">Left</Label>
                <Input
                  id="marginLeft"
                  type="number"
                  value={margins.left}
                  onChange={(e) => setMargins({ ...margins, left: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Background Color</h3>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 p-1">
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-full"
              />
            </div>
            <div className="w-28">
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-28"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
