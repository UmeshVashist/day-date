"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Plus, Minus, RotateCcw, Sparkles, ArrowRight } from "lucide-react"

export default function TimeFiend() {
  // Base Date
  const [baseDateDay, setBaseDateDay] = useState<string>("")
  const [baseDateMonth, setBaseDateMonth] = useState<string>("")
  const [baseDateYear, setBaseDateYear] = useState<string>("")

  // Base Time
  const [baseHour, setBaseHour] = useState<string>("")
  const [baseMinute, setBaseMinute] = useState<string>("")
  const [baseSecond, setBaseSecond] = useState<string>("00")
  const [baseAmPm, setBaseAmPm] = useState<"AM" | "PM">("AM")

  // Operation Mode
  const [isAddMode, setIsAddMode] = useState<boolean>(true)

  // Values to Add/Subtract
  const [daysToAdd, setDaysToAdd] = useState<string>("")
  const [hoursToAdd, setHoursToAdd] = useState<string>("")
  const [minutesToAdd, setMinutesToAdd] = useState<string>("")
  const [secondsToAdd, setSecondsToAdd] = useState<string>("")

  // Result
  const [result, setResult] = useState<{
    formattedTime12: string
    formattedTime24: string
    resultDateFormatted?: string
    resultFullDate?: string
    resultWeekday?: string
    hasDate: boolean
    dayShiftText: string
    dayShiftCount: number
    totalAddedSeconds: number
    decimalHoursAdded: string
    baseDisplay: string
  } | null>(null)

  // Refs for auto-focus navigation
  const baseDateDayRef = useRef<HTMLInputElement>(null)
  const baseDateMonthRef = useRef<HTMLInputElement>(null)
  const baseDateYearRef = useRef<HTMLInputElement>(null)
  const baseDatePickerRef = useRef<HTMLInputElement>(null)

  const baseHourRef = useRef<HTMLInputElement>(null)
  const baseMinuteRef = useRef<HTMLInputElement>(null)
  const baseSecondRef = useRef<HTMLInputElement>(null)

  const daysToAddRef = useRef<HTMLInputElement>(null)
  const hoursToAddRef = useRef<HTMLInputElement>(null)
  const minutesToAddRef = useRef<HTMLInputElement>(null)
  const secondsToAddRef = useRef<HTMLInputElement>(null)

  // Quick Action: Set Base Date to Today
  const handleSetBaseToday = () => {
    const now = new Date()
    setBaseDateDay(String(now.getDate()).padStart(2, "0"))
    setBaseDateMonth(String(now.getMonth() + 1).padStart(2, "0"))
    setBaseDateYear(String(now.getFullYear()))
  }

  // Quick Action: Set Base Date & Time to Current Moment
  const handleSetBaseNow = () => {
    const now = new Date()
    setBaseDateDay(String(now.getDate()).padStart(2, "0"))
    setBaseDateMonth(String(now.getMonth() + 1).padStart(2, "0"))
    setBaseDateYear(String(now.getFullYear()))

    let h = now.getHours()
    const ampm = h >= 12 ? "PM" : "AM"
    h = h % 12 || 12
    setBaseHour(String(h).padStart(2, "0"))
    setBaseMinute(String(now.getMinutes()).padStart(2, "0"))
    setBaseSecond(String(now.getSeconds()).padStart(2, "0"))
    setBaseAmPm(ampm)
  }

  // Handle native date picker selection
  const handleBaseDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split("-")
      setBaseDateYear(y)
      setBaseDateMonth(m)
      setBaseDateDay(d)
    }
  }

  // Calculate Result
  useEffect(() => {
    const bh = parseInt(baseHour, 10)
    const bm = parseInt(baseMinute, 10)
    const bs = parseInt(baseSecond, 10) || 0

    if (isNaN(bh) || isNaN(bm)) {
      setResult(null)
      return
    }

    if (bh < 1 || bh > 12 || bm < 0 || bm > 59 || bs < 0 || bs > 59) {
      setResult(null)
      return
    }

    // Convert Base Time to 24-hr seconds
    let bh24 = bh
    if (baseAmPm === "AM" && bh === 12) bh24 = 0
    if (baseAmPm === "PM" && bh !== 12) bh24 += 12

    const addD = parseInt(daysToAdd, 10) || 0
    const addH = parseInt(hoursToAdd, 10) || 0
    const addM = parseInt(minutesToAdd, 10) || 0
    const addS = parseInt(secondsToAdd, 10) || 0

    const shiftSeconds = addD * 86400 + addH * 3600 + addM * 60 + addS

    if (shiftSeconds === 0 && !daysToAdd && !hoursToAdd && !minutesToAdd && !secondsToAdd) {
      setResult(null)
      return
    }

    const hasBaseDate = Boolean(baseDateDay && baseDateMonth && baseDateYear && baseDateYear.length === 4)

    if (hasBaseDate) {
      // BASE DATE + TIME MODE: accurately calculate resulting date and AM/PM time
      const bDay = parseInt(baseDateDay, 10)
      const bMonth = parseInt(baseDateMonth, 10)
      const bYear = parseInt(baseDateYear, 10)

      if (
        isNaN(bDay) || isNaN(bMonth) || isNaN(bYear) ||
        bDay < 1 || bDay > 31 || bMonth < 1 || bMonth > 12
      ) {
        setResult(null)
        return
      }

      const baseDateObj = new Date(bYear, bMonth - 1, bDay, bh24, bm, bs)
      const targetTimestamp = isAddMode
        ? baseDateObj.getTime() + shiftSeconds * 1000
        : baseDateObj.getTime() - shiftSeconds * 1000

      const targetDate = new Date(targetTimestamp)

      const resDay = String(targetDate.getDate()).padStart(2, "0")
      const resMonth = String(targetDate.getMonth() + 1).padStart(2, "0")
      const resYear = targetDate.getFullYear()
      const resultDateFormatted = `${resDay}/${resMonth}/${resYear}`

      const weekdayName = targetDate.toLocaleDateString("en-US", { weekday: "long" })
      const monthShort = targetDate.toLocaleDateString("en-US", { month: "short" })
      const resultFullDate = `${weekdayName}, ${resDay} ${monthShort} ${resYear}`

      let resH24 = targetDate.getHours()
      let resM = targetDate.getMinutes()
      let resS = targetDate.getSeconds()

      let resH12 = resH24 % 12 || 12
      const resAmPm = resH24 >= 12 ? "PM" : "AM"

      const formattedTime12 = `${String(resH12).padStart(2, "0")}:${String(resM).padStart(2, "0")}:${String(resS).padStart(2, "0")} ${resAmPm}`
      const formattedTime24 = `${String(resH24).padStart(2, "0")}:${String(resM).padStart(2, "0")}:${String(resS).padStart(2, "0")}`

      // Calendar days difference
      const baseMidnight = new Date(bYear, bMonth - 1, bDay).getTime()
      const targetMidnight = new Date(resYear, targetDate.getMonth(), targetDate.getDate()).getTime()
      const dayShiftCount = Math.round((targetMidnight - baseMidnight) / (86400 * 1000))

      let dayShiftText = "Same Day"
      if (dayShiftCount > 0) {
        dayShiftText = dayShiftCount === 1 ? "+1 Day (Tomorrow)" : `+${dayShiftCount} Days Later`
      } else if (dayShiftCount < 0) {
        dayShiftText = dayShiftCount === -1 ? "-1 Day (Yesterday)" : `${dayShiftCount} Days Earlier`
      }

      const baseDisplay = `${String(bDay).padStart(2, "0")}/${String(bMonth).padStart(2, "0")}/${bYear}, ${baseHour.padStart(2, "0")}:${baseMinute.padStart(2, "0")} ${baseAmPm}`

      setResult({
        formattedTime12,
        formattedTime24,
        resultDateFormatted,
        resultFullDate,
        resultWeekday: weekdayName,
        hasDate: true,
        dayShiftText,
        dayShiftCount,
        totalAddedSeconds: shiftSeconds,
        decimalHoursAdded: (shiftSeconds / 3600).toFixed(2),
        baseDisplay,
      })
    } else {
      // TIME-ONLY MODE
      const baseTotalSeconds = bh24 * 3600 + bm * 60 + bs
      const netSeconds = isAddMode ? baseTotalSeconds + shiftSeconds : baseTotalSeconds - shiftSeconds

      const secondsInDay = 86400
      let dayShiftCount = Math.floor(netSeconds / secondsInDay)
      let finalSecondsInDay = netSeconds % secondsInDay

      if (finalSecondsInDay < 0) {
        finalSecondsInDay += secondsInDay
      }

      const resH24 = Math.floor(finalSecondsInDay / 3600)
      const resM = Math.floor((finalSecondsInDay % 3600) / 60)
      const resS = finalSecondsInDay % 60

      let resH12 = resH24 % 12 || 12
      const resAmPm = resH24 >= 12 ? "PM" : "AM"

      const formattedTime12 = `${String(resH12).padStart(2, "0")}:${String(resM).padStart(2, "0")}:${String(resS).padStart(2, "0")} ${resAmPm}`
      const formattedTime24 = `${String(resH24).padStart(2, "0")}:${String(resM).padStart(2, "0")}:${String(resS).padStart(2, "0")}`

      let dayShiftText = "Same Day"
      if (dayShiftCount > 0) {
        dayShiftText = dayShiftCount === 1 ? "+1 Day (Tomorrow)" : `+${dayShiftCount} Days Later`
      } else if (dayShiftCount < 0) {
        dayShiftText = dayShiftCount === -1 ? "-1 Day (Yesterday)" : `${dayShiftCount} Days Earlier`
      }

      const baseDisplay = `${baseHour.padStart(2, "0")}:${baseMinute.padStart(2, "0")} ${baseAmPm}`

      setResult({
        formattedTime12,
        formattedTime24,
        hasDate: false,
        dayShiftText,
        dayShiftCount,
        totalAddedSeconds: shiftSeconds,
        decimalHoursAdded: (shiftSeconds / 3600).toFixed(2),
        baseDisplay,
      })
    }
  }, [
    baseDateDay, baseDateMonth, baseDateYear,
    baseHour, baseMinute, baseSecond, baseAmPm,
    isAddMode, daysToAdd, hoursToAdd, minutesToAdd, secondsToAdd
  ])

  const handleClear = () => {
    setBaseDateDay("")
    setBaseDateMonth("")
    setBaseDateYear("")
    setBaseHour("")
    setBaseMinute("")
    setBaseSecond("00")
    setBaseAmPm("AM")

    setDaysToAdd("")
    setHoursToAdd("")
    setMinutesToAdd("")
    setSecondsToAdd("")
    setIsAddMode(true)
    setResult(null)
  }

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
                <h2 className="text-lg font-bold text-white tracking-wide">Time Fiend</h2>
                <p className="text-xs text-white/50">Add or subtract time from base date & time to calculate the exact resulting date & AM/PM time</p>
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

          {/* ================= BASE DATE & TIME SECTION ================= */}
          <div className="space-y-3 bg-[#71758c]/10 p-4 sm:p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Base Date & Time</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSetBaseToday}
                  className="text-[11px] font-bold text-cyan-400/90 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <span className="text-white/20 text-xs">•</span>
                <button
                  type="button"
                  onClick={handleSetBaseNow}
                  className="text-[11px] font-bold text-cyan-400/90 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Set to Now
                </button>
              </div>
            </div>

            {/* Base Date Inputs */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                Base Date (DD/MM/YYYY)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 items-center">
                <div>
                  <input
                    ref={baseDateDayRef}
                    type="text"
                    placeholder="DD"
                    maxLength={2}
                    value={baseDateDay}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setBaseDateDay(val)
                      if (val.length === 2) baseDateMonthRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" && baseDateDay.length === 2) baseDateMonthRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Day</span>
                </div>
                <div>
                  <input
                    ref={baseDateMonthRef}
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                    value={baseDateMonth}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setBaseDateMonth(val)
                      if (val.length === 2) baseDateYearRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && baseDateMonth === "") baseDateDayRef.current?.focus()
                      if (e.key === "ArrowLeft") baseDateDayRef.current?.focus()
                      if (e.key === "ArrowRight" && baseDateMonth.length === 2) baseDateYearRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Month</span>
                </div>
                <div>
                  <input
                    ref={baseDateYearRef}
                    type="text"
                    placeholder="YYYY"
                    maxLength={4}
                    value={baseDateYear}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                      setBaseDateYear(val)
                      if (val.length === 4) baseHourRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && baseDateYear === "") baseDateMonthRef.current?.focus()
                      if (e.key === "ArrowLeft") baseDateMonthRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-10 px-2 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[9px] text-white/40 text-center mt-0.5">Year</span>
                </div>
                <div className="col-span-3 sm:col-span-1 flex items-center justify-center">
                  <div className="relative w-full">
                    <input
                      ref={baseDatePickerRef}
                      type="date"
                      onChange={handleBaseDatePickerChange}
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

            {/* Base Time Inputs */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                Base Time (HH:MM:SS)
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <input
                    ref={baseHourRef}
                    type="text"
                    placeholder="HH (01-12)"
                    maxLength={2}
                    value={baseHour}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setBaseHour(val)
                      if (val.length === 2) baseMinuteRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && baseHour === "") baseDateYearRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Hour</span>
                </div>
                <div>
                  <input
                    ref={baseMinuteRef}
                    type="text"
                    placeholder="MM (00-59)"
                    maxLength={2}
                    value={baseMinute}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setBaseMinute(val)
                      if (val.length === 2) baseSecondRef.current?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && baseMinute === "") baseHourRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Minute</span>
                </div>
                <div>
                  <input
                    ref={baseSecondRef}
                    type="text"
                    placeholder="SS"
                    maxLength={2}
                    value={baseSecond}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setBaseSecond(val)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && baseSecond === "") baseMinuteRef.current?.focus()
                    }}
                    className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                  />
                  <span className="block text-[10px] text-white/40 text-center mt-1">Second</span>
                </div>
                <div>
                  <div className="flex bg-[#71758c]/20 p-1 rounded-xl border border-white/10 h-11 items-center">
                    <button
                      type="button"
                      onClick={() => setBaseAmPm("AM")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        baseAmPm === "AM" ? "bg-[#00e5ff] text-black shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setBaseAmPm("PM")}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        baseAmPm === "PM" ? "bg-[#00e5ff] text-black shadow-md" : "text-white/60 hover:text-white"
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

          {/* Operation Selector: Add or Subtract */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Operation:</span>
            <div className="flex bg-[#71758c]/20 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setIsAddMode(true)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isAddMode ? "bg-[#00e5ff] text-black shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                Add (+)
              </button>
              <button
                type="button"
                onClick={() => setIsAddMode(false)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isAddMode ? "bg-[#00e5ff] text-black shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                <Minus className="h-3.5 w-3.5" />
                Subtract (-)
              </button>
            </div>
          </div>

          {/* Values to Add / Subtract */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {isAddMode ? "Time to Add" : "Time to Subtract"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <input
                  ref={daysToAddRef}
                  type="text"
                  placeholder="0"
                  value={daysToAdd}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    setDaysToAdd(val)
                  }}
                  className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                />
                <span className="block text-[10px] text-white/40 text-center mt-1">Days</span>
              </div>
              <div>
                <input
                  ref={hoursToAddRef}
                  type="text"
                  placeholder="0"
                  value={hoursToAdd}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    setHoursToAdd(val)
                  }}
                  className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                />
                <span className="block text-[10px] text-white/40 text-center mt-1">Hours</span>
              </div>
              <div>
                <input
                  ref={minutesToAddRef}
                  type="text"
                  placeholder="0"
                  value={minutesToAdd}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    setMinutesToAdd(val)
                  }}
                  className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                />
                <span className="block text-[10px] text-white/40 text-center mt-1">Minutes</span>
              </div>
              <div>
                <input
                  ref={secondsToAddRef}
                  type="text"
                  placeholder="0"
                  value={secondsToAdd}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    setSecondsToAdd(val)
                  }}
                  className="w-full bg-[#71758c]/20 border border-white/10 text-white rounded-xl h-11 px-3 text-center text-sm font-semibold focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/50 transition-all placeholder:text-white/30"
                />
                <span className="block text-[10px] text-white/40 text-center mt-1">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="w-full lg:w-84 bg-[#33374b]/60 backdrop-blur-xl p-6 sm:p-7 rounded-[2rem] border border-white/10 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="border-b border-white/10 pb-3 text-center">
            <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Calculated Target Date & Time
            </p>
          </div>

          {/* Primary Highlight */}
          <div className="bg-gradient-to-br from-[#71758c]/30 to-[#1e2235]/60 p-5 rounded-2xl border border-white/10 text-center space-y-3">
            {/* Target Date Section (Shown when Date is provided) */}
            {result.hasDate && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                  Target Date & Day
                </span>
                <div className="text-lg sm:text-xl font-black text-white flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>{result.resultFullDate}</span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                  {result.resultDateFormatted}
                </div>
                <div className="h-px bg-white/10 my-3" />
              </div>
            )}

            {/* Target Time Section */}
            <div>
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1">
                Target Time (AM/PM)
              </span>
              <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-cyan-400 drop-shadow-sm">
                {result.formattedTime12}
              </div>
            </div>

            {/* Day Shift Badge */}
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
                {result.dayShiftText}
              </span>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="space-y-2">
            {result.hasDate && (
              <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                <span className="text-white/70">Result Date</span>
                <span className="font-bold text-[#00e5ff] font-mono">
                  {result.resultDateFormatted} ({result.resultWeekday})
                </span>
              </div>
            )}
            <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/70">12-Hour Format</span>
              <span className="font-bold text-[#00e5ff]">{result.formattedTime12}</span>
            </div>
            <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/70">24-Hour Format</span>
              <span className="font-bold text-[#00e5ff] font-mono">{result.formattedTime24}</span>
            </div>
            <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/70">{isAddMode ? "Total Added" : "Total Subtracted"}</span>
              <span className="font-bold text-[#00e5ff]">{result.decimalHoursAdded} hrs</span>
            </div>
            <div className="bg-[#71758c]/20 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/70">Total Shift (Seconds)</span>
              <span className="font-bold text-fuchsia-400">{result.totalAddedSeconds.toLocaleString()} s</span>
            </div>
          </div>

          {/* Flow Summary */}
          <div className="pt-2 border-t border-white/10 space-y-1 text-center">
            <span className="text-[10px] text-white/40 uppercase font-semibold tracking-wider block">Calculation Flow</span>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/80 flex-wrap">
              <span className="font-medium">{result.baseDisplay}</span>
              <span className="text-cyan-400 font-bold px-1">{isAddMode ? "+" : "-"}</span>
              <span className="font-medium">
                {daysToAdd ? `${daysToAdd}d ` : ""}
                {hoursToAdd ? `${hoursToAdd}h ` : ""}
                {minutesToAdd ? `${minutesToAdd}m ` : ""}
                {secondsToAdd ? `${secondsToAdd}s` : ""}
                {!daysToAdd && !hoursToAdd && !minutesToAdd && !secondsToAdd ? "0h" : ""}
              </span>
              <ArrowRight className="h-3 w-3 text-cyan-400 shrink-0" />
              <span className="font-bold text-white">
                {result.resultDateFormatted ? `${result.resultDateFormatted} ` : ""}
                {result.formattedTime12}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
