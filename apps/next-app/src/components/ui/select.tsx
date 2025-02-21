"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  children?: any
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  className = "",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`relative`} ref={selectRef}>
      <SelectTrigger className={className} onClick={() => setIsOpen(!isOpen)}>
        <SelectValue>
          {value ? value : placeholder}
        </SelectValue>
      </SelectTrigger>
      {isOpen && children && (
        <SelectContent>
          {React.Children.map(children, (child: React.ReactElement) => {
              const props = child.props as SelectItemProps
              return React.cloneElement(child, { onClick: () => handleSelect(props.value) })
            })}
        </SelectContent>
      )}
    </div>
  )
}

const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div
    className={`flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer bg-white ${className || ''}`}
    {...props}
  >
    {children}
    <ChevronDown className="w-4 h-4 text-gray-500" />
  </div>
);

const SelectValue: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children }) => (
  <span className="text-sm">{children}</span>
)

const SelectContent: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ children }) => (
  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
    {children}
  </ul>
)

export const SelectItem: React.FC<SelectItemProps> = ({ children, ...props }) => (
  <li className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer`} {...props}>
    {children}
  </li>
)

