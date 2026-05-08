"use client"

import { useState } from "react"
import DayCount from "@/components/day-count"
import DateFine from "@/components/date-fine"
import Calendar from "@/components/calendar"
import DaysConvert from "@/components/days-convert"
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
            </div>
          </div>
        </div>

        {/* Content Area */}
        {selectedOption !== "default" && (
          <div className={`${(selectedOption === 'day-count' || selectedOption === 'date-fine') ? 'w-full' : 'backdrop-blur-md bg-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 border border-white/40 max-w-2xl mx-auto'} mb-6 sm:mb-8 transition-all duration-300`}>
            {selectedOption === "day-count" && <DayCount />}
            {selectedOption === "date-fine" && <DateFine />}
            {selectedOption === "days-convert" && <DaysConvert />}
            {selectedOption === "calendar" && <Calendar />}
          </div>
        )}
      </div>

      {/* Version Footer */}
      <div className="fixed bottom-4 left-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-sm font-bold text-sm">version 1.3</span>
      </div>
    </main>
  )
}
