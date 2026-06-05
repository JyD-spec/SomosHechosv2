export interface Song {
  id: number;
  name: string;
  author: string;
  chords: string;
  added_by: string;
  type: 'Alabanza' | 'Adoración';
  created_at?: string;
}

export interface ServiceListItem {
  id: number;
  cancion_id: number;
  posicion_id: number;
  created_at?: string;
  Canciones?: Song; // Relationship to Song table
}
