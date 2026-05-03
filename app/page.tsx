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
    <main className="min-h-screen px-4 pt-1 pb-6 overflow-y-auto scrollbar-style">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="hero-header mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold animated-title text-center">
            Day & Date System
          </h1>
        </div>

        {/* Selector Card - Glass UI */}
        <div className="backdrop-blur-md bg-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 mb-4 sm:mb-5 border border-white/40">
          <div className="flex flex-col sm:flex-row gap-4 items-end">

            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-semibold text-cyan-500 mb-2 sm:mb-3">
                Select Calculator
              </label>

              <Select value={selectedOption} onValueChange={handleChange}>
                <SelectTrigger className="w-full backdrop-blur-sm bg-white/20 border-white/40 hover:bg-white/30 hover:border-white/60 transition cursor-pointer text-black">
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>

                <SelectContent className="backdrop-blur-md bg-slate-900/60 text-cyan-500 border-white/30 scrollable-dropdown">

                  <SelectItem
                    value="default"
                    disabled
                    className="cursor-not-allowed opacity-60 text-cyan-500"
                  >
                    Choose an option
                  </SelectItem>

                  <SelectItem value="day-count" className={itemStyle}>
                    Day Count
                  </SelectItem>

                  <SelectItem value="date-fine" className={itemStyle}>
                    Date Fine
                  </SelectItem>

                  <SelectItem value="days-convert" className={itemStyle}>
                    Days Convert
                  </SelectItem>

                  {/* <SelectItem value="calendar" className={itemStyle}>
                    Calendar
                  </SelectItem> */}

                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleClear}
              className="w-full sm:w-auto bg-purple-600 hover:bg-gray-300 text-white hover:text-red-500 font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg hover:shadow-red-600 cursor-pointer"
            >
              Clear
            </Button>

          </div>
        </div>

        {/* Content Area */}
        {selectedOption !== "default" && (
          <div className="backdrop-blur-md bg-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 border border-white/40 mb-6 sm:mb-8">
            {selectedOption === "day-count" && <DayCount />}
            {selectedOption === "date-fine" && <DateFine />}
            {selectedOption === "days-convert" && <DaysConvert />}
            {selectedOption === "calendar" && <Calendar />}
          </div>
        )}
      </div>
    </main>
  )
}
