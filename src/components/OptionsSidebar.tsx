import React, { useState } from 'react'
import { usePersonalization } from '../context/PersonalizationContext'
import type { ChordAlignment } from '../context/PersonalizationContext'
import { Settings, X, AlignLeft, AlignCenter, AlignRight, Plus, Minus, Type } from 'lucide-react'

export const OptionsSidebar: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    alignChords,
    setAlignChords,
    transpose,
    setTranspose
  } = usePersonalization()

  const [isOpen, setIsOpen] = useState(false)

  const alignments: { value: ChordAlignment; label: string; icon: React.ReactNode }[] = [
    { value: 'left', label: 'Izquierda', icon: <AlignLeft className="w-4 h-4" /> },
    { value: 'center', label: 'Centro', icon: <AlignCenter className="w-4 h-4" /> },
    { value: 'right', label: 'Derecha', icon: <AlignRight className="w-4 h-4" /> }
  ]

  const handleTranspose = (change: number) => {
    const newVal = transpose + change
    if (newVal >= -6 && newVal <= 6) {
      setTranspose(newVal)
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        title="Personalizar visualización"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6 animate-spin-slow" />}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-80 max-w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border-l border-gray-200 dark:border-gray-800 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-6 overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Personalizar Vista
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Font Size Option */}
            <div className="py-6 border-b border-gray-150 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-blue-500" />
                  Tamaño de letra
                </label>
                <span className="text-xs font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="28"
                value={fontSize}
                onChange={e => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Pequeño</span>
                <span>Grande</span>
              </div>
            </div>

            {/* Chord Alignment Option */}
            <div className="py-6 border-b border-gray-150 dark:border-gray-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Alineación de acordes
              </label>
              <div className="grid grid-cols-3 gap-2">
                {alignments.map(align => (
                  <button
                    key={align.value}
                    onClick={() => setAlignChords(align.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      alignChords === align.value
                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {align.icon}
                    <span>{align.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transposition Option */}
            <div className="py-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transponer tono
                </label>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    transpose === 0
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      : transpose > 0
                      ? 'bg-emerald-100 dark:bg-emerald-950/45 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950/45 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {transpose > 0 ? `+${transpose}` : transpose} semitonos
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <button
                  disabled={transpose <= -6}
                  onClick={() => handleTranspose(-1)}
                  className="flex-1 flex items-center justify-center p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTranspose(0)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Restablecer
                </button>
                <button
                  disabled={transpose >= 6}
                  onClick={() => handleTranspose(1)}
                  className="flex-1 flex items-center justify-center p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Settings hint */}
          <div className="text-[11px] text-gray-400 text-center border-t border-gray-150 dark:border-gray-800 pt-4 mt-4">
            Los cambios se guardan automáticamente.
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-20 bg-black/20 dark:bg-black/40 backdrop-blur-[1px] transition-opacity duration-300"
        />
      )}
    </>
  )
}
