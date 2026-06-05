import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ArrowLeft, Save, Music, User, PlusCircle, Check, Loader2 } from 'lucide-react'

interface EditSongProps {
  songId: string
  onNavigate: (route: string) => void
}

export const EditSong: React.FC<EditSongProps> = ({ songId, onNavigate }) => {
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [chords, setChords] = useState('')
  const [addedBy, setAddedBy] = useState('')
  const [type, setType] = useState<'Alabanza' | 'Adoración'>('Alabanza')
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Fetch song details first
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

        if (data) {
          setName(data.name)
          setAuthor(data.author)
          setChords(data.chords)
          setAddedBy(data.added_by)
          setType(data.type)
        }
      } catch (err: any) {
        console.error('Error fetching song for edit:', err)
        setError(err.message || 'Error al obtener los detalles de la canción.')
      } finally {
        setLoading(false)
      }
    }

    if (songId) {
      fetchSong()
    }
  }, [songId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verified) {
      setError('Debes marcar la casilla de "Confirmar cambios" para poder actualizar la canción.')
      return
    }

    if (!name.trim() || !author.trim() || !chords.trim()) {
      setError('Todos los campos son obligatorios.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const { error: updateError } = await supabase
        .from('Canciones')
        .update({
          name: name.trim(),
          author: author.trim(),
          chords: chords.trim(),
          type: type
        })
        .eq('id', songId)

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        onNavigate(`#/view-song/${songId}`)
      }, 1500)
    } catch (err: any) {
      console.error('Error updating song:', err)
      setError(err.message || 'Error al actualizar la canción en la base de datos.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 text-purple-600 dark:text-purple-400 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cargando datos de la canción...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(`#/view-song/${songId}`)}
            className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-150 dark:hover:bg-gray-700 transition-all"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
              Editar Canción
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Modifica los acordes y detalles de la canción seleccionada.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-8 transition-colors duration-300">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-950/50 rounded-2xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-950/50 rounded-2xl text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2">
            <Check className="w-5 h-5" />
            ¡Canción actualizada correctamente! Redirigiendo a la vista...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-purple-500" />
                Nombre de la Canción
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Cuan Grande es Él"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
              />
            </div>

            {/* Author Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-500" />
                Autor
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Ej: En Spirit y en Verdad"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Chords Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-purple-500" />
              Letra con Acordes
            </label>
            <textarea
              value={chords}
              onChange={e => setChords(e.target.value)}
              placeholder="Ej:
C              G
Cuan grande es Él,
Am             F
Cuan grande es Él."
              required
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-mono transition-all leading-relaxed whitespace-pre"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Added By Input (Disabled) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Agregada por (No editable)
              </label>
              <input
                type="text"
                value={addedBy}
                disabled
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-100 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
              />
            </div>

            {/* Type Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tipo de Canto
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as 'Alabanza' | 'Adoración')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
              >
                <option value="Alabanza">Alabanza</option>
                <option value="Adoración">Adoración</option>
              </select>
            </div>
          </div>

          {/* Verification Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-950/50 rounded-2xl">
            <input
              type="checkbox"
              id="verified"
              checked={verified}
              onChange={e => setVerified(e.target.checked)}
              className="w-5 h-5 rounded-md text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-gray-700 cursor-pointer"
            />
            <label htmlFor="verified" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              Confirmar cambios realizados en la letra o en los acordes de la canción.
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800">
            <button
              type="button"
              onClick={() => onNavigate(`#/view-song/${songId}`)}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-250 dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-55/40 dark:hover:bg-gray-800 rounded-xl text-sm font-semibold transition-all text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Actualizar Canción</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
