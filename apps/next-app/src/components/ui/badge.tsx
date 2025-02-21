import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "outline"
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default" }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    outline: "bg-white text-gray-600 border border-gray-300",
  }

  return <span className={`${baseStyles} ${variantStyles[variant]}`}>{children}</span>
}

