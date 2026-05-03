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
      <div className="flex flex-col gap-8">
        {/* Year and Month Selectors with Navigation */}
        <div className="flex flex-col gap-6 items-center py-4">
          {/* Labels Row */}
          <div className=" text-center flex justify-center gap-32 text-center">
            <label className="text-sm font-semibold text-white text-center">Year</label>
            <label className="text-sm font-semibold text-white text-center">Month</label>
          </div>

          {/* Selector Boxes Row */}
          <div className="flex justify-center gap-16">
            {/* Year Selector Box */}
            <div className="border-2 border-green-500 rounded-lg px-6 py-3 bg-white min-w-[80px]">
              <select
                value={year}
                onChange={(e) => setYear(Number.parseInt(e.target.value))}
                className="w-full text-center font-semibold text-gray-800 bg-transparent border-none focus:outline-none hover:cursor-pointer"
              >
                {getYearOptions().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selector Box */}
            <div className="border-2 border-green-500 rounded-lg px-6 py-3 bg-white min-w-[80px]">
              <select
                value={month}
                onChange={(e) => setMonth(Number.parseInt(e.target.value))}
                className="w-full  font-semibold text-gray-800 bg-transparent border-none focus:outline-none hover:cursor-pointer"
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Arrows Row */}
          <div className="flex justify-center gap-32 items-center">
            {/* Year Navigation Arrows */}
            <div className="flex gap-4 items-center">
              <button
                onClick={handlePreviousYear}
                className="p-1 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer"
                aria-label="Previous year"
              >
                <ChevronLeft size={20} className="text-green-500 hover:cursor-pointer" />
              </button>
              <button
                onClick={handleNextYear}
                className="p-1 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer"
                aria-label="Next year"
              >
                <ChevronRight size={20} className="text-green-500 hover:cursor-pointer" />
              </button>
            </div>

            {/* Today Button */}
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-all hover:shadow-lg hover:shadow-cyan-600 transition hover:cursor-pointer"
            >
              Today
            </button>

            {/* Month Navigation Arrows */}
            <div className="flex gap-4 items-center">
              <button
                onClick={handlePreviousMonth}
                className="p-1 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} className="text-green-500 hover:cursor-pointer" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight size={20} className="text-green-500 hover:cursor-pointer" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid and Side Info */}
        <div className="flex gap-6">
          {/* Left Sidebar - Current Month Holiday List */}
          <div className="hidden lg:flex flex-col gap-2 w-32">
            <h3 className="text-sm font-bold text-gray-700 text-center">Current month Holiday list</h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200 max-h-96 overflow-y-auto">
              {currentMonthData.holidays.length > 0 ? (
                <ul className="space-y-2">
                  {currentMonthData.holidays.map((holiday, idx) => (
                    <li key={idx} className="text-xs text-gray-700 text-center">
                      <div className="font-medium">{holiday.name}</div>
                      <div className="text-gray-500">Oct {holiday.date}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 text-center">No holidays</p>
              )}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h2 className="text-xl font-bold text-center mb-6 text-white">
              {monthNames[month]} {year}
            </h2>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className={`text-center font-semibold text-sm py-2 ${
                    day === "Sun" || day === "Sat"
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const dayOfWeek = idx % 7
                const isWeekendDay = isWeekend(dayOfWeek)
                const isTodayDate = day && isToday(day)

                return (
                  <div
                    key={idx}
                    className={`aspect-square flex items-center justify-center rounded text-sm font-medium transition ${
                      day === null
                        ? "bg-transparent"
                        : isWeekendDay
                          ? "bg-red-500/30 text-red-400 border border-red-500/60"
                          : isTodayDate
                            ? "bg-purple-600 text-white border border-purple-600"
                            : "bg-white/20 text-white border border-white/40 hover:bg-white/30"
                    }`}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Sidebar - Current Month Festival List */}
          <div className="hidden lg:flex flex-col gap-2 w-32">
            <h3 className="text-sm font-bold text-gray-700 text-center">Current month festival list</h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200 max-h-96 overflow-y-auto">
              {currentMonthData.festivals.length > 0 ? (
                <ul className="space-y-2">
                  {currentMonthData.festivals.map((festival, idx) => (
                    <li key={idx} className="text-xs text-gray-700 text-center">
                      <div className="font-medium">{festival.name}</div>
                      <div className="text-gray-500">Oct {festival.date}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 text-center">No festivals</p>
              )}
            </div>
          </div>
        </div>

        {/* Holiday and Festival Section for Mobile */}
        <div className="lg:hidden bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Holidays and Festivals</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Holidays</h4>
              {currentMonthData.holidays.length > 0 ? (
                <ul className="space-y-2">
                  {currentMonthData.holidays.map((holiday, idx) => (
                    <li key={idx} className="text-xs text-gray-700">
                      <div className="font-medium">{holiday.name}</div>
                      <div className="text-gray-500">Oct {holiday.date}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">No holidays</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Festivals</h4>
              {currentMonthData.festivals.length > 0 ? (
                <ul className="space-y-2">
                  {currentMonthData.festivals.map((festival, idx) => (
                    <li key={idx} className="text-xs text-gray-700">
                      <div className="font-medium">{festival.name}</div>
                      <div className="text-gray-500">Oct {festival.date}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">No festivals</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
