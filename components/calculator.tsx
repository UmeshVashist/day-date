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
      className={`h-14 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-xl font-medium transition-all active:scale-95 backdrop-blur-md border border-white/10 hover:bg-white/10 ${className}`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col items-center justify-center w-full py-4">
      <div className="w-full max-w-[320px] sm:max-w-[360px] bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4">
        {/* Display Area */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-end justify-center min-h-[100px] border border-white/5">
          <div className="text-cyan-400/60 text-sm h-6 overflow-hidden text-right w-full">
            {equation}
          </div>
          <div className="text-white text-3xl sm:text-4xl font-normal overflow-hidden text-right w-full truncate">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <Button label="C" onClick={handleClear} className="text-red-400 bg-red-500/10" />
          <Button label="±" onClick={handleToggleSign} className="text-cyan-400" />
          <Button label="%" onClick={handlePercent} className="text-cyan-400" />
          <Button label="÷" onClick={() => handleOperator("÷")} className="text-cyan-400 bg-white/5" />

          <Button label="7" onClick={() => handleInput("7")} className="text-white bg-white/5" />
          <Button label="8" onClick={() => handleInput("8")} className="text-white bg-white/5" />
          <Button label="9" onClick={() => handleInput("9")} className="text-white bg-white/5" />
          <Button label="×" onClick={() => handleOperator("×")} className="text-cyan-400 bg-white/5" />

          <Button label="4" onClick={() => handleInput("4")} className="text-white bg-white/5" />
          <Button label="5" onClick={() => handleInput("5")} className="text-white bg-white/5" />
          <Button label="6" onClick={() => handleInput("6")} className="text-white bg-white/5" />
          <Button label="-" onClick={() => handleOperator("-")} className="text-cyan-400 bg-white/5" />

          <Button label="1" onClick={() => handleInput("1")} className="text-white bg-white/5" />
          <Button label="2" onClick={() => handleInput("2")} className="text-white bg-white/5" />
          <Button label="3" onClick={() => handleInput("3")} className="text-white bg-white/5" />
          <Button label="+" onClick={() => handleOperator("+")} className="text-cyan-400 bg-white/5" />

          <Button label="0" onClick={() => handleInput("0")} className="text-white bg-white/5 col-span-1" />
          <Button label="." onClick={() => handleInput(".")} className="text-white bg-white/5" />
          <Button label="⌫" onClick={handleBackspace} className="text-cyan-400 bg-white/5" />
          <Button label="=" onClick={handleCalculate} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30" />
        </div>
      </div>
    </div>
  )
}
