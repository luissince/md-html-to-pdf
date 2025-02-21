import type React from "react"
import type { LabelHTMLAttributes } from "react"

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className = "", ...props }) => {
  return <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props} />
}