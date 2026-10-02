"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, ArrowRight, RotateCcw, Sparkles, AlertCircle } from "lucide-react"

export default function TimeCount() {
  // Start Date
  const [startDateDay, setStartDateDay] = useState<string>("")
  const [startDateMonth, setStartDateMonth] = useState<string>("")
  const [startDateYear, setStartDateYear] = useState<string>("")

  // Start Time
  const [startHour, setStartHour] = useState<string>("")
  const [startMinute, setStartMinute] = useState<string>("")
  const [startSecond, setStartSecond] = useState<string>("00")
  const [startAmPm, setStartAmPm] = useState<"AM" | "PM">("AM")

  // End Date
  const [endDateDay, setEndDateDay] = useState<string>("")
  const [endDateMonth, setEndDateMonth] = useState<string>("")
  const [endDateYear, setEndDateYear] = useState<string>("")

  // End Time
  const [endHour, setEndHour] = useState<string>("")
  const [endMinute, setEndMinute] = useState<string>("")
  const [endSecond, setEndSecond] = useState<string>("00")
  const [endAmPm, setEndAmPm] = useState<"AM" | "PM">("PM")

  // Options
  const [isNextDay, setIsNextDay] = useState<boolean>(false)
  const [breakMinutes, setBreakMinutes] = useState<string>("")

  // Results
  const [result, setResult] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    decimalHours: string
    decimalDays: string
    totalMinutes: number
    totalSeconds: number
    percentOfDay: string
    isDateMode: boolean
    isNegative: boolean
    startDateFormatted?: string
    endDateFormatted?: string
  } | null>(null)

  // Refs for auto-focus navigation
  const startDateDayRef = useRef<HTMLInputElement>(null)
  const startDateMonthRef = useRef<HTMLInputElement>(null)
  const startDateYearRef = useRef<HTMLInputElement>(null)
  const startDatePickerRef = useRef<HTMLInputElement>(null)

  const startHourRef = useRef<HTMLInputElement>(null)
  const startMinuteRef = useRef<HTMLInputElement>(null)
  const startSecondRef = useRef<HTMLInputElement>(null)

  const endDateDayRef = useRef<HTMLInputElement>(null)
  const endDateMonthRef = useRef<HTMLInputElement>(null)
  const endDateYearRef = useRef<HTMLInputElement>(null)
  const endDatePickerRef = useRef<HTMLInputElement>(null)

  const endHourRef = useRef<HTMLInputElement>(null)
  const endMinuteRef = useRef<HTMLInputElement>(null)
  const endSecondRef = useRef<HTMLInputElement>(null)

  // Quick Action: Set Start Date to Today
  const handleSetStartToday = () => {
    const now = new Date()
    setStartDateDay(String(now.getDate()).padStart(2, "0"))
    setStartDateMonth(String(now.getMonth() + 1).padStart(2, "0"))
    setStartDateYear(String(now.getFullYear()))
  }

  // Quick Action: Set Start Date & Time to Now
  const handleSetStartNow = () => {
    const now = new Date()
    setStartDateDay(String(now.getDate()).padStart(2, "0"))
    setStartDateMonth(String(now.getMonth() + 1).padStart(2, "0"))
    setStartDateYear(String(now.getFullYear()))

    let h = now.getHours()
    const ampm = h >= 12 ? "PM" : "AM"
    h = h % 12 || 12
    setStartHour(String(h).padStart(2, "0"))
    setStartMinute(String(now.getMinutes()).padStart(2, "0"))
    setStartSecond(String(now.getSeconds()).padStart(2, "0"))
    setStartAmPm(ampm)
  }

  // Quick Action: Set End Date to Today
  const handleSetEndToday = () => {
    const now = new Date()
    setEndDateDay(String(now.getDate()).padStart(2, "0"))
    setEndDateMonth(String(now.getMonth() + 1).padStart(2, "0"))
    setEndDateYear(String(now.getFullYear()))
  }

  // Quick Action: Set End Date to Tomorrow (+1 Day)
  const handleSetEndTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setEndDateDay(String(tomorrow.getDate()).padStart(2, "0"))
    setEndDateMonth(String(tomorrow.getMonth() + 1).padStart(2, "0"))
    setEndDateYear(String(tomorrow.getFullYear()))
  }

  // Quick Action: Set End Date & Time to Now
  const handleSetEndNow = () => {
    const now = new Date()
    setEndDateDay(String(now.getDate()).padStart(2, "0"))
    setEndDateMonth(String(now.getMonth() + 1).padStart(2, "0"))
    setEndDateYear(String(now.getFullYear()))

    let h = now.getHours()
    const ampm = h >= 12 ? "PM" : "AM"
    h = h % 12 || 12
    setEndHour(String(h).padStart(2, "0"))
    setEndMinute(String(now.getMinutes()).padStart(2, "0"))
    setEndSecond(String(now.getSeconds()).padStart(2, "0"))
    setEndAmPm(ampm)
  }

  // Convert 12h time to seconds from midnight
  const toSeconds = (hour: string, minute: string, second: string, ampm: "AM" | "PM"): number | null => {
    const h = parseInt(hour, 10)
    const m = parseInt(minute, 10)
    const s = parseInt(second, 10) || 0

    if (isNaN(h) || isNaN(m)) return null
    if (h < 1 || h > 12 || m < 0 || m > 59 || s < 0 || s > 59) return null

    let h24 = h
    if (ampm === "AM" && h === 12) h24 = 0
    if (ampm === "PM" && h !== 12) h24 += 12

    return h24 * 3600 + m * 60 + s
  }

  // Auto calculate duration
  useEffect(() => {
    const startSec = toSeconds(startHour, startMinute, startSecond, startAmPm)
    const endSec = toSeconds(endHour, endMinute, endSecond, endAmPm)

    if (startSec === null || endSec === null) {
      setResult(null)
      return
    }

    const hasStartDate = Boolean(startDateDay && startDateMonth && startDateYear && startDateYear.length === 4)
    const hasEndDate = Boolean(endDateDay && endDateMonth && endDateYear && endDateYear.length === 4)

    const deduction = (parseInt(breakMinutes, 10) || 0) * 60

    if (hasStartDate && hasEndDate) {
      // Day-to-Day Date Mode
      const sDay = parseInt(startDateDay, 10)
      const sMonth = parseInt(startDateMonth, 10)
      const sYear = parseInt(startDateYear, 10)
      const eDay = parseInt(endDateDay, 10)
      const eMonth = parseInt(endDateMonth, 10)
      const eYear = parseInt(endDateYear, 10)

      if (
        isNaN(sDay) || isNaN(sMonth) || isNaN(sYear) ||
        isNaN(eDay) || isNaN(eMonth) || isNaN(eYear) ||
        sDay < 1 || sDay > 31 || sMonth < 1 || sMonth > 12 ||
        eDay < 1 || eDay > 31 || eMonth < 1 || eMonth > 12
      ) {
        setResult(null)
        return
      }

      let sH24 = parseInt(startHour, 10)
      if (startAmPm === "AM" && sH24 === 12) sH24 = 0
      if (startAmPm === "PM" && sH24 !== 12) sH24 += 12
      const sM = parseInt(startMinute, 10)
      const sS = parseInt(startSecond, 10) || 0

      let eH24 = parseInt(endHour, 10)
      if (endAmPm === "AM" && eH24 === 12) eH24 = 0
      if (endAmPm === "PM" && eH24 !== 12) eH24 += 12
      const eM = parseInt(endMinute, 10)
      const eS = parseInt(endSecond, 10) || 0

      const startDateTime = new Date(sYear, sMonth - 1, sDay, sH24, sM, sS)
      const endDateTime = new Date(eYear, eMonth - 1, eDay, eH24, eM, eS)

      const diffMs = endDateTime.getTime() - startDateTime.getTime()
      const isNegative = diffMs < 0
      const totalSecRaw = Math.floor(Math.abs(diffMs) / 1000)
      const finalSec = Math.max(0, totalSecRaw - deduction)

      const days = Math.floor(finalSec / 86400)
      const remainingSecAfterDays = finalSec % 86400
      const hours = Math.floor(remainingSecAfterDays / 3600)
      const remainingSecAfterHours = remainingSecAfterDays % 3600
      const minutes = Math.floor(remainingSecAfterHours / 60)
      const seconds = remainingSecAfterHours % 60

      const decimalHours = (finalSec / 3600).toFixed(2)
      const decimalDays = (finalSec / 86400).toFixed(2)
      const totalMinutes = Math.floor(finalSec / 60)

      setResult({
        days,
        hours,
        minutes,
        seconds,
        decimalHours,
        decimalDays,
        totalMinutes,
        totalSeconds: finalSec,
        percentOfDay: ((finalSec / 86400) * 100).toFixed(1),
        isDateMode: true,
        isNegative,
        startDateFormatted: `${String(sDay).padStart(2, "0")}/${String(sMonth).padStart(2, "0")}/${sYear}`,
        endDateFormatted: `${String(eDay).padStart(2, "0")}/${String(eMonth).padStart(2, "0")}/${eYear}`,
      })
    } else {
      // Time-only Mode (same-day or +24h if overnight)
      let diffSec = endSec - startSec

      if (isNextDay || diffSec < 0) {
        if (diffSec < 0) {
          diffSec += 24 * 3600
        } else if (isNextDay) {
          diffSec += 24 * 3600
        }
      }

      const finalSec = Math.max(0, diffSec - deduction)
      const days = isNextDay ? 1 : 0
      const hours = Math.floor(finalSec / 3600)
      const remainingSecAfterH = finalSec % 3600
      const minutes = Math.floor(remainingSecAfterH / 60)
      const seconds = remainingSecAfterH % 60

      const decimalHours = (finalSec / 3600).toFixed(2)
      const decimalDays = (finalSec / 86400).toFixed(2)
      const totalMinutes = Math.floor(finalSec / 60)
      const percentOfDay = ((finalSec / 86400) * 100).toFixed(1)

      setResult({
        days,
        hours,
        minutes,
        seconds,
        decimalHours,
        decimalDays,
        totalMinutes,
        totalSeconds: finalSec,
        percentOfDay,
        isDateMode: false,
        isNegative: false,
      })
    }
  }, [
    startDateDay, startDateMonth, startDateYear,
    startHour, startMinute, startSecond, startAmPm,
    endDateDay, endDateMonth, endDateYear,
    endHour, endMinute, endSecond, endAmPm,
    isNextDay, breakMinutes
  ])

  const handleClear = () => {
    setStartDateDay("")
    setStartDateMonth("")
    setStartDateYear("")
    setStartHour("")
    setStartMinute("")
    setStartSecond("00")
    setStartAmPm("AM")

    setEndDateDay("")
    setEndDateMonth("")
    setEndDateYear("")
    setEndHour("")
    setEndMinute("")
    setEndSecond("00")
    setEndAmPm("PM")

    setIsNextDay(false)
    setBreakMinutes("")
    setResult(null)
  }

  // Handle native date picker selection
  const handleStartDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split("-")
      setStartDateYear(y)
      setStartDateMonth(m)
      setStartDateDay(d)
    }
  }

  const handleEndDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split("-")
      setEndDateYear(y)
      setEndDateMonth(m)
      setEndDateDay(d)
    }
  }

  const hasDateModeActive = Boolean(
    startDateDay && startDateMonth && startDateYear &&
    endDateDay && endDateMonth && endDateYear
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full">
      {/* Main Input Card */}
      <div className="flex-1 w-full max-w-2xl space-y-6">
        <div className="bg-[#33374b]/60 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Time Count</h2>
                <p className="text-xs text-white/50">Calculate elapsed duration & day-to-day time difference</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleClear}
                className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold px-3.5 h-8.5 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 cursor-pointer text-[10px] tracking-wider uppercase active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </Button>
            </div>
          </div>

          {/* ================= START DATE & TIME SECTION ================= */}
          <div className="space-y-3 bg-[#71758c]/10 p-4 sm:p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Start Date & Time</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSetStartToday}
                  className="text-[11px] font-bold text-cyan-400/90 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <span className="text-white/20 text-xs">•</span>
                <button
                  type="button"
                  onClick={handleSetStartNow}
                  className="text-[11px] font-bold text-cyan-400/90 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Set to Now
                </button>
              </div>
            </div>

            {/* Start Date Inputs */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                Start Date (DD/MM/YYYY)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 items-center">
                <div>
                  <input
                    ref={startDateDayRef}
                    type="text"
                    placeholder="DD"
                    maxLength={2}
                    value={startDateDay}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setStartDateDay(val)
                      if (val.length === 2) startDateMonthRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" && startDateDay.length === 2) startDateMonthRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Day</span>
                </div>
                <div>
                  <input
                    ref={startDateMonthRef}
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                    value={startDateMonth}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setStartDateMonth(val)
                      if (val.length === 2) startDateYearRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && startDateMonth === "") startDateDayRef.current?.focus()
                      if (e.key === "ArrowLeft") startDateDayRef.current?.focus()
                      if (e.key === "ArrowRight" && startDateMonth.length === 2) startDateYearRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Month</span>
                </div>
                <div>
                  <input
                    ref={startDateYearRef}
                    type="text"
                    placeholder="YYYY"
                    maxLength={4}
                    value={startDateYear}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                      setStartDateYear(val)
                      if (val.length === 4) startHourRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && startDateYear === "") startDateMonthRef.current?.focus()
                      if (e.key === "ArrowLeft") startDateMonthRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Year</span>
                </div>
                <div className="col-span-3 sm:col-span-1 flex items-center justify-center">
                  <div className="relative w-full">
                    <input
                      ref={startDatePickerRef}
                      type="date"
                      onChange={handleStartDatePickerChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-10 z-10"
                    />
                    <button
                      type="button"
                      className="w-full bg-[#71758c]/20 hover:bg-[#71758c]/35 border border-white/10 text-cyan-400 rounded-xl h-10 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Pick</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Time Inputs */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                Start Time (HH:MM:SS)
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <input
                    ref={startHourRef}
                    type="text"
                    placeholder="HH (01-12)"
                    maxLength={2}
                    value={startHour}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setStartHour(val)
                      if (val.length === 2) startMinuteRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && startHour === "") startDateYearRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Hour</span>
                </div>
                <div>
                  <input
                    ref={startMinuteRef}
                    type="text"
                    placeholder="MM (00-59)"
                    maxLength={2}
                    value={startMinute}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setStartMinute(val)
                      if (val.length === 2) startSecondRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && startMinute === "") startHourRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Minute</span>
                </div>
                <div>
                  <input
                    ref={startSecondRef}
                    type="text"
                    placeholder="SS"
                    maxLength={2}
                    value={startSecond}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setStartSecond(val)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && startSecond === "") startMinuteRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Second</span>
                </div>
                <div>
                  <div className="flex bg-[#71758c]/20 p-1 rounded-xl border border-white/10 h-11 items-center">
                    <button
                      type="button"
                      onClick={() => setStartAmPm("AM")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        startAmPm === "AM" ? "bg-[#00e5ff] text-black shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setStartAmPm("PM")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        startAmPm === "PM" ? "bg-[#00e5ff] text-black shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      PM
                    </button>
                  </div>
                  <span className="block text-[10px] text-white/40 text-center mt-1">AM/PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= END DATE & TIME SECTION ================= */}
          <div className="space-y-3 bg-[#71758c]/10 p-4 sm:p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">End Date & Time</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSetEndToday}
                  className="text-[11px] font-bold text-cyan-400/90 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <span className="text-white/20 text-xs">•</span>
                <button
                  type="button"
                  onClick={handleSetEndTomorrow}
                  className="text-[11px] font-bold text-cyan-400/90 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  +1 Day
                </button>
                <span className="text-white/20 text-xs">•</span>
                <button
                  type="button"
                  onClick={handleSetEndNow}
                  className="text-[11px] font-bold text-cyan-400/90 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Set to Now
                </button>
              </div>
            </div>

            {/* End Date Inputs */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                End Date (DD/MM/YYYY)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 items-center">
                <div>
                  <input
                    ref={endDateDayRef}
                    type="text"
                    placeholder="DD"
                    maxLength={2}
                    value={endDateDay}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setEndDateDay(val)
                      if (val.length === 2) endDateMonthRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" && endDateDay.length === 2) endDateMonthRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Day</span>
                </div>
                <div>
                  <input
                    ref={endDateMonthRef}
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                    value={endDateMonth}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setEndDateMonth(val)
                      if (val.length === 2) endDateYearRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && endDateMonth === "") endDateDayRef.current?.focus()
                      if (e.key === "ArrowLeft") endDateDayRef.current?.focus()
                      if (e.key === "ArrowRight" && endDateMonth.length === 2) endDateYearRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Month</span>
                </div>
                <div>
                  <input
                    ref={endDateYearRef}
                    type="text"
                    placeholder="YYYY"
                    maxLength={4}
                    value={endDateYear}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                      setEndDateYear(val)
                      if (val.length === 4) endHourRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && endDateYear === "") endDateMonthRef.current?.focus()
                      if (e.key === "ArrowLeft") endDateMonthRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Year</span>
                </div>
                <div className="col-span-3 sm:col-span-1 flex items-center justify-center">
                  <div className="relative w-full">
                    <input
                      ref={endDatePickerRef}
                      type="date"
                      onChange={handleEndDatePickerChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-10 z-10"
                    />
                    <button
                      type="button"
                      className="w-full bg-[#71758c]/20 hover:bg-[#71758c]/35 border border-white/10 text-cyan-400 rounded-xl h-10 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Pick</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* End Time Inputs */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                End Time (HH:MM:SS)
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <input
                    ref={endHourRef}
                    type="text"
                    placeholder="HH (01-12)"
                    maxLength={2}
                    value={endHour}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setEndHour(val)
                      if (val.length === 2) endMinuteRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && endHour === "") endDateYearRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Hour</span>
                </div>
                <div>
                  <input
                    ref={endMinuteRef}
                    type="text"
                    placeholder="MM (00-59)"
                    maxLength={2}
                    value={endMinute}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setEndMinute(val)
                      if (val.length === 2) endSecondRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && endMinute === "") endHourRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Minute</span>
                </div>
                <div>
                  <input
                    ref={endSecondRef}
                    type="text"
                    placeholder="SS"
                    maxLength={2}
                    value={endSecond}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setEndSecond(val)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && endSecond === "") endMinuteRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Second</span>
                </div>
                <div>
                  <div className="flex bg-[#71758c]/20 p-1 rounded-xl border border-white/10 h-11 items-center">
                    <button
                      type="button"
                      onClick={() => setEndAmPm("AM")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        endAmPm === "AM" ? "bg-[#00e5ff] text-black shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setEndAmPm("PM")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        endAmPm === "PM" ? "bg-[#00e5ff] text-black shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      PM
                    </button>
                  </div>
                  <span className="block text-[10px] text-white/40 text-center mt-1">AM/PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Options: Next Day & Break Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <label className={`flex items-center gap-3 bg-[#71758c]/15 p-3 rounded-xl border border-white/10 cursor-pointer hover:bg-[#71758c]/25 transition-all ${
              hasDateModeActive ? "opacity-50 pointer-events-none" : ""
            }`}>
              <input
                type="checkbox"
                disabled={hasDateModeActive}
                checked={isNextDay}
                onChange={(e) => setIsNextDay(e.target.checked)}
                className="h-4 w-4 rounded accent-[#00e5ff] cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-white block">Next Day (+24 Hours)</span>
                <span className="text-[10px] text-white/50 block">
                  {hasDateModeActive ? "Auto-handled by selected dates" : "Check if end time is on next day"}
                </span>
              </div>
            </label>

            <div className="bg-[#71758c]/15 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-white block">Deduct Break</span>
                <span className="text-[10px] text-white/50 block">Subtract break duration</span>
              </div>
              <div className="flex items-center gap-1.5 w-24">
                <input
                  type="text"
                  placeholder="0"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-[#71758c]/30 border border-white/10 text-white rounded-lg h-8 px-2 text-center text-xs font-semibold focus:outline-none focus:border-[#00e5ff]"
                />
                <span className="text-[10px] text-white/60">min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="w-full lg:w-80 bg-[#33374b]/60 backdrop-blur-xl p-6 sm:p-7 rounded-[2rem] border border-white/10 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="border-b border-white/10 pb-3 text-center">
            <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Duration Result
            </p>
          </div>

          {/* Negative Warning if applicable */}
          {result.isNegative && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>End date/time is earlier than start date/time. Elapsed absolute duration shown.</span>
            </div>
          )}

          {/* Primary Highlight */}
          <div className="bg-gradient-to-br from-[#71758c]/30 to-[#1e2235]/60 p-5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1">
              Total Duration
            </span>
            <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-cyan-400 drop-shadow-sm">
              {result.days > 0 ? `${result.days}d ` : ""}
              {result.hours}h {result.minutes}m {result.seconds}s
            </div>
            <div className="text-xs font-semibold text-cyan-400 mt-2">
              {result.days > 0
                ? `${result.days} ${result.days === 1 ? "Day" : "Days"}, ${result.hours} Hours, ${result.minutes} Mins`
                : `≈ ${result.decimalHours} hours`}
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="space-y-2">
            {result.isDateMode && (
              <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                <span className="text-white/70">Total Days</span>
                <span className="font-bold text-[#00e5ff]">{result.decimalDays} days</span>
              </div>
            )}
            <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/70">Total Hours</span>
              <span className="font-bold text-[#00e5ff]">{result.decimalHours} hrs</span>
            </div>
            <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/70">Total Minutes</span>
              <span className="font-bold text-[#00e5ff]">{result.totalMinutes.toLocaleString()} mins</span>
            </div>
            <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/70">Total Seconds</span>
              <span className="font-bold text-[#00e5ff]">{result.totalSeconds.toLocaleString()} secs</span>
            </div>
            {!result.isDateMode && (
              <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                <span className="text-white/70">Day Percentage</span>
                <span className="font-bold text-fuchsia-400">{result.percentOfDay}% of 24h</span>
              </div>
            )}
          </div>

          {/* Time Span Summary */}
          <div className="pt-2 border-t border-white/10 space-y-1 text-center">
            <span className="text-[10px] text-white/40 uppercase font-semibold tracking-wider block">Time Span</span>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/80 flex-wrap">
              <span className="font-medium">
                {result.startDateFormatted ? `${result.startDateFormatted} ` : ""}
                {startHour || "00"}:{startMinute || "00"} {startAmPm}
              </span>
              <ArrowRight className="h-3 w-3 text-cyan-400 shrink-0" />
              <span className="font-medium">
                {result.endDateFormatted ? `${result.endDateFormatted} ` : ""}
                {endHour || "00"}:{endMinute || "00"} {endAmPm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
