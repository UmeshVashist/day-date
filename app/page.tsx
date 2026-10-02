"use client"

import { useState, useEffect } from "react"
import DayCount from "@/components/day-count"
import DateFine from "@/components/date-fine"
import Calendar from "@/components/calendar"
import DaysConvert from "@/components/days-convert"
import TimeCount from "@/components/time-count"
import TimeFiend from "@/components/time-fiend"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, X, Sparkles } from "lucide-react"
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
    { value: "time-count", label: "Time Count" },
    { value: "time-fiend", label: "Time Fiend" },
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
    setSearchTerm("")
    setIsDropdownOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#1e2235]/75 border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">

          {/* Header Left: Day & Date System */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none group"
            onClick={() => {
              setSelectedOption("default")
              setSearchTerm("")
              setIsDropdownOpen(false)
            }}
            title="Day & Date System - Home"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-fuchsia-500 to-cyan-400 p-[1px] shadow-[0_0_12px_rgba(0,229,255,0.35)] group-hover:shadow-[0_0_18px_rgba(0,229,255,0.6)] transition-all flex items-center justify-center">
              <div className="w-full h-full bg-[#1e2235] rounded-[7px] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm">
              Day & Date System
            </h1>
          </div>

          {/* Header Right: Clock + Dropdown + Clear */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Real-time Clock (Desktop/Tablet) */}
            {mounted && (
              <div className="hidden lg:flex items-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 font-semibold">
                  {formatDateTime(currentTime).date} {formatDateTime(currentTime).time}
                </span>
              </div>
            )}

            {/* Dropdown Selector */}
            <div className="relative group w-36 min-[420px]:w-44 sm:w-56">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    selectedOption !== "default"
                      ? calculators.find(c => c.value === selectedOption)?.label
                      : "Search or Select..."
                  }
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-[#33374b]/80 hover:bg-[#33374b] backdrop-blur-md border border-white/15 text-white h-9 px-7 sm:px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/60 text-xs shadow-inner"
                />
                <Search className="absolute left-2 sm:left-2.5 h-3.5 w-3.5 text-white/50" />
                <div className="absolute right-2 sm:right-2.5 flex items-center gap-1">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSearchTerm("")
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsDropdownOpen(!isDropdownOpen)
                    }}
                    className="text-white/50 hover:text-white transition-colors p-0.5"
                  >
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                  </button>
                </div>
              </div>

              {/* Custom Searchable Dropdown List */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 sm:w-60 bg-[#23273a] backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="max-h-[260px] overflow-y-auto py-1.5 scrollable-dropdown">
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
                            "px-3.5 py-2.5 cursor-pointer transition-all flex items-center justify-between text-xs",
                            index === highlightedIndex ? "bg-white/10 text-[#00e5ff]" : "text-white/80 hover:bg-white/5",
                            selectedOption === calc.value && "text-[#00e5ff] font-bold bg-[#00e5ff]/10"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={cn("h-1.5 w-1.5 rounded-full transition-all", selectedOption === calc.value ? "bg-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.8)]" : "bg-transparent")} />
                            <span>{calc.label}</span>
                          </div>
                          {selectedOption === calc.value && (
                            <span className="text-[9px] uppercase font-bold tracking-wider text-[#00e5ff]/90 bg-[#00e5ff]/20 px-1.5 py-0.5 rounded">Active</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-white/40 text-xs italic">
                        No option found
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

            {/* Clear Button */}
            <Button
              onClick={handleClear}
              className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold px-3 sm:px-4 h-9 rounded-xl transition-all border border-yellow-500/20 hover:border-yellow-500/40 cursor-pointer text-[10px] tracking-widest uppercase active:scale-95 shadow-md shadow-yellow-500/5"
            >
              Clear
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center justify-start">
        {selectedOption !== "default" ? (
          <div id="main-content-area" className={`${(selectedOption === 'day-count' || selectedOption === 'date-fine' || selectedOption === 'time-count' || selectedOption === 'time-fiend') ? 'w-full' : 'backdrop-blur-xl bg-slate-900/40 rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-white/10 max-w-2xl mx-auto'} mb-10 transition-all duration-300`}>
            {selectedOption === "day-count" && <DayCount />}
            {selectedOption === "date-fine" && <DateFine />}
            {selectedOption === "days-convert" && <DaysConvert />}
            {selectedOption === "time-count" && <TimeCount />}
            {selectedOption === "time-fiend" && <TimeFiend />}
            {selectedOption === "calendar" && <Calendar />}
          </div>
        ) : (
          /* Subtle view when no option is selected */
          <div className="my-auto py-12 flex flex-col items-center text-center">
            {/* Real-time Clock for mobile when not visible in header */}
            {mounted && (
              <div className="lg:hidden mb-6 px-4 py-1.5 rounded-full bg-[#1e2235]/60 border border-white/10 backdrop-blur-md text-xs font-mono">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 font-semibold">
                  {formatDateTime(currentTime).date} {formatDateTime(currentTime).time}
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Version Footer */}
      <div className="fixed bottom-4 left-4 z-10 pointer-events-none">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm font-bold text-sm">version 1.9</span>
      </div>
    </div>
  )
}
