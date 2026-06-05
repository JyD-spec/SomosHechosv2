import React, { useMemo } from 'react'
import { usePersonalization } from '../context/PersonalizationContext'
import { transposeText } from '../utils/transposer'

interface ChordsViewerProps {
  chordsText: string
}

export const ChordsViewer: React.FC<ChordsViewerProps> = ({ chordsText }) => {
  const { fontSize, alignChords, transpose } = usePersonalization()

  // Re-run transposition only when text or transposition steps change
  const transposedContent = useMemo(() => {
    return transposeText(chordsText, transpose)
  }, [chordsText, transpose])

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[alignChords]

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-inner transition-all duration-300 overflow-x-auto">
      <pre
        className={`font-mono leading-relaxed whitespace-pre select-text ${alignmentClass} text-gray-800 dark:text-gray-200`}
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        }}
      >
        {transposedContent}
      </pre>
    </div>
  )
}
