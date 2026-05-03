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
    const daysPerYear = 365

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
    if (e.key === "Backspace" && inputDay3 === "") {
      e.preventDefault()
      inputDay2Ref.current?.focus()
    }
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

        {/* Converted Result Section */}
        {(inputDay1 || inputDay2 || inputDay3) && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white text-center">Converted Result</h3>
            
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-500 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
              <div className="grid grid-cols-3 gap-0">
                <div className="border-r border-slate-700 p-4">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                    Years
                  </p>
                  <p className="text-xl font-bold text-cyan-500 text-center">{resultYears || 0}</p>
                </div>
                <div className="border-r border-slate-700 p-4">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                    Months
                  </p>
                  <p className="text-xl font-bold text-cyan-500 text-center">{resultMonths || 0}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">Days</p>
                  <p className="text-xl font-bold text-cyan-500 text-center">{resultDays || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700 shadow-lg">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 text-center">Total Days</p>
              <p className="text-2xl font-bold text-cyan-500 text-center">{resultTotalDays || 0}</p>
            </div>
          </div>
        )}

        {/* Clear Fields Button */}
        {(inputDay1 || inputDay2 || inputDay3) && (
          <button
            onClick={clearFields}
            className="w-full backdrop-blur-md bg-red-500/30 hover:bg-red-500/50 text-white font-semibold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-red-600 border border-red-500/60 hover:border-red-400 cursor-pointer shadow-md"
          >
            Clear Fields
          </button>
        )}
      </div>
    </div>
  )
}
