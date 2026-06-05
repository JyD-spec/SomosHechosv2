const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const FLAT_MAP: { [key: string]: string } = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
  'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#'
};

export function transposeChord(chord: string, steps: number): string {
  // Support slash chords like C#/F#
  if (chord.includes('/')) {
    return chord
      .split('/')
      .map(part => transposeChord(part, steps))
      .join('/');
  }

  // Regex to separate the root note (e.g. F#) from suffix (e.g. m7, maj9)
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;

  const root = match[1];
  const suffix = match[2];

  // Normalize flat notes to sharps
  const normalizedRoot = FLAT_MAP[root] || root;
  const index = NOTES.indexOf(normalizedRoot);

  if (index === -1) return chord;

  const newIndex = (index + steps + 12) % 12;
  return NOTES[newIndex] + suffix;
}

export function transposeText(text: string, steps: number): string {
  if (steps === 0) return text;
  
  // Regex matches chord patterns like C, F#m, Bbmaj7, including suffixes and optional bass notes
  const chordRegex = /([A-G][#b]?)(m|maj|min|dim|aug|sus|add|alt|7|9|11|13|5|6)*(?:\/[A-G][#b]?)?/g;
  
  return text.replace(chordRegex, chord => {
    return transposeChord(chord, steps);
  });
}
