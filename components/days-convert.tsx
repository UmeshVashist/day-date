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
          <label className="text-sm font-black text-[#00e5ff] uppercase tracking-widest text-center opacity-90">Total Days Addition</label>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Input Day 1 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-tighter text-center">Days</label>
              <input
                ref={inputDay1Ref}
                type="text"
                inputMode="numeric"
                value={inputDay1}
                onChange={handleInputDay1Change}
                onKeyDown={handleInputDay1KeyDown}
                placeholder="0"
                className="px-4 py-4 border-2 border-white/10 bg-[#71758c]/40 text-white rounded-2xl text-center text-xl font-black focus:outline-none focus:border-[#00e5ff]/50 transition w-28 sm:w-36 shadow-inner"
              />
            </div>

            {/* Plus symbol */}
            <div className="text-3xl font-black text-[#00e5ff] pt-6">+</div>

            {/* Input Day 2 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-tighter text-center">Days</label>
              <input
                ref={inputDay2Ref}
                type="text"
                inputMode="numeric"
                value={inputDay2}
                onChange={handleInputDay2Change}
                onKeyDown={handleInputDay2KeyDown}
                placeholder="0"
                className="px-4 py-4 border-2 border-white/10 bg-[#71758c]/40 text-white rounded-2xl text-center text-xl font-black focus:outline-none focus:border-[#00e5ff]/50 transition w-28 sm:w-36 shadow-inner"
              />
            </div>

            {/* Plus symbol */}
            <div className="text-3xl font-black text-[#00e5ff] pt-6">+</div>

            {/* Input Day 3 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-tighter text-center">Days</label>
              <input
                ref={inputDay3Ref}
                type="text"
                inputMode="numeric"
                value={inputDay3}
                onChange={handleInputDay3Change}
                onKeyDown={handleInputDay3KeyDown}
                placeholder="0"
                className="px-4 py-4 border-2 border-white/10 bg-[#71758c]/40 text-white rounded-2xl text-center text-xl font-black focus:outline-none focus:border-[#00e5ff]/50 transition w-28 sm:w-36 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Converted Result Section */}
        {(inputDay1 || inputDay2 || inputDay3) && (
          <div className="space-y-6 pt-4 border-t border-white/10">
            <h3 className="text-xs font-black text-green-500 uppercase tracking-[0.3em] text-center">Converted Result</h3>
            
            <div className="bg-[#71758c]/20 text-[#00e5ff] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="grid grid-cols-3 gap-0">
                <div className="border-r border-white/10 p-6">
                  <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3 text-center">
                    Years
                  </p>
                  <p className="text-3xl font-black text-cyan-500 text-center tracking-tighter">{resultYears || 0}</p>
                </div>
                <div className="border-r border-white/10 p-6">
                  <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3 text-center">
                    Months
                  </p>
                  <p className="text-3xl font-black text-cyan-500 text-center tracking-tighter">{resultMonths || 0}</p>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3 text-center">Days</p>
                  <p className="text-3xl font-black text-cyan-500 text-center tracking-tighter">{resultDays || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#71758c]/20 p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center group transition-all hover:bg-[#71758c]/30">
              <p className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em] mb-3 group-hover:text-fuchsia-400 transition-colors">Total Accumulated Days</p>
              <p className="text-3xl font-black text-cyan-500 tracking-tighter drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">{resultTotalDays || 0}</p>
            </div>
          </div>
        )}

        {/* Clear Fields Button */}
        {(inputDay1 || inputDay2 || inputDay3) && (
          <button
            onClick={clearFields}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-4 rounded-2xl transition-all border border-red-500/20 hover:border-red-500/40 cursor-pointer uppercase tracking-widest text-xs mt-4"
          >
            Clear All Days
          </button>
        )}
      </div>
    </div>
  )
}
