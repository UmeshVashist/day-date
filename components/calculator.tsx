"use client"

import { useState, useEffect, useCallback } from "react"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [equation, setEquation] = useState("")
  const [shouldReset, setShouldReset] = useState(false)

  const handleInput = useCallback((value: string) => {
    if (shouldReset) {
      setDisplay(value)
      setShouldReset(false)
    } else {
      setDisplay((prev) => (prev === "0" ? value : prev + value))
    }
  }, [shouldReset])

  const handleOperator = useCallback((op: string) => {
    setEquation(display + " " + op + " ")
    setShouldReset(true)
  }, [display])

  const handleCalculate = useCallback(() => {
    try {
      const fullEquation = equation + display
      // Using Function constructor as a safer alternative to eval for simple math
      const result = new Function(`return ${fullEquation.replace(/×/g, "*").replace(/÷/g, "/")}`)()
      setDisplay(String(Number(result.toFixed(8))))
      setEquation("")
      setShouldReset(true)
    } catch (error) {
      setDisplay("Error")
      setShouldReset(true)
    }
  }, [display, equation])

  const handleClear = useCallback(() => {
    setDisplay("0")
    setEquation("")
    setShouldReset(false)
  }, [])

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
  }, [])

  const handleToggleSign = useCallback(() => {
    setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev))
  }, [])

  const handlePercent = useCallback(() => {
    setDisplay((prev) => String(Number(prev) / 100))
  }, [])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleInput(e.key)
      if (["+", "-", "*", "/"].includes(e.key)) {
        const ops: Record<string, string> = { "*": "×", "/": "÷" }
        handleOperator(ops[e.key] || e.key)
      }
      if (e.key === "Enter" || e.key === "=") handleCalculate()
      if (e.key === "Backspace") handleBackspace()
      if (e.key === "Escape") handleClear()
      if (e.key === ".") handleInput(".")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleInput, handleOperator, handleCalculate, handleBackspace, handleClear])

  const Button = ({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`h-16 sm:h-20 rounded-[1.5rem] flex items-center justify-center text-xl sm:text-2xl font-black transition-all active:scale-95 backdrop-blur-md border border-white/10 hover:bg-white/20 shadow-lg ${className}`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col items-center justify-center w-full py-4">
      <div className="w-full max-w-[360px] sm:max-w-[420px] bg-[#33374b]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Display Area */}
        <div className="bg-[#71758c]/40 backdrop-blur-sm rounded-[1.5rem] p-6 flex flex-col items-end justify-center min-h-[140px] border border-white/5 shadow-inner">
          <div className="text-[#00e5ff]/70 text-sm font-bold h-6 overflow-hidden text-right w-full tracking-widest uppercase opacity-70">
            {equation}
          </div>
          <div className="text-white text-4xl sm:text-6xl font-black overflow-hidden text-right w-full truncate tracking-tighter drop-shadow-md">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          <Button label="C" onClick={handleClear} className="text-red-400 bg-red-500/10 border-red-500/20" />
          <Button label="±" onClick={handleToggleSign} className="text-fuchsia-400 bg-white/5" />
          <Button label="%" onClick={handlePercent} className="text-fuchsia-400 bg-white/5" />
          <Button label="÷" onClick={() => handleOperator("÷")} className="text-[#00e5ff] bg-white/5" />

          <Button label="7" onClick={() => handleInput("7")} className="text-white bg-white/5" />
          <Button label="8" onClick={() => handleInput("8")} className="text-white bg-white/5" />
          <Button label="9" onClick={() => handleInput("9")} className="text-white bg-white/5" />
          <Button label="×" onClick={() => handleOperator("×")} className="text-[#00e5ff] bg-white/5" />

          <Button label="4" onClick={() => handleInput("4")} className="text-white bg-white/5" />
          <Button label="5" onClick={() => handleInput("5")} className="text-white bg-white/5" />
          <Button label="6" onClick={() => handleInput("6")} className="text-white bg-white/5" />
          <Button label="-" onClick={() => handleOperator("-")} className="text-[#00e5ff] bg-white/5" />

          <Button label="1" onClick={() => handleInput("1")} className="text-white bg-white/5" />
          <Button label="2" onClick={() => handleInput("2")} className="text-white bg-white/5" />
          <Button label="3" onClick={() => handleInput("3")} className="text-white bg-white/5" />
          <Button label="+" onClick={() => handleOperator("+")} className="text-[#00e5ff] bg-white/5" />

          <Button label="0" onClick={() => handleInput("0")} className="text-white bg-white/5" />
          <Button label="." onClick={() => handleInput(".")} className="text-white bg-white/5" />
          <Button label="⌫" onClick={handleBackspace} className="text-fuchsia-400 bg-white/5" />
          <Button label="=" onClick={handleCalculate} className="bg-[#00e5ff]/30 text-[#00e5ff] border-[#00e5ff]/40" />
        </div>
      </div>
    </div>
  )
}
