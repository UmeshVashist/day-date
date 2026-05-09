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
  SelectValue
} from "@/components/ui/select"

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string>("default")
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [mounted, setMounted] = useState(false)

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
          <div className="backdrop-blur-md bg-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 mb-2 sm:mb-3 border border-white/40">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-cyan-500">Select Calculator</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Select value={selectedOption} onValueChange={handleChange}>
                    <SelectTrigger className="w-full bg-white/20 backdrop-blur-md border-white/40 text-black h-12">
                      <SelectValue placeholder="Select a calculator" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/90 backdrop-blur-xl border-white/20 text-cyan-500">
                      <SelectItem value="day-count" className="hover:bg-white/10 cursor-pointer">Day Count</SelectItem>
                      <SelectItem value="date-fine" className="hover:bg-white/10 cursor-pointer">Date Fine</SelectItem>
                      <SelectItem value="days-convert" className="hover:bg-white/10 cursor-pointer">Days Convert</SelectItem>
                      <SelectItem value="calculator" className="hover:bg-white/10 cursor-pointer">Calculator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleClear}
                  className="bg-purple-600 hover:cursor-pointer hover:bg-purple-700 text-white font-bold px-8 h-12 rounded-xl transition-all shadow-lg shadow-purple-500/30"
                >
                  Clear
                </Button>
              </div>
              
              {/* Real-time Clock */}
              <div className="text-center flex items-center justify-center gap-2 min-h-[32px]">
                {mounted && (
                  <>
                    <span className="text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm">
                      {formatDateTime(currentTime).date}
                    </span>
                    <span className="text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm">
                      {formatDateTime(currentTime).time}
                    </span>
                  </>
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
