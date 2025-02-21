import type { ReactNode } from "react"

export default function InfoLayout({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl mx-auto py-8">{children}</div>
}
