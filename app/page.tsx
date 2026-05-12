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
  const _itemStyle =
    "cursor-pointer hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white";

  return (
    <div className="min-h-screen py-2 sm:py-4 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header - Gradient Text */}
        <div className="max-w-xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-black text-center mb-4 sm:mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm">
              Day & Date System
            </span>
          </h1>

          {/* Selector Card - Glass UI */}
          <div className="backdrop-blur-xl bg-[#33374b]/60 rounded-[1.25rem] shadow-2xl p-4 sm:p-5 mb-6 border border-white/10 relative z-50">
            <div className="flex flex-col space-y-3">
              <label className="text-[9px] font-black text-[#00e5ff] tracking-[0.2em] uppercase ml-1 opacity-80">Select Calculator</label>
              <div className="flex flex-col sm:flex-row gap-2 relative">
                <div className="relative flex-1 group">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={selectedOption !== "default" ? calculators.find(c => c.value === selectedOption)?.label : "Search or Select..."}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setIsDropdownOpen(true)
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-[#71758c]/40 backdrop-blur-md border border-white/10 text-white h-10 px-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/30 transition-all placeholder:text-white/40 text-xs shadow-inner"
                    />
                    <Search className="absolute left-3 h-3.5 w-3.5 text-white/40" />
                    <div className="absolute right-3 flex items-center gap-1.5">
                      {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="text-red-400 hover:text-red-300 transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-white/40 hover:text-white transition-colors">
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                      </button>
                    </div>
                  </div>

                  {/* Custom Searchable Dropdown List */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#33374b] backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="max-h-[240px] overflow-y-auto py-1.5">
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
                                "px-4 py-2 cursor-pointer transition-all flex items-center gap-3",
                                index === highlightedIndex ? "bg-white/10 text-[#00e5ff]" : "text-white/70 hover:bg-white/5"
                              )}
                            >
                              <div className={cn("h-1.5 w-1.5 rounded-full transition-all", selectedOption === calc.value ? "bg-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.8)]" : "bg-transparent")} />
                              <span className="font-bold text-xs">{calc.label}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-white/30 text-[10px] italic">
                            No result for "{searchTerm}"
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
                  className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold py-3 rounded-2xl transition-all border border-yellow-500/20 hover:border-yellow-500/40 cursor-pointer font-black px-5 h-10 rounded-lg transition-all shadow-lg shadow-purple-900/40 relative z-50 text-[10px] tracking-widest uppercase active:scale-95"
                >
                  Clear
                </Button>
              </div>
              
              {/* Real-time Clock */}
              <div className="text-center pt-1 min-h-[20px]">
                {mounted && (
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm">
                    {formatDateTime(currentTime).date} {formatDateTime(currentTime).time}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {selectedOption !== "default" && (
          <div className={`${(selectedOption === 'day-count' || selectedOption === 'date-fine' || selectedOption === 'calculator') ? 'w-full' : 'backdrop-blur-xl bg-slate-900/40 rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-white/10 max-w-2xl mx-auto'} mb-10 transition-all duration-300`}>
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
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm font-bold text-sm">version 1.6</span>
      </div>
    </div>
  )
}
