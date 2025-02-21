import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className = "", ...props }) => (
  <div className={`bg-white border rounded-lg shadow-sm ${className}`} {...props} />
)

export const CardHeader: React.FC<CardProps> = ({ className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props} />
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", ...props }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
)

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = "", ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props} />
)

export const CardFooter: React.FC<CardProps> = ({ className = "", ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
)

