"use client"

import { useState, useRef } from "react"

export default function DaysConvert() {
  // Input section: 3 day values that user fills
  const [inputDay1, setInputDay1] = useState<string>("")
  const [inputDay2, setInputDay2] = useState<string>("")
  const [inputDay3, setInputDay3] = useState<string>("")

  // Result section: calculated values from input
  const [resultTotalDays, setResultTotalDays] = useState<string>("")
  const [resultYears, setResultYears] = useState<string>("")
  const [resultMonths, setResultMonths] = useState<string>("")
  const [resultDays, setResultDays] = useState<string>("")

  const inputDay1Ref = useRef<HTMLInputElement>(null)
  const inputDay2Ref = useRef<HTMLInputElement>(null)
  const inputDay3Ref = useRef<HTMLInputElement>(null)
  const resultTotalDaysRef = useRef<HTMLInputElement>(null)
  const resultYearsRef = useRef<HTMLInputElement>(null)
  const resultMonthsRef = useRef<HTMLInputElement>(null)
  const resultDaysRef = useRef<HTMLInputElement>(null)

  // Calculate result from input values (sum of 3 days)
  const calculateResult = (d1: string, d2: string, d3: string) => {
    const d1_num = Number(d1) || 0
    const d2_num = Number(d2) || 0
    const d3_num = Number(d3) || 0

    // Sum the three day values
    const total = d1_num + d2_num + d3_num
    setResultTotalDays(total.toString())

    // Convert total to years, months, days
    const daysPerMonth = 30
    const daysPerYear = 360

    const calculatedYears = Math.floor(total / daysPerYear)
    let remainingDays = total % daysPerYear

    const calculatedMonths = Math.floor(remainingDays / daysPerMonth)
    remainingDays = remainingDays % daysPerMonth

    const calculatedDays = remainingDays

    setResultYears(calculatedYears.toString())
    setResultMonths(calculatedMonths.toString())
    setResultDays(calculatedDays.toString())
  }

  // Handle input day 1
  const handleInputDay1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setInputDay1(value)
    calculateResult(value, inputDay2, inputDay3)
  }

  const handleInputDay1KeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      inputDay2Ref.current?.focus()
    }
    if (e.key === "Backspace" && inputDay1 === "") {
      e.preventDefault()
    }
  }

  // Handle input day 2
  const handleInputDay2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setInputDay2(value)
    calculateResult(inputDay1, value, inputDay3)
  }

  const handleInputDay2KeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      inputDay3Ref.current?.focus()
    }
    if (e.key === "Backspace" && inputDay2 === "") {
      e.preventDefault()
      inputDay1Ref.current?.focus()
    }
  }

  // Handle input day 3
  const handleInputDay3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setInputDay3(value)
    calculateResult(inputDay1, inputDay2, value)
  }

  const handleInputDay3KeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      resultTotalDaysRef.current?.focus()
    }
    if (e.key === "Backspace" && inputDay3 === "") {
      e.preventDefault()
      inputDay2Ref.current?.focus()
    }
  }

  // Handle result total days
  const handleResultTotalDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setResultTotalDays(value)

    // Convert total to years, months, days
    const total = Number(value) || 0
    const daysPerMonth = 30
    const daysPerYear = 365

    const calculatedYears = Math.floor(total / daysPerYear)
    let remainingDays = total % daysPerYear

    const calculatedMonths = Math.floor(remainingDays / daysPerMonth)
    remainingDays = remainingDays % daysPerMonth

    setResultYears(calculatedYears.toString())
    setResultMonths(calculatedMonths.toString())
    setResultDays(remainingDays.toString())
  }

  const handleResultTotalDaysKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      resultYearsRef.current?.focus()
    }
    if (e.key === "Backspace" && resultTotalDays === "") {
      e.preventDefault()
      inputDaysRef.current?.focus()
    }
  }

  // Handle result years
  const handleResultYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setResultYears(value)
    recalculateTotal(value, resultMonths, resultDays)
  }

  const handleResultYearsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      resultMonthsRef.current?.focus()
    }
    if (e.key === "Backspace" && resultYears === "") {
      e.preventDefault()
      resultTotalDaysRef.current?.focus()
    }
  }

  // Handle result months
  const handleResultMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setResultMonths(value)
    recalculateTotal(resultYears, value, resultDays)
  }

  const handleResultMonthsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      resultDaysRef.current?.focus()
    }
    if (e.key === "Backspace" && resultMonths === "") {
      e.preventDefault()
      resultYearsRef.current?.focus()
    }
  }

  // Handle result days
  const handleResultDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setResultDays(value)
    recalculateTotal(resultYears, resultMonths, value)
  }

  const handleResultDaysKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && resultDays === "") {
      e.preventDefault()
      resultMonthsRef.current?.focus()
    }
  }

  // Recalculate total from result fields
  const recalculateTotal = (y: string, m: string, d: string) => {
    const y_num = Number(y) || 0
    const m_num = Number(m) || 0
    const d_num = Number(d) || 0

    const total = y_num * 365 + m_num * 30 + d_num
    setResultTotalDays(total.toString())
  }

  // Clear all fields
  const clearFields = () => {
    setInputDay1("")
    setInputDay2("")
    setInputDay3("")
    setResultTotalDays("")
    setResultYears("")
    setResultMonths("")
    setResultDays("")
    inputDay1Ref.current?.focus()
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        {/* Total Days Input Section - 3 Inputs with + symbols */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-white text-center">Total Days</label>
          <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-3">
            {/* Input Day 1 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white text-center">Days</label>
              <input
                ref={inputDay1Ref}
                type="text"
                inputMode="numeric"
                value={inputDay1}
                onChange={handleInputDay1Change}
                onKeyDown={handleInputDay1KeyDown}
                placeholder="0"
                className="px-3 py-2 sm:px-4 sm:py-3 border-2 border-white text-white rounded-lg text-center text-sm sm:text-lg font-semibold focus:outline-none focus:border-purple-500 transition w-24 sm:w-32"
              />
            </div>

            {/* Plus symbol */}
            <div className="text-2xl font-bold text-cyan-500 pb-1">+</div>

            {/* Input Day 2 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white text-center">Days</label>
              <input
                ref={inputDay2Ref}
                type="text"
                inputMode="numeric"
                value={inputDay2}
                onChange={handleInputDay2Change}
                onKeyDown={handleInputDay2KeyDown}
                placeholder="0"
                className="px-3 py-2 sm:px-4 sm:py-3 border-2 border-white text-white rounded-lg text-center text-sm sm:text-lg font-semibold focus:outline-none focus:border-purple-500 transition w-24 sm:w-32"
              />
            </div>

            {/* Plus symbol */}
            <div className="text-2xl font-bold text-cyan-500 pb-1">+</div>

            {/* Input Day 3 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white text-center">Days</label>
              <input
                ref={inputDay3Ref}
                type="text"
                inputMode="numeric"
                value={inputDay3}
                onChange={handleInputDay3Change}
                onKeyDown={handleInputDay3KeyDown}
                placeholder="0"
                className="px-3 py-2 sm:px-4 sm:py-3 border-2 border-white text-white rounded-lg text-center text-sm sm:text-lg font-semibold focus:outline-none focus:border-purple-500 transition w-24 sm:w-32"
              />
            </div>
          </div>
        </div>

        {/* Converted Result Section - 4 Fields */}
        <div className="backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/40">
          <h3 className="text-lg font-bold text-white text-center mb-6">Converted Result</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Total Days */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white text-center">Total Days</label>
              <input
                ref={resultTotalDaysRef}
                type="text"
                inputMode="numeric"
                value={resultTotalDays}
                onChange={handleResultTotalDaysChange}
                onKeyDown={handleResultTotalDaysKeyDown}
                placeholder="0"
                className="px-2 py-1 sm:px-3 sm:py-2 border-2 border-blue-400 text-white rounded-lg text-center text-sm sm:text-lg font-semibold focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Years */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white text-center">Years</label>
              <input
                ref={resultYearsRef}
                type="text"
                inputMode="numeric"
                value={resultYears}
                onChange={handleResultYearsChange}
                onKeyDown={handleResultYearsKeyDown}
                placeholder="0"
                className="px-2 py-1 sm:px-3 sm:py-2 border-2 border-blue-400 text-white rounded-lg text-center text-sm sm:text-lg font-semibold focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Months */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white text-center">Months</label>
              <input
                ref={resultMonthsRef}
                type="text"
                inputMode="numeric"
                value={resultMonths}
                onChange={handleResultMonthsChange}
                onKeyDown={handleResultMonthsKeyDown}
                placeholder="0"
                className="px-2 py-1 sm:px-3 sm:py-2 border-2 border-blue-400 text-white rounded-lg text-center text-sm sm:text-lg font-semibold focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Days */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white text-center">Days</label>
              <input
                ref={resultDaysRef}
                type="text"
                inputMode="numeric"
                value={resultDays}
                onChange={handleResultDaysChange}
                onKeyDown={handleResultDaysKeyDown}
                placeholder="0"
                className="px-2 py-1 sm:px-3 sm:py-2 border-2 border-blue-400 text-white rounded-lg text-center text-sm sm:text-lg font-semibold focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Clear Fields Button */}
        <button
          onClick={clearFields}
          className="w-full backdrop-blur-md bg-red-500/30 hover:bg-red-500/50 text-white font-semibold py-3 rounded-lg transition hover:cursor-pointer transition-all hover:shadow-lg hover:shadow-red-600 border border-red-500/60 hover:border-red-400 cursor-pointer"
        >
          Clear Fields
        </button>



      </div>
    </div>
  )
}
