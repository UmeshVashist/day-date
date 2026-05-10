"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample holidays and festivals data with dates
const holidaysData: Record<string, Record<number, { holidays: Array<{ name: string; date: number }>; festivals: Array<{ name: string; date: number }> }>> = {
  // "2024": {
  //   0: { holidays: [{ name: "New Year's Day", date: 1 }], festivals: [] },
  //   1: { holidays: [{ name: "Republic Day", date: 26 }], festivals: [{ name: "Spring Festival", date: 10 }] },
  //   2: { holidays: [], festivals: [{ name: "Holi", date: 25 }] },
  //   3: { holidays: [{ name: "Good Friday", date: 29 }], festivals: [] },
  //   4: { holidays: [{ name: "Labour Day", date: 1 }], festivals: [] },
  //   5: { holidays: [], festivals: [] },
  //   6: { holidays: [{ name: "Independence Day", date: 4 }], festivals: [] },
  //   7: { holidays: [], festivals: [] },
  //   8: { holidays: [{ name: "Labor Day", date: 2 }], festivals: [] },
  //   9: { holidays: [{ name: "Gandhi Jayanti", date: 2 }], festivals: [{ name: "Diwali", date: 31 }] },
  //   10: { holidays: [], festivals: [] },
  //   11: { holidays: [{ name: "Christmas", date: 25 }], festivals: [{ name: "New Year's Eve", date: 31 }] },
  // },
  // "2025": {
  //   0: { holidays: [{ name: "New Year's Day", date: 1 }], festivals: [] },
  //   1: { holidays: [{ name: "Republic Day", date: 26 }], festivals: [{ name: "Spring Festival", date: 10 }] },
  //   2: { holidays: [], festivals: [{ name: "Holi", date: 14 }] },
  //   3: { holidays: [{ name: "Good Friday", date: 18 }], festivals: [] },
  //   4: { holidays: [{ name: "Labour Day", date: 1 }], festivals: [] },
  //   5: { holidays: [], festivals: [] },
  //   6: { holidays: [{ name: "Independence Day", date: 4 }], festivals: [] },
  //   7: { holidays: [], festivals: [] },
  //   8: { holidays: [{ name: "Labor Day", date: 1 }], festivals: [] },
  //   9: { holidays: [{ name: "Gandhi Jayanti", date: 2 }], festivals: [{ name: "Diwali", date: 20 }] },
  //   10: { holidays: [], festivals: [] },
  //   11: { holidays: [{ name: "Christmas", date: 25 }], festivals: [{ name: "New Year's Eve", date: 31 }] },
  // },
  // "2026": {
  //   0: { holidays: [{ name: "New Year's Day", date: 1 }], festivals: [] },
  //   1: { holidays: [{ name: "Republic Day", date: 26 }], festivals: [{ name: "Spring Festival", date: 10 }] },
  //   2: { holidays: [], festivals: [{ name: "Holi", date: 6 }] },
  //   3: { holidays: [{ name: "Good Friday", date: 3 }], festivals: [] },
  //   4: { holidays: [{ name: "Labour Day", date: 1 }], festivals: [] },
  //   5: { holidays: [], festivals: [] },
  //   6: { holidays: [{ name: "Independence Day", date: 4 }], festivals: [] },
  //   7: { holidays: [], festivals: [] },
  //   8: { holidays: [{ name: "Labor Day", date: 5 }], festivals: [] },
  //   9: { holidays: [{ name: "Gandhi Jayanti", date: 2 }, { name: "Dussehra", date: 13 }], festivals: [{ name: "Diwali", date: 8 }] },
  //   10: { holidays: [{ name: "Thanksgiving", date: 26 }], festivals: [] },
  //   11: { holidays: [{ name: "Christmas", date: 25 }], festivals: [{ name: "New Year's Eve", date: 31 }] },
  // },
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function Calendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const getYearOptions = () => {
    const startYear = 1901
    const endYear = 2126
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
  }

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay()
  }

  const isWeekend = (dayOfWeek: number) => {
    return dayOfWeek === 0 || dayOfWeek === 6 // Sunday = 0, Saturday = 6
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const days = []

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }, [year, month])

  const currentMonthData = holidaysData[year.toString()]?.[month] || {
    holidays: [],
    festivals: [],
  }

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const handlePreviousYear = () => {
    setYear(year - 1)
  }

  const handleNextYear = () => {
    setYear(year + 1)
  }

  const handleToday = () => {
    const today = new Date()
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-10">
        {/* Year and Month Selectors with Navigation */}
        <div className="flex flex-col gap-6 items-center py-6">
          {/* Labels Row */}
          <div className="w-full max-w-sm flex justify-between px-10">
            <label className="text-xs font-black text-[#00e5ff] uppercase tracking-widest opacity-80">Year</label>
            <label className="text-xs font-black text-[#00e5ff] uppercase tracking-widest opacity-80">Month</label>
          </div>

          {/* Selector Boxes Row */}
          <div className="flex justify-center gap-6 sm:gap-12 w-full">
            {/* Year Selector Box */}
            <div className="border-2 border-white/10 rounded-2xl px-6 py-4 bg-[#71758c]/40 backdrop-blur-md min-w-[140px] shadow-xl focus-within:border-[#00e5ff]/50 transition-all">
              <select
                value={year}
                onChange={(e) => setYear(Number.parseInt(e.target.value))}
                className="w-full text-center font-black text-white bg-transparent border-none focus:outline-none hover:cursor-pointer text-xl appearance-none"
              >
                {getYearOptions().map((y) => (
                  <option key={y} value={y} className="bg-[#33374b] text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selector Box */}
            <div className="border-2 border-white/10 rounded-2xl px-6 py-4 bg-[#71758c]/40 backdrop-blur-md min-w-[160px] shadow-xl focus-within:border-[#00e5ff]/50 transition-all">
              <select
                value={month}
                onChange={(e) => setMonth(Number.parseInt(e.target.value))}
                className="w-full text-center font-black text-white bg-transparent border-none focus:outline-none hover:cursor-pointer text-xl appearance-none"
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx} className="bg-[#33374b] text-white">
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Arrows Row */}
          <div className="flex justify-center gap-12 sm:gap-24 items-center">
            <div className="flex gap-4">
              <button
                onClick={handlePreviousYear}
                className="p-3 bg-[#71758c]/20 border border-white/10 rounded-xl text-[#00e5ff] hover:bg-[#71758c]/30 transition-all shadow-lg active:scale-95"
                title="Previous Year"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </button>
              <button
                onClick={handlePreviousMonth}
                className="p-3 bg-[#71758c]/20 border border-white/10 rounded-xl text-fuchsia-400 hover:bg-[#71758c]/30 transition-all shadow-lg active:scale-95"
                title="Previous Month"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            <button
              onClick={handleToday}
              className="px-8 py-3 bg-[#00e5ff]/20 border border-[#00e5ff]/30 text-[#00e5ff] font-black rounded-2xl hover:bg-[#00e5ff]/30 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm"
            >
              Today
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleNextMonth}
                className="p-3 bg-[#71758c]/20 border border-white/10 rounded-xl text-fuchsia-400 hover:bg-[#71758c]/30 transition-all shadow-lg active:scale-95"
                title="Next Month"
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
              <button
                onClick={handleNextYear}
                className="p-3 bg-[#71758c]/20 border border-white/10 rounded-xl text-[#00e5ff] hover:bg-[#71758c]/30 transition-all shadow-lg active:scale-95"
                title="Next Year"
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#33374b]/60 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
          <div className="grid grid-cols-7 gap-1 sm:gap-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-black text-[#00e5ff] uppercase tracking-widest text-[10px] sm:text-xs opacity-60 pb-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => {
              const dayOfWeek = idx % 7
              const isWeekendDay = isWeekend(dayOfWeek)
              const todayClass = day && isToday(day) ? "bg-[#00e5ff] text-white shadow-[0_0_20px_rgba(0,229,255,0.5)] scale-110" : ""
              const weekendClass = isWeekendDay ? "text-red-400/80" : "text-white"
              const hasHoliday = day && holidaysData[year.toString()]?.[month]?.holidays.some((h) => h.date === day)
              const hasFestival = day && holidaysData[year.toString()]?.[month]?.festivals.some((f) => f.date === day)

              return (
                <div
                  key={idx}
                  className={`relative aspect-square flex items-center justify-center text-sm sm:text-xl font-black rounded-2xl transition-all ${day ? "cursor-default hover:bg-white/10" : ""} ${todayClass} ${!todayClass && day ? weekendClass : ""}`}
                >
                  {day}
                  <div className="absolute bottom-1.5 flex gap-1">
                    {hasHoliday && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                    {hasFestival && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Holidays</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Festivals</span>
          </div>
        </div>
      </div>
    </div>
  )
}
