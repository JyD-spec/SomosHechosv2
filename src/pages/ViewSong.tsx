import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Song } from '../types'
import { ChordsViewer } from '../components/ChordsViewer'
import { ArrowLeft, Edit, Music, User, Loader2 } from 'lucide-react'

interface ViewSongProps {
  songId: string
  onNavigate: (route: string) => void
}

export const ViewSong: React.FC<ViewSongProps> = ({ songId, onNavigate }) => {
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error: fetchError } = await supabase
          .from('Canciones')
          .select('*')
          .eq('id', songId)
          .single()

        if (fetchError) throw fetchError
        setSong(data)
      } catch (err: any) {
        console.error('Error fetching song:', err)
        setError(err.message || 'Error al obtener la canción.')
      } finally {
        setLoading(false)
      }
    }

    if (songId) {
      fetchSong()
    }
  }, [songId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cargando canción...</p>
      </div>
    )
  }

  if (error || !song) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('#/')}
            className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-150 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">Volver</span>
        </div>
        <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-950/50 rounded-3xl text-red-700 dark:text-red-400 text-center shadow-sm">
          ❌ {error || 'Canción no encontrada'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <button
          onClick={() => onNavigate('#/')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-700 transition-all font-semibold text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        <button
          onClick={() => onNavigate(`#/edit-song/${song.id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all font-bold text-sm shadow-md shadow-amber-500/20"
        >
          <Edit className="w-4 h-4" />
          <span>Editar Canción</span>
        </button>
      </div>

      {/* Main Details Panel */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 transition-colors duration-300">
        {/* Title, Category & Author */}
        <div className="space-y-3 text-center sm:text-left border-b border-gray-150 dark:border-gray-800 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight m-0 text-gray-950 dark:text-white">
              {song.name}
            </h1>
            <span
              className={`self-center sm:self-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                song.type === 'Alabanza'
                  ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-950'
                  : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-950'
              }`}
            >
              {song.type}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-500" />
              <span>Autor: <strong className="text-gray-700 dark:text-gray-300 font-semibold">{song.author}</strong></span>
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
            <span className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-blue-500" />
              <span>Agregada por: <strong className="text-gray-700 dark:text-gray-300 font-semibold">{song.added_by}</strong></span>
            </span>
          </div>
        </div>

        {/* Chords rendering */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Acordes</h2>
          <ChordsViewer chordsText={song.chords} />
        </div>
      </div>
    </div>
  )
}
