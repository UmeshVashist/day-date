"use client"

import { useState, useEffect } from "react"
import DayCount from "@/components/day-count"
import DateFine from "@/components/date-fine"
import Calendar from "@/components/calendar"
import DaysConvert from "@/components/days-convert"
import Calculator from "@/components/calculator"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Search, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string>("default")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [mounted, setMounted] = useState(false)

  const calculators = [
    { value: "day-count", label: "Day Count" },
    { value: "date-fine", label: "Date Fine" },
    { value: "days-convert", label: "Days Convert" },
    { value: "calculator", label: "Calculator" },
  ]

  const filteredCalculators = calculators.filter(calc => 
    calc.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    setHighlightedIndex(0)
  }, [searchTerm])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsDropdownOpen(true)
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex(prev => (prev + 1) % filteredCalculators.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex(prev => (prev - 1 + filteredCalculators.length) % filteredCalculators.length)
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (filteredCalculators.length > 0) {
        e.preventDefault()
        const selected = filteredCalculators[highlightedIndex]
        setSelectedOption(selected.value)
        setSearchTerm("")
        setIsDropdownOpen(false)
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    
    let hours = date.getHours()
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    hours = hours ? hours : 12
    const hoursStr = String(hours).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    
    return {
      date: `${day}/${month}/${year}`,
      time: `${hoursStr}:${minutes}:${seconds} ${ampm}`
    }
  }

  const handleClear = () => {
    setSelectedOption("default")
  }

  const handleChange = (value: string) => {
    setSelectedOption(value)
  }

  // ✅ reusable hover style
  const itemStyle =
    "cursor-pointer hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"

  return (
    <main className="min-h-screen py-2 sm:py-4 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header - Gradient Text */}
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-center mb-2 sm:mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm">
              Day & Date System
            </span>
          </h1>

          {/* Selector Card - Glass UI */}
          <div className="backdrop-blur-md bg-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 mb-2 sm:mb-3 border border-white/40 relative z-50">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-cyan-500">Select Calculator</label>
              <div className="flex gap-2 relative">
                <div className="relative flex-1 group">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={selectedOption !== "default" ? calculators.find(c => c.value === selectedOption)?.label : "Search or Select Calculator..."}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setIsDropdownOpen(true)
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-white/20 backdrop-blur-md border border-white/40 text-black h-12 px-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-black/60"
                    />
                    <Search className="absolute left-3 h-5 w-5 text-black/50" />
                    <div className="absolute right-3 flex items-center gap-1">
                      {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="text-red-500 hover:cursor-pointer transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-black hover:cursor-pointer transition-colors">
                        <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                      </button>
                    </div>
                  </div>

                  {/* Custom Searchable Dropdown List */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="max-h-[240px] overflow-y-auto py-2">
                        {filteredCalculators.length > 0 ? (
                          filteredCalculators.map((calc, index) => (
                            <div
                              key={calc.value}
                              onClick={() => {
                                setSelectedOption(calc.value)
                                setSearchTerm("")
                                setIsDropdownOpen(false)
                              }}
                              onMouseEnter={() => setHighlightedIndex(index)}
                              className={cn(
                                "px-4 py-3 cursor-pointer transition-colors flex items-center gap-3",
                                index === highlightedIndex ? "bg-cyan-500/20 text-cyan-400" : "text-cyan-500 hover:bg-white/10"
                              )}
                            >
                              <div className={cn("h-2 w-2 rounded-full", selectedOption === calc.value ? "bg-cyan-400" : "bg-transparent")} />
                              <span className="font-medium">{calc.label}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-cyan-800 text-sm">
                            No calculator found for "{searchTerm}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Global Click Handler to close dropdown */}
                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}

                <Button 
                  onClick={handleClear}
                  className="bg-purple-600 hover:cursor-pointer hover:bg-purple-700 text-white font-bold px-8 h-12 rounded-xl transition-all shadow-lg shadow-purple-500/30 relative z-50"
                >
                  Clear
                </Button>
              </div>
              
              {/* Real-time Clock */}
              <div className="text-center min-h-[32px] flex items-center justify-center">
                {mounted && (
                  <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm animate-gradient-x">
                    {formatDateTime(currentTime).date} {formatDateTime(currentTime).time}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {selectedOption !== "default" && (
          <div className={`${(selectedOption === 'day-count' || selectedOption === 'date-fine' || selectedOption === 'calculator') ? 'w-full' : 'backdrop-blur-md bg-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 border border-white/40 max-w-2xl mx-auto'} mb-6 sm:mb-8 transition-all duration-300`}>
            {selectedOption === "day-count" && <DayCount />}
            {selectedOption === "date-fine" && <DateFine />}
            {selectedOption === "days-convert" && <DaysConvert />}
            {selectedOption === "calculator" && <Calculator />}
            {selectedOption === "calendar" && <Calendar />}
          </div>
        )}
      </div>

      {/* Version Footer */}
      <div className="fixed bottom-4 left-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm font-bold text-sm">version 1.4</span>
      </div>
    </main>
  )
}
