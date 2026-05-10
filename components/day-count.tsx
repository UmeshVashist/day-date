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

export default function DayCount() {
  const [startDate, setStartDate] = useState<string>("")
  const [startDateDay, setStartDateDay] = useState<string>("")
  const [startDateMonth, setStartDateMonth] = useState<string>("")
  const [startDateYear, setStartDateYear] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [endDateDay, setEndDateDay] = useState<string>("")
  const [endDateMonth, setEndDateMonth] = useState<string>("")
  const [endDateYear, setEndDateYear] = useState<string>("")
  const [startDateDayError, setStartDateDayError] = useState<string>("")
  const [startDateMonthError, setStartDateMonthError] = useState<string>("")
  const [endDateDayError, setEndDateDayError] = useState<string>("")
  const [endDateMonthError, setEndDateMonthError] = useState<string>("")
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(true)
  const [excludeOption, setExcludeOption] = useState<string>("all")
  const [dayCount, setDayCount] = useState<number | null>(null)
  const [dateDifference, setDateDifference] = useState<{ years: number; months: number; days: number } | null>(null)
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
    dayCounts: {
      Sunday: number;
      Monday: number;
      Tuesday: number;
      Wednesday: number;
      Thursday: number;
      Friday: number;
      Saturday: number;
    };
  } | null>(null)
  const [isStartDateTodayChecked, setIsStartDateTodayChecked] = useState<boolean>(false)
  const [isEndDateTodayChecked, setIsEndDateTodayChecked] = useState<boolean>(false)

  const startDateDayRef = useRef<HTMLInputElement>(null)
  const startDateMonthRef = useRef<HTMLInputElement>(null)
  const startDateYearRef = useRef<HTMLInputElement>(null)
  const endDateDayRef = useRef<HTMLInputElement>(null)
  const endDateMonthRef = useRef<HTMLInputElement>(null)
  const endDateYearRef = useRef<HTMLInputElement>(null)
  const isShiftTabRef = useRef<boolean>(false)
  const isTabKeyRef = useRef<boolean>(false)

  // Sync startDate with day/month/year fields
  useEffect(() => {
    if (startDate) {
      const parts = startDate.split("/")
      if (parts.length === 3) {
        setStartDateDay(parts[0])
        setStartDateMonth(parts[1])
        setStartDateYear(parts[2])
      }
    } else {
      setStartDateDay("")
      setStartDateMonth("")
      setStartDateYear("")
    }
  }, [startDate])

  // Sync endDate with day/month/year fields
  useEffect(() => {
    if (endDate) {
      const parts = endDate.split("/")
      if (parts.length === 3) {
        setEndDateDay(parts[0])
        setEndDateMonth(parts[1])
        setEndDateYear(parts[2])
      }
    } else {
      setEndDateDay("")
      setEndDateMonth("")
      setEndDateYear("")
    }
  }, [endDate])

  const updateStartDate = (day: string, month: string, year: string) => {
    if (day || month || year) {
      const formatted = `${day}/${month}/${year}`
      setStartDate(formatted)
    } else {
      setStartDate("")
    }
  }

  const updateEndDate = (day: string, month: string, year: string) => {
    if (day || month || year) {
      const formatted = `${day}/${month}/${year}`
      setEndDate(formatted)
    } else {
      setEndDate("")
    }
  }

  const handleStartDateDayChange = (value: string) => {
    const day = value.replace(/\D/g, "").slice(0, 2)
    setStartDateDay(day)
    updateStartDate(day, startDateMonth, startDateYear)

    // Validate while typing
    let isValid = true
    if (day !== "") {
      const dayNum = Number.parseInt(day)
      if (dayNum > 31 || dayNum < 1) {
        setStartDateDayError("Incorrect day")
        isValid = false
      } else {
        setStartDateDayError("")
        isValid = true
      }
    } else {
      setStartDateDayError("")
    }

    // Auto-focus only if valid
    if (day.length === 2 && isValid) {
      startDateMonthRef.current?.focus()
    }
  }

  const handleStartDateMonthChange = (value: string) => {
    const month = value.replace(/\D/g, "").slice(0, 2)
    setStartDateMonth(month)
    updateStartDate(startDateDay, month, startDateYear)

    // Validate while typing
    let isValid = true
    if (month !== "") {
      const monthNum = Number.parseInt(month)
      if (monthNum > 12 || monthNum < 1) {
        setStartDateMonthError("Incorrect month")
        isValid = false
      } else {
        setStartDateMonthError("")
        isValid = true
      }
    } else {
      setStartDateMonthError("")
    }

    // Auto-focus only if valid
    if (month.length === 2 && isValid) {
      startDateYearRef.current?.focus()
    }
  }

  const handleStartDateYearChange = (value: string) => {
    const year = value.replace(/\D/g, "").slice(0, 4)
    setStartDateYear(year)
    updateStartDate(startDateDay, startDateMonth, year)
    // Auto-focus to End Date day field when start date year is complete
    if (year.length === 4) {
      endDateDayRef.current?.focus()
    }
  }

  const handleEndDateDayChange = (value: string) => {
    const day = value.replace(/\D/g, "").slice(0, 2)
    setEndDateDay(day)
    updateEndDate(day, endDateMonth, endDateYear)

    // Validate while typing
    let isValid = true
    if (day !== "") {
      const dayNum = Number.parseInt(day)
      if (dayNum > 31 || dayNum < 1) {
        setEndDateDayError("Incorrect day")
        isValid = false
      } else {
        setEndDateDayError("")
        isValid = true
      }
    } else {
      setEndDateDayError("")
    }

    // Auto-focus only if valid
    if (day.length === 2 && isValid) {
      endDateMonthRef.current?.focus()
    }
  }

  const handleEndDateMonthChange = (value: string) => {
    const month = value.replace(/\D/g, "").slice(0, 2)
    setEndDateMonth(month)
    updateEndDate(endDateDay, month, endDateYear)

    // Validate while typing
    let isValid = true
    if (month !== "") {
      const monthNum = Number.parseInt(month)
      if (monthNum > 12 || monthNum < 1) {
        setEndDateMonthError("Incorrect month")
        isValid = false
      } else {
        setEndDateMonthError("")
        isValid = true
      }
    } else {
      setEndDateMonthError("")
    }

    // Auto-focus only if valid
    if (month.length === 2 && isValid) {
      endDateYearRef.current?.focus()
    }
  }

  const handleEndDateYearChange = (value: string) => {
    const year = value.replace(/\D/g, "").slice(0, 4)
    setEndDateYear(year)
    updateEndDate(endDateDay, endDateMonth, year)
  }

  const handleStartDateDayBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (startDateDay === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const dayToFill = String(today.getDate()).padStart(2, "0")
      setStartDateDay(dayToFill)
      updateStartDate(dayToFill, startDateMonth, startDateYear)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleStartDateDayKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
  }

  const handleStartDateMonthBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (startDateMonth === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const monthToFill = String(today.getMonth() + 1).padStart(2, "0")
      setStartDateMonth(monthToFill)
      updateStartDate(startDateDay, monthToFill, startDateYear)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleStartDateMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
    if (e.key === "Backspace" && startDateMonth === "") {
      e.preventDefault()
      startDateDayRef.current?.focus()
    }
  }

  const handleStartDateYearBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (startDateYear === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const year = String(today.getFullYear()).padStart(4, "0")
      setStartDateYear(year)
      updateStartDate(startDateDay, startDateMonth, year)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleStartDateYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
    if (e.key === "Backspace" && startDateYear === "") {
      e.preventDefault()
      startDateMonthRef.current?.focus()
    }
  }

  const handleEndDateDayBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (endDateDay === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const dayToFill = String(today.getDate()).padStart(2, "0")
      setEndDateDay(dayToFill)
      updateEndDate(dayToFill, endDateMonth, endDateYear)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleEndDateDayKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
    if (e.key === "Backspace" && endDateDay === "") {
      e.preventDefault()
      startDateYearRef.current?.focus()
    }
  }

  const handleEndDateMonthBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (endDateMonth === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const monthToFill = String(today.getMonth() + 1).padStart(2, "0")
      setEndDateMonth(monthToFill)
      updateEndDate(endDateDay, monthToFill, endDateYear)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleEndDateMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
    if (e.key === "Backspace" && endDateMonth === "") {
      e.preventDefault()
      endDateDayRef.current?.focus()
    }
  }

  const handleEndDateYearBlur = () => {
    // Auto-fill if empty AND (Tab was pressed OR Shift+Tab was pressed)
    if (endDateYear === "" && (isTabKeyRef.current || isShiftTabRef.current)) {
      const today = new Date()
      const year = String(today.getFullYear()).padStart(4, "0")
      setEndDateYear(year)
      updateEndDate(endDateDay, endDateMonth, year)
    }
    isShiftTabRef.current = false
    isTabKeyRef.current = false
  }

  const handleEndDateYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey || e.ctrlKey) {
        isShiftTabRef.current = true
      } else {
        isTabKeyRef.current = true
      }
    }
    if (e.key === "Backspace" && endDateYear === "") {
      e.preventDefault()
      endDateMonthRef.current?.focus()
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

  const calculateDateDifference = (startDate: Date, endDate: Date, inclusive: boolean) => {
    const adjustedEndDate = new Date(endDate)
    if (inclusive) {
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
    }

    let years = adjustedEndDate.getFullYear() - startDate.getFullYear()
    let months = adjustedEndDate.getMonth() - startDate.getMonth()
    let days = adjustedEndDate.getDate() - startDate.getDate()

    // Adjust if days is negative
    if (days < 0) {
      months--
      const prevMonth = new Date(adjustedEndDate.getFullYear(), adjustedEndDate.getMonth(), 0)
      days += prevMonth.getDate()
    }

    // Adjust if months is negative
    if (months < 0) {
      years--
      months += 12
    }

    return { years, months, days }
  }

  // Calculate days between dates
  useEffect(() => {
    // Don't calculate if there are validation errors
    if (startDateDayError || startDateMonthError || endDateDayError || endDateMonthError) {
      setDayCount(null)
      setDateDifference(null)
      return
    }

    // Don't calculate if any date field is empty
    if (!startDateDay || !startDateMonth || !startDateYear || !endDateDay || !endDateMonth || !endDateYear) {
      setDayCount(null)
      setDateDifference(null)
      setExtraResults(null)
      return
    }

    if (startDate && endDate) {
      const start = parseDate(startDate)
      const end = parseDate(endDate)

      if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        const initialTotalCount = includeEndDate ? diffDays + 1 : diffDays
        
        // Calculate counts for each day of the week and final filtered count
        const dayCounts = {
          Sunday: 0,
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0
        }

        const current = new Date(start)
        const loopEnd = new Date(end)
        if (includeEndDate) {
          loopEnd.setDate(loopEnd.getDate() + 1)
        }

        let filteredTotalCount = 0
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        
        while (current < loopEnd) {
          const dayName = daysOfWeek[current.getDay()] as keyof typeof dayCounts
          const isSaturday = current.getDay() === 6
          const isSunday = current.getDay() === 0
          
          let shouldCount = true
          if (excludeOption === "saturday" && isSaturday) shouldCount = false
          if (excludeOption === "sunday" && isSunday) shouldCount = false
          if (excludeOption === "select" && (isSaturday || isSunday)) shouldCount = false

          if (shouldCount) {
            dayCounts[dayName]++
            filteredTotalCount++
          } else {
            // Show as negative to indicate skipped
            dayCounts[dayName]--
          }
          
          current.setDate(current.getDate() + 1)
        }

        setDayCount(filteredTotalCount)

        const difference = calculateDateDifference(start, end, includeEndDate)
        setDateDifference(difference)

        // Calculate extra results based on filtered count
        const totalWeeks = Math.floor(filteredTotalCount / 7)
        const remainingDaysAfterWeeks = filteredTotalCount % 7
        const totalMonths = (difference.years * 12) + difference.months
        const remainingDaysAfterMonths = difference.days
        
        // Calculate remaining days after full years
        const endForYears = new Date(start)
        endForYears.setFullYear(start.getFullYear() + difference.years)
        const diffTimeYears = Math.abs(end.getTime() - endForYears.getTime())
        const remainingDaysAfterYears = Math.floor(diffTimeYears / (1000 * 60 * 60 * 24)) + (includeEndDate ? 1 : 0)
        
        const totalHours = filteredTotalCount * 24
        const totalMinutes = totalHours * 60
        const totalSeconds = totalMinutes * 60

        setExtraResults({
          totalWeeks,
          remainingDaysAfterWeeks,
          totalMonths,
          remainingDaysAfterMonths,
          totalYears: difference.years,
          remainingDaysAfterYears: remainingDaysAfterYears,
          totalHours,
          totalMinutes,
          totalSeconds,
          dayCounts
        })
      }
    } else {
      setDayCount(null)
      setDateDifference(null)
      setExtraResults(null)
    }
  }, [startDate, endDate, startDateDay, startDateMonth, startDateYear, endDateDay, endDateMonth, endDateYear, includeEndDate, excludeOption, startDateDayError, startDateMonthError, endDateDayError, endDateMonthError])

  const handleClear = () => {
    setIsStartDateTodayChecked(false)
    setIsEndDateTodayChecked(false)
    setStartDate("")
    setStartDateDay("")
    setStartDateMonth("")
    setStartDateYear("")
    updateStartDate("", "", "")
    setEndDate("")
    setEndDateDay("")
    setEndDateMonth("")
    setEndDateYear("")
    updateEndDate("", "", "")
    
    setDayCount(null)
    setDateDifference(null)
    setExtraResults(null)
    setIncludeEndDate(true)
    setExcludeOption("all")
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
      {/* Left Sidebar - Day Counts */}
      {dayCount !== null && extraResults && (
        <div className="w-full lg:w-72 bg-[#33374b]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl self-stretch">
          <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-6 text-center opacity-80 border-b border-white/10 pb-3">DAYS DISTRIBUTION</p>
          <div className="flex flex-col gap-2">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <div key={day} className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex justify-between items-center px-6 transition-all hover:bg-[#71758c]/30 h-[60px]">
              <span className="text-sm font-semibold text-cyan-500">{day}</span>
              <span className="text-xl font-bold text-[#00e5ff]">{extraResults.dayCounts[day as keyof typeof extraResults.dayCounts]}</span>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-2xl space-y-6">
        <div className="bg-[#33374b]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-6">
          {/* Start Date Input - Separate fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-cyan-500 uppercase tracking-wider ml-1 opacity-90">Start Date</label>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                const newChecked = !isStartDateTodayChecked
                setIsStartDateTodayChecked(newChecked)

                if (newChecked) {
                  // Fill with today's date
                  const today = new Date()
                  const day = String(today.getDate()).padStart(2, "0")
                  const month = String(today.getMonth() + 1).padStart(2, "0")
                  const year = String(today.getFullYear())
                  setStartDateDay(day)
                  setStartDateMonth(month)
                  setStartDateYear(year)
                  updateStartDate(day, month, year)
                } else {
                  // Clear the dates
                  setStartDateDay("")
                  setStartDateMonth("")
                  setStartDateYear("")
                  updateStartDate("", "", "")
                }
              }}>
                <Checkbox checked={isStartDateTodayChecked} className="w-4 h-4 cursor-pointer border-[#00e5ff] data-[state=checked]:bg-black" />
                <span className="text-xs text-cyan-500 font-bold uppercase">Today</span>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 items-end flex-wrap sm:flex-nowrap">
              <div className="flex-1 min-w-24">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${startDateDayError ? "text-red-400" : "text-white/40"}`}>Day</label>
                  {startDateDayError && <span className="text-[10px] text-red-400 font-bold">{startDateDayError}</span>}
                </div>
                <input
                  ref={startDateDayRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="DD"
                  value={startDateDay}
                  onChange={(e) => handleStartDateDayChange(e.target.value)}
                  onKeyDown={handleStartDateDayKeyDown}
                  onBlur={handleStartDateDayBlur}
                  maxLength={2}
                  className={`w-full px-4 py-4 border text-white rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner ${startDateDayError ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#00e5ff]/50"}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${startDateMonthError ? "text-red-400" : "text-white/40"}`}>Month</label>
                  {startDateMonthError && <span className="text-[10px] text-red-400 font-bold">{startDateMonthError}</span>}
                </div>
                <input
                  ref={startDateMonthRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="MM"
                  value={startDateMonth}
                  onChange={(e) => handleStartDateMonthChange(e.target.value)}
                  onKeyDown={handleStartDateMonthKeyDown}
                  onBlur={handleStartDateMonthBlur}
                  maxLength={2}
                  className={`w-full px-4 py-4 border rounded-2xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner ${startDateMonthError ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#00e5ff]/50"}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 text-center">Year</label>
                <input
                  ref={startDateYearRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={startDateYear}
                  onChange={(e) => handleStartDateYearChange(e.target.value)}
                  onKeyDown={handleStartDateYearKeyDown}
                  onBlur={handleStartDateYearBlur}
                  maxLength={4}
                  className="w-full px-4 py-4 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* End Date Input - Separate fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-cyan-500 uppercase tracking-wider ml-1 opacity-90">End Date</label>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                const newChecked = !isEndDateTodayChecked
                setIsEndDateTodayChecked(newChecked)

                if (newChecked) {
                  // Fill with today's date
                  const today = new Date()
                  const day = String(today.getDate()).padStart(2, "0")
                  const month = String(today.getMonth() + 1).padStart(2, "0")
                  const year = String(today.getFullYear())
                  setEndDateDay(day)
                  setEndDateMonth(month)
                  setEndDateYear(year)
                  updateEndDate(day, month, year)
                } else {
                  // Clear the dates
                  setEndDateDay("")
                  setEndDateMonth("")
                  setEndDateYear("")
                  updateEndDate("", "", "")
                }
              }}>
                <Checkbox checked={isEndDateTodayChecked} className="w-4 h-4 cursor-pointer border-[#00e5ff] data-[state=checked]:bg-black" />
                <span className="text-xs text-[#00e5ff] font-bold uppercase">Today</span>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 items-end flex-wrap sm:flex-nowrap">
              <div className="flex-1 min-w-24">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${endDateDayError ? "text-red-400" : "text-white/40"}`}>Day</label>
                  {endDateDayError && <span className="text-[10px] text-red-400 font-bold">{endDateDayError}</span>}
                </div>
                <input
                  ref={endDateDayRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="DD"
                  value={endDateDay}
                  onChange={(e) => handleEndDateDayChange(e.target.value)}
                  onKeyDown={handleEndDateDayKeyDown}
                  onBlur={handleEndDateDayBlur}
                  maxLength={2}
                  className={`w-full px-4 py-4 border text-white rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner ${endDateDayError ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#00e5ff]/50"}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${endDateMonthError ? "text-red-400" : "text-white/40"}`}>Month</label>
                  {endDateMonthError && <span className="text-[10px] text-red-400 font-bold">{endDateMonthError}</span>}
                </div>
                <input
                  ref={endDateMonthRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="MM"
                  value={endDateMonth}
                  onChange={(e) => handleEndDateMonthChange(e.target.value)}
                  onKeyDown={handleEndDateMonthKeyDown}
                  onBlur={handleEndDateMonthBlur}
                  maxLength={2}
                  className={`w-full px-4 py-4 border rounded-2xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner ${endDateMonthError ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#00e5ff]/50"}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 text-center">Year</label>
                <input
                  ref={endDateYearRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={endDateYear}
                  onChange={(e) => handleEndDateYearChange(e.target.value)}
                  onKeyDown={handleEndDateYearKeyDown}
                  onBlur={handleEndDateYearBlur}
                  maxLength={4}
                  className="w-full px-4 py-4 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 focus:border-transparent transition text-center bg-[#71758c]/40 text-xl font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Checkbox and Exclude Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#71758c]/20 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-start gap-3 w-fit">
              <Checkbox
                id="include-end-date"
                checked={includeEndDate}
                onCheckedChange={(checked) => setIncludeEndDate(checked as boolean)}
                className="w-5 h-5 cursor-pointer border-yellow-500 data-[state=checked]:bg-black"
              />
              <label htmlFor="include-end-date" className="text-sm text-yellow-500 font-bold cursor-pointer select-none tracking-tight">
                {includeEndDate
                  ? "Counting: Start date to End date (inclusive)"
                  : "Counting: Start date to End date"}
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

          {dayCount !== null && dateDifference && (
            <div className="space-y-4 pt-2">
              <div className="bg-[#71758c]/20 text-[#00e5ff] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="grid grid-cols-3 gap-0">
                  <div className="border-r border-white/10 p-6">
                    <p className="text-xs font-black text-[#00e5ff] uppercase tracking-widest mb-3 text-center opacity-70">
                      YEARS
                    </p>
                    <p className="text-3xl font-black text-cyan-500 text-center tracking-tighter">{dateDifference.years}</p>
                  </div>
                  <div className="border-r border-white/10 p-6">
                    <p className="text-xs font-black text-[#00e5ff] uppercase tracking-widest mb-3 text-center opacity-70">
                      MONTHS
                    </p>
                    <p className="text-3xl font-black text-cyan-500 text-center tracking-tighter">{dateDifference.months}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-black text-[#00e5ff] uppercase tracking-widest mb-3 text-center opacity-70">DAYS</p>
                    <p className="text-3xl font-black text-cyan-500 text-center tracking-tighter">{dateDifference.days}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clear Button */}
          {(startDateDay || startDateMonth || startDateYear || endDateDay || endDateMonth || endDateYear || dayCount !== null) && (
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
      {dayCount !== null && extraResults && (
        <div className="w-full lg:w-80 bg-[#33374b]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl self-stretch space-y-4">
          <p className="text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-4 text-center opacity-80 border-b border-white/10 pb-3">DETAILED BREAKDOWN</p>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-[#00e5ff] transition-colors">TOTAL DAYS</p>
              <p className="text-2xl font-black text-cyan-500 text-center tracking-tighter">{dayCount}</p>
            </div>
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-fuchsia-400 transition-colors">TOTAL WEEKS</p>
              <p className="text-xl font-black text-cyan-500 text-center tracking-tighter">
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
              <p className="text-[10px] font-black text-[#00e5ff]/60 uppercase tracking-wider mb-2 text-center group-hover:text-[#00e5ff] transition-colors">TOTAL HOURS</p>
              <p className="text-lg font-black text-cyan-500 text-center tracking-tighter">{extraResults.totalHours.toLocaleString()}</p>
            </div>
            <div className="bg-[#71758c]/20 p-4 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-28 transition-all hover:bg-[#71758c]/30 group">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-wider mb-2 text-center group-hover:text-[#00e5ff] transition-colors">TOTAL MINUTES</p>
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
