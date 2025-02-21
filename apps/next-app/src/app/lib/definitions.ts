export interface Margin {
    top: number
    right: number
    bottom: number
    left: number
}

export interface Pdf {
    title: string
    content: string
    css: string
    size: "A4" | "mm80" | "mm58" | null
    width: string | null
    height: string | null
    margin: Margin
}