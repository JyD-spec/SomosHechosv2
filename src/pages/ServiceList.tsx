import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ServiceListItem } from '../types'
import { ArrowUp, ArrowDown, Trash2, Eye, EyeOff, Loader2, Music, AlertCircle } from 'lucide-react'
import { ChordsViewer } from '../components/ChordsViewer'

interface ServiceListProps {
  onNavigate: (route: string) => void
}

export const ServiceList: React.FC<ServiceListProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<ServiceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [visibleChords, setVisibleChords] = useState<{ [key: number]: boolean }>({})

  const fetchServiceList = async () => {
    try {
      setLoading(true)
      // Query items with relationship from Canciones
      const { data, error } = await supabase
        .from('ListadoDeServicio')
        .select('*, Canciones:cancion_id(*)')
        .order('posicion_id', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error('Error fetching service list:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServiceList()
  }, [])

  const toggleChords = (itemId: number) => {
    setVisibleChords(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  // Remove individual item from service list
  const handleRemoveItem = async (itemId: number) => {
    if (!window.confirm('¿Deseas quitar esta canción del listado de servicio?')) return

    try {
      setUpdatingId(itemId)
      const { error } = await supabase
        .from('ListadoDeServicio')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      // After delete, re-sequence remaining items to maintain contiguous order
      const remaining = items.filter(item => item.id !== itemId)
      const updates = remaining.map((item, idx) => ({
        id: item.id,
        cancion_id: item.cancion_id,
        posicion_id: idx + 1
      }))

      if (updates.length > 0) {
        const { error: resequenceError } = await supabase
          .from('ListadoDeServicio')
          .upsert(updates)
        if (resequenceError) throw resequenceError
      }

      await fetchServiceList()
    } catch (err) {
      console.error('Error removing item:', err)
      alert('Error al quitar la canción de la lista.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Clear entire list
  const handleClearList = async () => {
    if (!window.confirm('¿Estás completamente seguro de vaciar todo el listado del servicio? This cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase
        .from('ListadoDeServicio')
        .delete()
        .neq('id', 0) // Delete all

      if (error) throw error
      setItems([])
    } catch (err) {
      console.error('Error clearing list:', err)
      alert('Error al vaciar la lista.')
    } finally {
      setLoading(false)
    }
  }

  // Move item up or down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const itemA = items[index]
    const itemB = items[targetIndex]

    // Optimistic UI state update
    const reordered = [...items]
    // Swap positions locally
    reordered[index] = { ...itemB, posicion_id: itemA.posicion_id }
    reordered[targetIndex] = { ...itemA, posicion_id: itemB.posicion_id }
    setItems(reordered)

    try {
      // Perform DB updates in parallel
      const updateA = supabase
        .from('ListadoDeServicio')
        .update({ posicion_id: itemB.posicion_id })
        .eq('id', itemA.id)

      const updateB = supabase
        .from('ListadoDeServicio')
        .update({ posicion_id: itemA.posicion_id })
        .eq('id', itemB.id)

      const [resA, resB] = await Promise.all([updateA, updateB])
      if (resA.error) throw resA.error
      if (resB.error) throw resB.error
    } catch (err) {
      console.error('Error reordering items:', err)
      // Rollback to original database list in case of network error
      fetchServiceList()
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Action Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
            Listado de Servicio
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Prepara y reordena el orden de los cantos para el domingo.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearList}
            className="px-4 py-2 border border-red-200 dark:border-red-950 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold rounded-xl transition-all w-full sm:w-auto text-center"
          >
            Vaciar listado
          </button>
        )}
      </div>

      {/* List content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-purple-600 dark:text-purple-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando lista de servicio...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, index) => {
            const song = item.Canciones
            if (!song) return null
            const isChordsOpen = !!visibleChords[item.id]

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Song Info */}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold text-sm">
                      {item.posicion_id}
                    </span>
                    <div>
                      <h3
                        onClick={() => onNavigate(`#/view-song/${song.id}`)}
                        className="text-lg font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer m-0 transition-colors"
                      >
                        {song.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{song.author}</p>
                    </div>
                  </div>

                  {/* Options Panel */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Move Controls */}
                    <div className="flex items-center bg-gray-50 dark:bg-gray-850 p-1 rounded-xl border border-gray-200 dark:border-gray-800">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-850 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-30 disabled:hover:text-gray-500 transition-all"
                        title="Subir de posición"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={index === items.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-850 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-30 disabled:hover:text-gray-500 transition-all"
                        title="Bajar de posición"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Toggle View Chords */}
                    <button
                      onClick={() => toggleChords(item.id)}
                      className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                        isChordsOpen
                          ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-150 dark:hover:bg-gray-750'
                      }`}
                    >
                      {isChordsOpen ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Ocultar acordes</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver acordes</span>
                        </>
                      )}
                    </button>

                    {/* Remove from list */}
                    <button
                      disabled={updatingId === item.id}
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/45 disabled:opacity-50 transition-colors"
                      title="Quitar de la lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Chords View */}
                {isChordsOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-150 dark:border-gray-800">
                    <ChordsViewer chordsText={song.chords} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center shadow-sm transition-colors duration-300">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">El listado está vacío</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2">
            Añade canciones a la lista del servicio desde el panel de inicio para empezar a estructurar el repertorio.
          </p>
          <button
            onClick={() => onNavigate('#/')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 transition-all"
          >
            <Music className="w-4 h-4" />
            Explorar canciones
          </button>
        </div>
      )}
    </div>
  )
}
