"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [excludeOption, setExcludeOption] = useState<string>("all")
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
      const totalDaysDelta = weeks * 7 + days

      if (base && !isNaN(base.getTime())) {
        // 1. Calculate the Result Date first
        const result = new Date(base)
        if (isAddMode) {
          result.setFullYear(result.getFullYear() + years)
          result.setMonth(result.getMonth() + months)
          if (includeBaseDate) {
            result.setDate(result.getDate() - 1 + totalDaysDelta)
          } else {
            result.setDate(result.getDate() + totalDaysDelta)
          }
        } else {
          result.setFullYear(result.getFullYear() - years)
          result.setMonth(result.getMonth() - months)
          if (includeBaseDate) {
            result.setDate(result.getDate() + 1 - totalDaysDelta)
          } else {
            result.setDate(result.getDate() - totalDaysDelta)
          }
        }

        const { date: formattedDate, dayName } = formatDateOutput(result)
        setResultDate(`${formattedDate} (${dayName})`)

        // 2. Define range for distribution and counts
        let startRange: Date, endRange: Date
        if (isAddMode) {
          startRange = new Date(base)
          endRange = new Date(result)
        } else {
          startRange = new Date(result)
          endRange = new Date(base)
        }

        // 3. Initialize counts
        const counts = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 }
        let filteredTotalCount = 0
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        // 4. Iterate through the range
        const current = new Date(startRange)
        const loopEnd = new Date(endRange)
        
        // Handle inclusive logic for the range
        if (includeBaseDate) {
          loopEnd.setDate(loopEnd.getDate() + 1)
        } else {
          current.setDate(current.getDate() + 1)
          loopEnd.setDate(loopEnd.getDate() + 1)
        }

        while (current < loopEnd) {
          const name = daysOfWeek[current.getDay()] as keyof typeof counts
          const isSaturday = current.getDay() === 6
          const isSunday = current.getDay() === 0
          
          let shouldCount = true
          if (excludeOption === "saturday" && isSaturday) shouldCount = false
          if (excludeOption === "sunday" && isSunday) shouldCount = false
          if (excludeOption === "select" && (isSaturday || isSunday)) shouldCount = false

          if (shouldCount) {
            counts[name]++
            filteredTotalCount++
          } else {
            counts[name]--
          }
          current.setDate(current.getDate() + 1)
        }
        setDayCounts(counts)

        // 5. Calculate date difference for summary cards (Years, Months, Days)
        const calculateDateDiff = (d1: Date, d2: Date) => {
          const s = new Date(d1 < d2 ? d1 : d2)
          const e = new Date(d1 < d2 ? d2 : d1)
          
          let y = e.getFullYear() - s.getFullYear()
          let m = e.getMonth() - s.getMonth()
          let d = e.getDate() - s.getDate()

          if (d < 0) {
            m--
            const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0)
            d += prevMonth.getDate()
          }
          if (m < 0) {
            y--
            m += 12
          }
          
          if (includeBaseDate) {
            d += 1
            const daysInMonth = new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate()
            if (d >= daysInMonth) {
              d = 0
              m++
              if (m >= 12) {
                m = 0
                y++
              }
            }
          }
          return { years: y, months: m, days: d }
        }

        const diff = calculateDateDiff(startRange, endRange)
        setDateDifference(diff)

        // 6. Calculate summary results based on filtered count
        const totalDays = filteredTotalCount
        const totalWeeks = Math.floor(totalDays / 7)
        const remainingDaysAfterWeeks = totalDays % 7
        const totalMonthsResult = (diff.years * 12) + diff.months
        const remainingDaysAfterMonths = diff.days
        
        // Calculate remaining days after full years for the Years summary card
        const startForYears = new Date(startRange)
        startForYears.setFullYear(startRange.getFullYear() + diff.years)
        const diffTimeYears = Math.abs(endRange.getTime() - startForYears.getTime())
        const remainingDaysAfterYears = Math.floor(diffTimeYears / (1000 * 60 * 60 * 24)) + (includeBaseDate ? 1 : 0)
        
        const totalHours = totalDays * 24
        const totalMinutes = totalHours * 60
        const totalSeconds = totalMinutes * 60

        setExtraResults({
          totalWeeks,
          remainingDaysAfterWeeks,
          totalMonths: totalMonthsResult,
          remainingDaysAfterMonths,
          totalYears: diff.years,
          remainingDaysAfterYears,
          totalHours,
          totalMinutes,
          totalSeconds,
          totalDays
        })
      }
    } else {
      setResultDate("")
      setDayCounts(null)
      setExtraResults(null)
      setDateDifference(null)
    }
  }, [baseDate, baseDateDay, baseDateMonth, baseDateYear, yearsToAdd, monthsToAdd, weeksToAdd, daysToAdd, includeBaseDate, excludeOption, baseDateDayError, baseDateMonthError, isAddMode])

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
    setExcludeOption("all")
    setIsAddMode(true)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
      {/* Left Sidebar - Day Counts */}
      {resultDate !== "" && dayCounts && (
        <div className="w-full lg:w-72 bg-[#33374b]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl self-stretch">
          <p className="text-xs font-black text-green-500 uppercase tracking-widest mb-6 text-center opacity-80 border-b border-white/10 pb-3">DAYS DISTRIBUTION</p>
          <div className="flex flex-col gap-2">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <div key={day} className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex justify-between items-center px-6 transition-all hover:bg-[#71758c]/30 h-[60px]">
              <span className="text-sm font-semibold text-cyan-500">{day}</span>
              <span className="text-xl font-bold text-[#00e5ff]">{dayCounts[day as keyof typeof dayCounts]}</span>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-2xl space-y-6">
        <div className="bg-[#33374b]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-6">
          {/* Base Date Input - Separate fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-cyan-500 uppercase tracking-wider ml-1 opacity-90">Starting Date</label>
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
                <Checkbox checked={isBaseDateTodayChecked} className="w-4 h-4 cursor-pointer border-[#00e5ff] data-[state=checked]:bg-black" />
                <span className="text-xs text-[#00e5ff] font-bold uppercase">Today</span>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${baseDateDayError ? "text-red-400" : "text-white/40"}`}>Day</label>
                  {baseDateDayError && <span className="text-[10px] text-red-400 font-bold">{baseDateDayError}</span>}
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
                  className={`w-full px-4 py-4 border rounded-2xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner ${baseDateDayError ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#00e5ff]/50"}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${baseDateMonthError ? "text-red-400" : "text-white/40"}`}>Month</label>
                  {baseDateMonthError && <span className="text-[10px] text-red-400 font-bold">{baseDateMonthError}</span>}
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
                  className={`w-full px-4 py-4 border rounded-2xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner ${baseDateMonthError ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#00e5ff]/50"}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 text-center">Year</label>
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
                  className="w-full px-4 py-4 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-cyan uppercase tracking-wider ml-1 opacity-90">Details</label>
                <div className="flex items-center gap-4">
                  <div className={`font-black text-sm uppercase tracking-widest ${isAddMode ? "text-green-400" : "text-red-400"}`}>
                    {isAddMode ? "Adding" : "Subtracting"}
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAddMode(!isAddMode)}>
                    <Checkbox checked={isAddMode} className="w-4 h-4 cursor-pointer border-[#00e5ff] data-[state=checked]:bg-black" />
                    <span className="text-xs text-[#00e5ff] font-bold uppercase">Add/Subtract</span>
                  </div>
                </div>
              </div>
            <div className="grid grid-cols-4 gap-3">
              {/* Years Input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 text-center">Year</label>
                <input
                  ref={yearsToAddRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={yearsToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setYearsToAdd)}
                  onKeyDown={handleYearsToAddKeyDown}
                  min="0"
                  className="w-full px-4 py-4 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 focus:border-transparent transition hover:cursor-pointer text-center bg-[#71758c]/40 text-xl font-bold shadow-inner"
                />
              </div>

              {/* Months Input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 text-center">Month</label>
                <input
                  ref={monthsToAddRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={monthsToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setMonthsToAdd)}
                  onKeyDown={handleMonthsToAddKeyDown}
                  min="0"
                  className="w-full px-4 py-4 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 focus:border-transparent transition hover:cursor-pointer text-center bg-[#71758c]/40 text-xl font-bold shadow-inner"
                />
              </div>

              {/* Weeks Input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 text-center">Weeks</label>
                <input
                  ref={weeksToAddRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={weeksToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setWeeksToAdd)}
                  onKeyDown={handleWeeksToAddKeyDown}
                  min="0"
                  className="w-full px-4 py-4 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 focus:border-transparent transition hover:cursor-pointer text-center bg-[#71758c]/40 text-xl font-bold shadow-inner"
                />
              </div>

              {/* Days Input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 text-center">Days</label>
                <input
                  ref={daysToAddRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={daysToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setDaysToAdd)}
                  onKeyDown={handleDaysToAddKeyDown}
                  min="0"
                  className="w-full px-4 py-4 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 focus:border-transparent transition hover:cursor-pointer text-center bg-[#71758c]/40 text-xl font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Checkbox and Exclude Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#71758c]/20 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-start gap-3 w-fit">
              <Checkbox
                id="include-base-date"
                checked={includeBaseDate}
                onCheckedChange={(checked) => setIncludeBaseDate(checked as boolean)}
                className="w-5 h-5 cursor-pointer border-yellow-500 data-[state=checked]:bg-black"
              />
              <label htmlFor="include-base-date" className="text-sm text-yellow-500 font-bold cursor-pointer select-none tracking-tight">
                {includeBaseDate ? "Counting: Start date to End date (inclusive)" : "Counting: Start date to End date"}
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Select value={excludeOption} onValueChange={setExcludeOption}>
                <SelectTrigger className="w-[160px] bg-[#71758c]/40 border-white/10 text-[#00e5ff] h-10 text-sm font-bold rounded-xl cursor-pointer">
                  <SelectValue placeholder="Weekend Exclude" />
                </SelectTrigger>
                <SelectContent className="bg-[#33374b] border-white/10 text-[#00e5ff] rounded-xl">
                  <SelectItem value="all" className="cursor-pointer font-semibold">All Days</SelectItem>
                  <SelectItem value="saturday" className="cursor-pointer font-semibold">No Saturday</SelectItem>
                  <SelectItem value="sunday" className="cursor-pointer font-semibold">No Sunday</SelectItem>
                  <SelectItem value="select" className="cursor-pointer font-semibold">No Weekend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {resultDate !== "" && (
            <div className="space-y-4 pt-2">
              <div className="bg-[#71758c]/20 text-[#00e5ff] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-0">
                  <div className="border-r border-white/10 p-6">
                    <p className="text-xs font-black text-[#00e5ff] uppercase tracking-widest mb-3 text-center opacity-70">
                      RESULT DATE
                    </p>
                    <p className="text-2xl font-black text-cyan-500 text-center tracking-tighter">{resultDate}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-black text-[#00e5ff] uppercase tracking-widest mb-3 text-center opacity-70">
                      {isAddMode ? "TOTAL ADDED" : "TOTAL SUBTRACTED"}
                    </p>
                    <p className="text-2xl font-black text-cyan-500 text-center tracking-tighter">
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
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3 rounded-2xl transition-all border border-red-500/20 hover:border-red-500/40 cursor-pointer uppercase tracking-widest text-xs"
            >
              Clear All Fields
            </Button>
          )}
        </div>
      </div>

      {/* Right Sidebar - Extra Results */}
      {resultDate !== "" && extraResults && (
        <div className="w-full lg:w-80 bg-[#33374b]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl self-stretch space-y-4">
          <p className="text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-4 text-center opacity-80 border-b border-white/10 pb-3">DETAILED BREAKDOWN</p>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-[#00e5ff] transition-colors">TOTAL DAYS</p>
              <p className="text-2xl font-black text-cyan-500 text-center tracking-tighter">{extraResults.totalDays}</p>
            </div>
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-fuchsia-400 transition-colors">TOTAL WEEKS</p>
              <p className="text-xl font-black text-cyan-5500 text-center tracking-tighter">
                {extraResults.totalWeeks}<span className="text-xs font-bold text-cyan-500 ml-1">w</span> {extraResults.remainingDaysAfterWeeks}<span className="text-xs font-bold text-cyan-500 ml-1">d</span>
              </p>
            </div>
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-[#00e5ff] transition-colors">TOTAL MONTHS</p>
              <p className="text-xl font-black text-cyan-500 text-center tracking-tighter">
                {extraResults.totalMonths}<span className="text-xs font-bold text-cyan-500 ml-1">m</span> {extraResults.remainingDaysAfterMonths}<span className="text-xs font-bold text-cyan-500 ml-1">d</span>
              </p>
            </div>
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-fuchsia-400 transition-colors">TOTAL YEARS</p>
              <p className="text-xl font-black text-cyan-500 text-center tracking-tighter">
                {extraResults.totalYears}<span className="text-xs font-bold text-cyan-500 ml-1">y</span> {extraResults.remainingDaysAfterYears}<span className="text-xs font-bold text-cyan-500 ml-1">d</span>
              </p>
            </div>
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-[#00e5ff] transition-colors">TOTAL HOURS</p>
              <p className="text-lg font-black text-cyan-500 text-center tracking-tighter">{extraResults.totalHours.toLocaleString()}</p>
            </div>
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-fuchsia-400 transition-colors">TOTAL MINUTES</p>
              <p className="text-lg font-black text-cyan-500 text-center tracking-tighter">{extraResults.totalMinutes.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-24 transition-all hover:bg-[#71758c]/30 group">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-[#00e5ff] transition-colors">TOTAL SECONDS</p>
            <p className="text-xl font-black text-cyan-500 text-center tracking-tighter">{extraResults.totalSeconds.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
