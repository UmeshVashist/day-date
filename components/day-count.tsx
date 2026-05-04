"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

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

        const finalCount = includeEndDate ? diffDays + 1 : diffDays
        setDayCount(finalCount)

        const difference = calculateDateDifference(start, end, includeEndDate)
        setDateDifference(difference)

        // Calculate extra results
        const totalWeeks = Math.floor(finalCount / 7)
        const remainingDaysAfterWeeks = finalCount % 7
        const totalMonths = (difference.years * 12) + difference.months
        const remainingDaysAfterMonths = difference.days
        
        // Calculate remaining days after full years
        const startForYears = new Date(start)
        const endForYears = new Date(start)
        endForYears.setFullYear(start.getFullYear() + difference.years)
        const diffTimeYears = Math.abs(end.getTime() - endForYears.getTime())
        const remainingDaysAfterYears = Math.floor(diffTimeYears / (1000 * 60 * 60 * 24)) + (includeEndDate ? 1 : 0)
        
        const totalHours = finalCount * 24
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
          totalSeconds
        })
      }
    } else {
      setDayCount(null)
      setDateDifference(null)
      setExtraResults(null)
    }
  }, [startDate, endDate, startDateDay, startDateMonth, startDateYear, endDateDay, endDateMonth, endDateYear, includeEndDate, startDateDayError, startDateMonthError, endDateDayError, endDateMonthError])

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
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="space-y-4">
          {/* Start Date Input - Separate fields */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-white">Start Date</label>
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
                <Checkbox checked={isStartDateTodayChecked} className="w-4 h-4 cursor-pointer border-cyan-500" />
                <span className="text-xs text-cyan-500 font-medium">Today</span>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 items-end flex-wrap sm:flex-nowrap">
              <div className="flex-1 min-w-24">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <label className={`text-xs ${startDateDayError ? "text-red-500" : "text-white"}`}>Day</label>
                  {startDateDayError && <span className="text-xs text-red-500">{startDateDayError}</span>}
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
                  maxLength="2"
                  className={`w-full px-3 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition text-center ${startDateDayError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-xs ${startDateMonthError ? "text-red-500" : "text-white"}`}>Month</label>
                  {startDateMonthError && <span className="text-xs text-red-500">{startDateMonthError}</span>}
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
                  maxLength="2"
                  className={`w-full px-3 py-3 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center ${startDateMonthError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white mb-1 text-center">Year</label>
                <input
                  ref={startDateYearRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={startDateYear}
                  onChange={(e) => handleStartDateYearChange(e.target.value)}
                  onKeyDown={handleStartDateYearKeyDown}
                  onBlur={handleStartDateYearBlur}
                  maxLength="4"
                  className="w-full px-3 py-3 border border-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center"
                />
              </div>
            </div>
          </div>

          {/* End Date Input - Separate fields */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-white">End Date</label>
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
                <Checkbox checked={isEndDateTodayChecked} className="w-4 h-4 cursor-pointer border-cyan-500" />
                <span className="text-xs text-cyan-500 font-medium">Today</span>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-xs ${endDateDayError ? "text-red-500" : "text-white"}`}>Day</label>
                  {endDateDayError && <span className="text-xs text-red-500">{endDateDayError}</span>}
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
                  maxLength="2"
                  className={`w-full px-3 py-3 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center ${endDateDayError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <label className={`text-xs ${endDateMonthError ? "text-red-500" : "text-white"}`}>Month</label>
                  {endDateMonthError && <span className="text-xs text-red-500">{endDateMonthError}</span>}
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
                  maxLength="2"
                  className={`w-full px-3 py-3 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent transition text-center ${endDateMonthError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white mb-1 text-center">Year</label>
                <input
                  ref={endDateYearRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={endDateYear}
                  onChange={(e) => handleEndDateYearChange(e.target.value)}
                  onKeyDown={handleEndDateYearKeyDown}
                  onBlur={handleEndDateYearBlur}
                  maxLength="4"
                  className="w-full px-3 py-3 border border-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center"
                />
              </div>
            </div>
          </div>

          {/* Checkbox for include end date */}
          <div className="flex items-center justify-start gap-2 w-fit">
            <Checkbox
              id="include-end-date"
              checked={includeEndDate}
              onCheckedChange={(checked) => setIncludeEndDate(checked as boolean)}
              className="w-4 h-4 cursor-pointer border-yellow-500"
            />
            <label htmlFor="include-end-date" className="text-xs text-yellow-500 font-medium cursor-pointer select-none">
              {includeEndDate
                ? "Counting: Start date to End date (inclusive)"
                : "Counting: Start date to End date"}
            </label>
          </div>

          {dayCount !== null && dateDifference && (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-500 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-0">
                  <div className="border-r border-slate-700 p-4">
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                      Years
                    </p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{dateDifference.years}</p>
                  </div>
                  <div className="border-r border-slate-700 p-4">
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                      Months
                    </p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{dateDifference.months}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">Days</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{dateDifference.days}</p>
                  </div>
                </div>
              </div>
              {/* <p className="text-xs text-gray-500 text-center">Time difference between dates</p> */}

              {extraResults && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 text-center">Total Days</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{dayCount}</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 text-center">Total Weeks</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">
                      {extraResults.totalWeeks} <span className="text-xs font-normal text-cyan-400/70">w</span> {extraResults.remainingDaysAfterWeeks} <span className="text-xs font-normal text-cyan-400/70">d</span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 text-center">Total Months</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">
                      {extraResults.totalMonths} <span className="text-xs font-normal text-cyan-400/70">m</span> {extraResults.remainingDaysAfterMonths} <span className="text-xs font-normal text-cyan-400/70">d</span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 text-center">Total Years</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">
                      {extraResults.totalYears} <span className="text-xs font-normal text-cyan-400/70">y</span> {extraResults.remainingDaysAfterYears} <span className="text-xs font-normal text-cyan-400/70">d</span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 text-center">Total Hours</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{extraResults.totalHours.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 text-center">Total Minutes</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{extraResults.totalMinutes.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 text-center">Total Seconds</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{extraResults.totalSeconds.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Clear Button */}
          {(startDateDay || startDateMonth || startDateYear || endDateDay || endDateMonth || endDateYear || dayCount !== null) && (
            <Button
              onClick={handleClear}
              className="w-full backdrop-blur-md bg-red-500/30 hover:bg-red-500/50 text-white font-semibold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-red-600 border border-red-500/60 hover:border-red-400 cursor-pointer shadow-md"
            >
              Clear Fields
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
