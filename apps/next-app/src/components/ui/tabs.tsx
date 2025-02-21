"use client"

import type React from "react"
import { useState } from "react"

interface Tab {
    id: string
    label: string
    content: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id)

    return (
        <div>
            <div className="flex border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`px-4 py-2 font-medium ${activeTab === tab.id ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-4">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
        </div>
    )
}

