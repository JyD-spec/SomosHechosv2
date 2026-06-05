import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Song, ServiceListItem } from '../types'
import { Music, Plus, Edit, Trash2, ChevronRight, Loader2, Sparkles, Filter } from 'lucide-react'
import confetti from 'canvas-confetti'

interface HomeProps {
  searchQuery: string
  onNavigate: (route: string) => void
}

export const Home: React.FC<HomeProps> = ({ searchQuery, onNavigate }) => {
  const [songs, setSongs] = useState<Song[]>([])
  const [serviceItems, setServiceItems] = useState<ServiceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<'Todos' | 'Alabanza' | 'Adoración'>('Todos')

  // Fetch songs and current service list
  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: songsData, error: songsError } = await supabase
        .from('Canciones')
        .select('*')
        .order('name', { ascending: true })

      if (songsError) throw songsError

      const { data: serviceData, error: serviceError } = await supabase
        .from('ListadoDeServicio')
        .select('*')

      if (serviceError) throw serviceError

      setSongs(songsData || [])
      setServiceItems(serviceData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter songs based on search query and selected type
  const filteredSongs = songs.filter(song => {
    const matchesSearch =
      song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.author.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === 'Todos' || song.type === selectedType

    return matchesSearch && matchesType
  })

  // Check if a song is already in the service list
  const isSongInService = (songId: number) => {
    return serviceItems.some(item => item.cancion_id === songId)
  }

  // Add song to service list
  const handleAddToService = async (songId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click navigation
    try {
      const currentCount = serviceItems.length
      const nextPosition = currentCount + 1

      const { error } = await supabase
        .from('ListadoDeServicio')
        .insert([{ cancion_id: songId, posicion_id: nextPosition }])

      if (error) throw error

      // Trigger confetti from the click coordinates if possible, or center
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      })

      // Refresh service items
      const { data: updatedService, error: serviceError } = await supabase
        .from('ListadoDeServicio')
        .select('*')
      
      if (serviceError) throw serviceError
      setServiceItems(updatedService || [])
    } catch (err) {
      console.error('Error adding song to service:', err)
      alert('Error al añadir la canción al listado de servicio.')
    }
  }

  // Delete song
  const handleDeleteSong = async (songId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click navigation
    if (!window.confirm('¿Seguro que deseas borrar esta canción por completo? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(songId)

      // First remove from list of service if references exist
      await supabase
        .from('ListadoDeServicio')
        .delete()
        .eq('cancion_id', songId)

      const { error } = await supabase
        .from('Canciones')
        .delete()
        .eq('id', songId)

      if (error) throw error

      // Update local state
      setSongs(songs.filter(s => s.id !== songId))
      setServiceItems(serviceItems.filter(item => item.cancion_id !== songId))
    } catch (err) {
      console.error('Error deleting song:', err)
      alert('Error al eliminar la canción.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero / Header Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <Music className="w-96 h-96" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Cancionero Oficial
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight m-0 text-white">
            Hechos Comunidad Cristiana
          </h1>
          <p className="text-purple-100 max-w-xl text-sm sm:text-base">
            Administra los acordes y prepara los listados de alabanza y adoración de forma ágil y moderna.
          </p>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Filtrar por tipo:</span>
        </div>
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 w-full sm:w-auto">
          {(['Todos', 'Alabanza', 'Adoración'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedType === type
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Table / List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-purple-600 dark:text-purple-400 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando repertorio...</p>
          </div>
        ) : filteredSongs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Autor</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tipo</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Opciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredSongs.map(song => {
                  const yaAgregada = isSongInService(song.id)
                  return (
                    <tr
                      key={song.id}
                      onClick={() => onNavigate(`#/view-song/${song.id}`)}
                      className="group hover:bg-purple-50/30 dark:hover:bg-purple-950/10 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-950 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {song.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{song.author}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            song.type === 'Alabanza'
                              ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-950'
                              : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-950'
                          }`}
                        >
                          {song.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={yaAgregada}
                            onClick={e => handleAddToService(song.id, e)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                              yaAgregada
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/65'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {yaAgregada ? 'En lista' : 'Agregar'}
                          </button>
                          <button
                            onClick={() => onNavigate(`#/edit-song/${song.id}`)}
                            className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/65 transition-colors"
                            title="Editar canción"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            disabled={deletingId === song.id}
                            onClick={e => handleDeleteSong(song.id, e)}
                            className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/65 disabled:opacity-50 transition-colors"
                            title="Eliminar canción"
                          >
                            {deletingId === song.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all ml-1" />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400 space-y-2">
            <p className="text-base font-semibold">No se encontraron canciones</p>
            <p className="text-xs text-gray-400">Intenta buscando con otro término o crea una nueva canción.</p>
          </div>
        )}
      </div>
    </div>
  )
}
