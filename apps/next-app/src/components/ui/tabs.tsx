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
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`px-5 py-1 font-medium ${activeTab === tab.id ? " border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-3 border rounded-md p-5">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
        </div>
    )
}

