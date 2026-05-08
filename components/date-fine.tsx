"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function DateFine() {
  const [baseDate, setBaseDate] = useState<string>("")
  const [baseDateDay, setBaseDateDay] = useState<string>("")
  const [baseDateMonth, setBaseDateMonth] = useState<string>("")
  const [baseDateYear, setBaseDateYear] = useState<string>("")
  const [baseDateDayError, setBaseDateDayError] = useState<string>("")
  const [baseDateMonthError, setBaseDateMonthError] = useState<string>("")
  const [yearsToAdd, setYearsToAdd] = useState<number | string>("")
  const [monthsToAdd, setMonthsToAdd] = useState<number | string>("")
  const [weeksToAdd, setWeeksToAdd] = useState<number | string>("")
  const [daysToAdd, setDaysToAdd] = useState<number | string>("")
  const [includeBaseDate, setIncludeBaseDate] = useState<boolean>(true)
  const [resultDate, setResultDate] = useState<string>("")
  const [dayCounts, setDayCounts] = useState<{
    Sunday: number;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
  } | null>(null)
  const [extraResults, setExtraResults] = useState<{
    totalWeeks: number;
    remainingDaysAfterWeeks: number;
    totalMonths: number;
    remainingDaysAfterMonths: number;
    totalYears: number;
    remainingDaysAfterYears: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    totalDays: number;
  } | null>(null)
  const [dateDifference, setDateDifference] = useState<{ years: number; months: number; days: number } | null>(null)
  const [isBaseDateTodayChecked, setIsBaseDateTodayChecked] = useState<boolean>(false)
  const [isAddMode, setIsAddMode] = useState<boolean>(true)

  const baseDateDayRef = useRef<HTMLInputElement>(null)
  const baseDateMonthRef = useRef<HTMLInputElement>(null)
  const baseDateYearRef = useRef<HTMLInputElement>(null)
  const yearsToAddRef = useRef<HTMLInputElement>(null)
  const monthsToAddRef = useRef<HTMLInputElement>(null)
  const weeksToAddRef = useRef<HTMLInputElement>(null)
  const daysToAddRef = useRef<HTMLInputElement>(null)
  const isShiftTabRef = useRef<boolean>(false)
  const isTabKeyRef = useRef<boolean>(false)

  // When baseDate updates, sync the separate day/month/year fields
  useEffect(() => {
    if (baseDate) {
      const parts = baseDate.split("/")
      if (parts.length === 3) {
        setBaseDateDay(parts[0])
        setBaseDateMonth(parts[1])
        setBaseDateYear(parts[2])
      }
    } else {
      setBaseDateDay("")
      setBaseDateMonth("")
      setBaseDateYear("")
    }
  }, [baseDate])

  // When day/month/year changes, update baseDate
  const updateBaseDate = (day: string, month: string, year: string) => {
    if (day || month || year) {
      const formatted = `${day}/${month}/${year}`
      setBaseDate(formatted)
    } else {
      setBaseDate("")
    }
  }

  const handleBaseDateDayChange = (value: string) => {
    const day = value.replace(/\D/g, "").slice(0, 2)
    setBaseDateDay(day)
    updateBaseDate(day, baseDateMonth, baseDateYear)

    // Validate while typing
    let isValid = true
    if (day !== "") {
      const dayNum = Number.parseInt(day)
      if (dayNum > 31 || dayNum < 1) {
        setBaseDateDayError("Incorrect day")
        isValid = false
      } else {
        setBaseDateDayError("")
        isValid = true
      }
    } else {
      setBaseDateDayError("")
    }

    // Auto-focus to month only when day is filled (2 digits) AND valid
    if (day.length === 2 && isValid) {
      baseDateMonthRef.current?.focus()
    }
  }

  const handleBaseDateDayBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (baseDateDay === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const dayToFill = String(today.getDate()).padStart(2, "0")
      setBaseDateDay(dayToFill)
      updateBaseDate(dayToFill, baseDateMonth, baseDateYear)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleBaseDateDayKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
    if (e.key === "Backspace" && baseDateDay === "") {
      e.preventDefault()
      // Already at first field, do nothing
    }
  }

  const handleBaseDateMonthChange = (value: string) => {
    const month = value.replace(/\D/g, "").slice(0, 2)
    setBaseDateMonth(month)
    updateBaseDate(baseDateDay, month, baseDateYear)

    // Validate while typing
    let isValid = true
    if (month !== "") {
      const monthNum = Number.parseInt(month)
      if (monthNum > 12 || monthNum < 1) {
        setBaseDateMonthError("Incorrect month")
        isValid = false
      } else {
        setBaseDateMonthError("")
        isValid = true
      }
    } else {
      setBaseDateMonthError("")
    }

    // Auto-focus to year only when month is filled (2 digits) AND valid
    if (month.length === 2 && isValid) {
      baseDateYearRef.current?.focus()
    }
  }

  const handleBaseDateMonthBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (baseDateMonth === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const monthToFill = String(today.getMonth() + 1).padStart(2, "0")
      setBaseDateMonth(monthToFill)
      updateBaseDate(baseDateDay, monthToFill, baseDateYear)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleBaseDateMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
    if (e.key === "Backspace" && baseDateMonth === "") {
      e.preventDefault()
      baseDateDayRef.current?.focus()
    }
  }

  const handleBaseDateYearChange = (value: string) => {
    const year = value.replace(/\D/g, "").slice(0, 4)
    setBaseDateYear(year)
    updateBaseDate(baseDateDay, baseDateMonth, year)
    // Auto-focus to Years to Add when starting date year is complete (4 digits)
    if (year.length === 4) {
      yearsToAddRef.current?.focus()
    }
  }

  const handleBaseDateYearBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (baseDateYear === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const year = String(today.getFullYear()).padStart(4, "0")
      setBaseDateYear(year)
      updateBaseDate(baseDateDay, baseDateMonth, year)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleBaseDateYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
    if (e.key === "Backspace" && baseDateYear === "") {
      e.preventDefault()
      baseDateMonthRef.current?.focus()
    }
  }

  const parseDate = (dateString: string) => {
    const parts = dateString.split("/")
    if (parts.length === 3) {
      const day = Number.parseInt(parts[0])
      const month = Number.parseInt(parts[1])
      const year = Number.parseInt(parts[2])
      if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900) {
        return new Date(year, month - 1, day)
      }
    }
    return null
  }

  const formatDateOutput = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
    return { date: `${day}/${month}/${year}`, dayName }
  }

  useEffect(() => {
    // Don't calculate if there are validation errors in base date fields
    if (baseDateDayError || baseDateMonthError) {
      setResultDate("")
      return
    }

    // Don't calculate if any date field is empty
    if (!baseDateDay || !baseDateMonth || !baseDateYear) {
      setResultDate("")
      return
    }

    if (baseDate && (yearsToAdd !== "" || monthsToAdd !== "" || weeksToAdd !== "" || daysToAdd !== "")) {
      const base = parseDate(baseDate)
      const years = Number.parseInt(yearsToAdd as string) || 0
      const months = Number.parseInt(monthsToAdd as string) || 0
      const weeks = Number.parseInt(weeksToAdd as string) || 0
      const days = Number.parseInt(daysToAdd as string) || 0
      const totalDays = weeks * 7 + days

      if (base && !isNaN(base.getTime())) {
        const result = new Date(base)

        if (isAddMode) {
          result.setFullYear(result.getFullYear() + years)
          result.setMonth(result.getMonth() + months)

          // Adjust for base date counting
          if (includeBaseDate) {
            result.setDate(result.getDate() - 1 + totalDays)
          } else {
            result.setDate(result.getDate() + totalDays)
          }
        } else {
          result.setFullYear(result.getFullYear() - years)
          result.setMonth(result.getMonth() - months)

          // Adjust for base date counting in subtraction
          if (includeBaseDate) {
            result.setDate(result.getDate() + 1 - totalDays)
          } else {
            result.setDate(result.getDate() - totalDays)
          }
        }

        const { date, dayName } = formatDateOutput(result)
        setResultDate(`${date} (${dayName})`)

        // Calculate counts for each day of the week
        const counts = {
          Sunday: 0,
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0
        }

        let start: Date, end: Date
        if (isAddMode) {
          start = new Date(base)
          end = new Date(result)
        } else {
          start = new Date(result)
          end = new Date(base)
        }

        const current = new Date(start)
        const loopEnd = new Date(end)
        // In date-fine, we need to handle the inclusive logic correctly for the range
        if (includeBaseDate) {
          loopEnd.setDate(loopEnd.getDate() + 1)
        } else {
          // If not inclusive, we skip the first day
          current.setDate(current.getDate() + 1)
          loopEnd.setDate(loopEnd.getDate() + 1)
        }

        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        while (current < loopEnd) {
          const name = daysOfWeek[current.getDay()] as keyof typeof counts
          counts[name]++
          current.setDate(current.getDate() + 1)
        }
        setDayCounts(counts)

        // Calculate total days for extra results
        const finalDiffTime = Math.abs(end.getTime() - start.getTime())
        const finalDiffDays = Math.floor(finalDiffTime / (1000 * 60 * 60 * 24))
        const finalCount = includeBaseDate ? finalDiffDays + 1 : finalDiffDays

        // Calculate date difference for Years, Months, Days
        const calculateDateDiff = (d1: Date, d2: Date) => {
          const adjustedD2 = new Date(d2)
          if (includeBaseDate) {
            adjustedD2.setDate(adjustedD2.getDate() + 1)
          }

          let years = adjustedD2.getFullYear() - d1.getFullYear()
          let months = adjustedD2.getMonth() - d1.getMonth()
          let days = adjustedD2.getDate() - d1.getDate()

          if (days < 0) {
            months--
            const prevMonth = new Date(adjustedD2.getFullYear(), adjustedD2.getMonth(), 0)
            days += prevMonth.getDate()
          }

          if (months < 0) {
            years--
            months += 12
          }
          return { years, months, days }
        }

        const diff = calculateDateDiff(start, end)
        setDateDifference(diff)

        // Calculate extra results
        const totalWeeks = Math.floor(finalCount / 7)
        const remainingDaysAfterWeeks = finalCount % 7
        const totalMonths = (diff.years * 12) + diff.months
        const remainingDaysAfterMonths = diff.days
        
        const startForYears = new Date(start)
        const endForYears = new Date(start)
        endForYears.setFullYear(start.getFullYear() + diff.years)
        const diffTimeYears = Math.abs(end.getTime() - endForYears.getTime())
        const remainingDaysAfterYears = Math.floor(diffTimeYears / (1000 * 60 * 60 * 24)) + (includeBaseDate ? 1 : 0)
        
        const totalHours = finalCount * 24
        const totalMinutes = totalHours * 60
        const totalSeconds = totalMinutes * 60

        setExtraResults({
          totalWeeks,
          remainingDaysAfterWeeks,
          totalMonths,
          remainingDaysAfterMonths,
          totalYears: diff.years,
          remainingDaysAfterYears,
          totalHours,
          totalMinutes,
          totalSeconds,
          totalDays: finalCount
        })
      }
    } else {
      setResultDate("")
      setDayCounts(null)
      setExtraResults(null)
      setDateDifference(null)
    }
  }, [baseDate, baseDateDay, baseDateMonth, baseDateYear, yearsToAdd, monthsToAdd, weeksToAdd, daysToAdd, includeBaseDate, baseDateDayError, baseDateMonthError, isAddMode])

  const handleNumberInput = (value: string, setter: (val: string | number) => void) => {
    const sanitized = value.replace(/\D/g, "")
    setter(sanitized === "" ? "" : Number.parseInt(sanitized))
  }

  const handleYearsToAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && yearsToAdd === "") {
      e.preventDefault()
      baseDateYearRef.current?.focus()
    }
  }

  const handleMonthsToAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && monthsToAdd === "") {
      e.preventDefault()
      yearsToAddRef.current?.focus()
    }
  }

  const handleWeeksToAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && weeksToAdd === "") {
      e.preventDefault()
      monthsToAddRef.current?.focus()
    }
  }

  const handleDaysToAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && daysToAdd === "") {
      e.preventDefault()
      weeksToAddRef.current?.focus()
    }
  }

  const handleClear = () => {
    setIsBaseDateTodayChecked(false)
    setBaseDate("")
    setBaseDateDay("")
    setBaseDateMonth("")
    setBaseDateYear("")
    updateBaseDate("", "", "")
    setYearsToAdd("")
    setMonthsToAdd("")
    setWeeksToAdd("")
    setDaysToAdd("")
    setResultDate("")
    setDayCounts(null)
    setExtraResults(null)
    setDateDifference(null)
    setIncludeBaseDate(true)
    setIsAddMode(true)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
      {/* Left Sidebar - Day Counts */}
      {resultDate !== "" && dayCounts && (
        <div className="w-full lg:w-64 bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-xl self-stretch">
          <p className="text-xs font-bold text-white uppercase tracking-widest mb-4 text-center opacity-80 border-b border-slate-700/50 pb-2">DAYS DISTRIBUTION</p>
          <div className="flex flex-col gap-1">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <div key={day} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/30 flex justify-between items-center px-4 transition-all hover:bg-slate-800/60 h-[52px]">
              <span className="text-sm font-medium text-cyan-500">{day}</span>
              <span className="text-lg font-normal text-cyan-500">{dayCounts[day as keyof typeof dayCounts]}</span>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-2xl space-y-4">
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl space-y-4">
          {/* Base Date Input - Separate fields */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-white">Starting Date</label>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                const newChecked = !isBaseDateTodayChecked
                setIsBaseDateTodayChecked(newChecked)

                if (newChecked) {
                  // Fill with today's date
                  const today = new Date()
                  const day = String(today.getDate()).padStart(2, "0")
                  const month = String(today.getMonth() + 1).padStart(2, "0")
                  const year = String(today.getFullYear())
                  setBaseDateDay(day)
                  setBaseDateMonth(month)
                  setBaseDateYear(year)
                  updateBaseDate(day, month, year)
                } else {
                  // Clear the dates
                  setBaseDateDay("")
                  setBaseDateMonth("")
                  setBaseDateYear("")
                  updateBaseDate("", "", "")
                }
              }}>
                <Checkbox checked={isBaseDateTodayChecked} className="w-4 h-4 cursor-pointer border-cyan-500" />
                <span className="text-xs text-cyan-500 font-medium">Today</span>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-xs ${baseDateDayError ? "text-red-500" : "text-white"}`}>Day</label>
                  {baseDateDayError && <span className="text-xs text-red-500">{baseDateDayError}</span>}
                </div>
                <input
                  ref={baseDateDayRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="DD"
                  value={baseDateDay}
                  onChange={(e) => handleBaseDateDayChange(e.target.value)}
                  onKeyDown={handleBaseDateDayKeyDown}
                  onBlur={handleBaseDateDayBlur}
                  maxLength={2}
                  className={`w-full px-3 py-3 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center bg-slate-800/50 ${baseDateDayError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-xs ${baseDateMonthError ? "text-red-500" : "text-white"}`}>Month</label>
                  {baseDateMonthError && <span className="text-xs text-red-500">{baseDateMonthError}</span>}
                </div>
                <input
                  ref={baseDateMonthRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="MM"
                  value={baseDateMonth}
                  onChange={(e) => handleBaseDateMonthChange(e.target.value)}
                  onKeyDown={handleBaseDateMonthKeyDown}
                  onBlur={handleBaseDateMonthBlur}
                  maxLength={2}
                  className={`w-full px-3 py-3 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center bg-slate-800/50 ${baseDateMonthError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white mb-1 text-center">Year</label>
                <input
                  ref={baseDateYearRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={baseDateYear}
                  onChange={(e) => handleBaseDateYearChange(e.target.value)}
                  onKeyDown={handleBaseDateYearKeyDown}
                  onBlur={handleBaseDateYearBlur}
                  maxLength={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center bg-slate-800/50"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-white">Add to details</label>
                <div className="text-green-500 font-bold text-sm">
                  {isAddMode ? "Adding" : "Subtracting"}
                </div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAddMode(!isAddMode)}>
                  <Checkbox checked={isAddMode} className="w-4 h-4 cursor-pointer border-cyan-500" />
                  <span className="text-xs text-cyan-500 font-medium">Add/Subtract</span>
                </div>
              </div>
            <div className="grid grid-cols-4 gap-3">
              {/* Years Input */}
              <div>
                <label className="block text-xs font-medium text-white mb-2 text-center">Year</label>
                <input
                  ref={yearsToAddRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={yearsToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setYearsToAdd)}
                  onKeyDown={handleYearsToAddKeyDown}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:cursor-pointer text-center bg-slate-800/50"
                />
              </div>

              {/* Months Input */}
              <div>
                <label className="block text-xs font-medium text-white mb-2 text-center">Month</label>
                <input
                  ref={monthsToAddRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={monthsToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setMonthsToAdd)}
                  onKeyDown={handleMonthsToAddKeyDown}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:cursor-pointer text-center bg-slate-800/50"
                />
              </div>

              {/* Weeks Input */}
              <div>
                <label className="block text-xs font-medium text-white mb-2 text-center">Weeks</label>
                <input
                  ref={weeksToAddRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={weeksToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setWeeksToAdd)}
                  onKeyDown={handleWeeksToAddKeyDown}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:cursor-pointer text-center bg-slate-800/50"
                />
              </div>

              {/* Days Input */}
              <div>
                <label className="block text-xs font-medium text-white mb-2 text-center">Days</label>
                <input
                  ref={daysToAddRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={daysToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setDaysToAdd)}
                  onKeyDown={handleDaysToAddKeyDown}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:cursor-pointer text-center bg-slate-800/50"
                />
              </div>
            </div>
          </div>

          {/* Checkbox for include base date */}
          <div className="flex items-center justify-start gap-2 w-fit">
            <Checkbox
              id="include-base-date"
              checked={includeBaseDate}
              onCheckedChange={(checked) => setIncludeBaseDate(checked as boolean)}
              className="w-4 h-4 cursor-pointer border-yellow-500"
            />
            <label htmlFor="include-base-date" className="text-xs text-yellow-500 font-medium cursor-pointer select-none">
              {includeBaseDate ? "Counting: Start date to End date (inclusive)" : "Counting: Start date to End date"}
            </label>
          </div>

          {resultDate !== "" && (
            <div className="space-y-3">
              <div className="bg-slate-900/60 text-cyan-500 rounded-lg overflow-hidden border border-slate-700/50 shadow-2xl">
                <div className="grid grid-cols-2 gap-0">
                  <div className="border-r border-slate-700/50 p-4">
                    <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                      RESULT DATE
                    </p>
                    <p className="text-xl font-normal text-cyan-500 text-center">{resultDate}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                      {isAddMode ? "TOTAL ADDED" : "TOTAL SUBTRACTED"}
                    </p>
                    <p className="text-xl font-normal text-cyan-500 text-center">
                      {yearsToAdd || 0}Y {monthsToAdd || 0}M {weeksToAdd || 0}W {daysToAdd || 0}D
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clear Button */}
          {(baseDateDay || baseDateMonth || baseDateYear || yearsToAdd || monthsToAdd || weeksToAdd || daysToAdd || resultDate) && (
            <Button
              onClick={handleClear}
              className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-400 font-medium py-2 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 cursor-pointer"
            >
              Clear Fields
            </Button>
          )}
        </div>
      </div>

      {/* Right Sidebar - Extra Results */}
      {resultDate !== "" && extraResults && (
        <div className="w-full lg:w-80 bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-xl self-stretch">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center items-center h-28">
              <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 text-center">TOTAL DAYS</p>
              <p className="text-xl font-normal text-cyan-500 text-center">{extraResults.totalDays}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center items-center h-28">
              <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 text-center">TOTAL WEEKS</p>
              <p className="text-xl font-normal text-cyan-500 text-center">
                {extraResults.totalWeeks}<span className="text-xs font-normal text-cyan-400/70 ml-1">w</span> {extraResults.remainingDaysAfterWeeks}<span className="text-xs font-normal text-cyan-400/70 ml-1">d</span>
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center items-center h-28">
              <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 text-center">TOTAL MONTHS</p>
              <p className="text-xl font-normal text-cyan-500 text-center">
                {extraResults.totalMonths}<span className="text-xs font-normal text-cyan-400/70 ml-1">m</span> {extraResults.remainingDaysAfterMonths}<span className="text-xs font-normal text-cyan-400/70 ml-1">d</span>
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center items-center h-28">
              <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 text-center">TOTAL YEARS</p>
              <p className="text-xl font-normal text-cyan-500 text-center">
                {extraResults.totalYears}<span className="text-xs font-normal text-cyan-400/70 ml-1">y</span> {extraResults.remainingDaysAfterYears}<span className="text-xs font-normal text-cyan-400/70 ml-1">d</span>
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center items-center h-28">
              <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 text-center">TOTAL HOURS</p>
              <p className="text-xl font-normal text-cyan-500 text-center">{extraResults.totalHours.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center items-center h-28">
              <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 text-center">TOTAL MINUTES</p>
              <p className="text-xl font-normal text-cyan-500 text-center">{extraResults.totalMinutes.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center items-center h-24">
            <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 text-center">TOTAL SECONDS</p>
            <p className="text-xl font-normal text-cyan-500 text-center">{extraResults.totalSeconds.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
