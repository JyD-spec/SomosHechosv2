document.addEventListener('DOMContentLoaded', () => {
    const chords = document.getElementById('chords');
    if (!chords) return;

    const fontSize = document.getElementById('fontSize');
    const alignSelect = document.getElementById('alignChords');
    const menu = document.getElementById('options-menu');
    const toggle = document.getElementById('toggleOptions');
    const transposeInput = document.getElementById('transpose');

    const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Mapa de normalización bidireccional
    const FLAT_MAP = {
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
        'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#'
    };

    let originalText = chords.innerText;

    function debounce(func, timeout = 500) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    const guardarOpciones = debounce(() => {
        const data = new FormData();
        data.append('font_size', fontSize.value);
        data.append('align_chords', alignSelect.value);
        data.append('transpose', transposeInput.value);

        fetch('../pages/guardar_personalizacion.php', {
            method: 'POST',
            body: data
        }).catch(err => console.error("Error al guardar:", err));
    });

    function transposeChord(chord, steps) {
        // Soporte para acordes con bajo: C#/F#
        if (chord.includes('/')) {
            return chord.split('/')
                .map(part => transposeChord(part, steps))
                .join('/');
        }

        // Esta Regex separa la Raíz (F#) del resto (7, m, maj7, etc.)
        const match = chord.match(/^([A-G][#b]?)(.*)$/);
        if (!match) return chord;

        let root = match[1];
        const suffix = match[2];

        // Convertir a sostenido si es bemol para buscar en NOTES
        let normalizedRoot = FLAT_MAP[root] || root;
        let index = NOTES.indexOf(normalizedRoot);
        
        if (index === -1) return chord;

        let newIndex = (index + steps + 12) % 12;
        return NOTES[newIndex] + suffix;
    }

    function transposeText(text, steps) {
        // EXPLICACIÓN DE LA REGEX:
        // ([A-G][#b]?) -> Captura la nota raíz y su alteración opcional
        // (m|maj|min|dim|aug|sus|add|alt|7|9|11|13|5|6)* -> Captura sufijos comunes
        // (?:\/[A-G][#b]?)? -> Captura bajos opcionales como /G#
        const chordRegex = /([A-G][#b]?)(m|maj|min|dim|aug|sus|add|alt|7|9|11|13|5|6)*(?:\/[A-G][#b]?)?/g;
        
        return text.replace(chordRegex, chord => {
            return transposeChord(chord, steps);
        });
    }

    // --- EVENTOS ---
    transposeInput.addEventListener('input', e => {
        const steps = parseInt(e.target.value);
        // Usamos innerHTML o textContent dependiendo de si tienes etiquetas
        chords.innerText = transposeText(originalText, steps);
        guardarOpciones();
    });

    fontSize.addEventListener('input', e => {
        chords.style.fontSize = e.target.value + 'px';
        guardarOpciones();
    });

    alignSelect.addEventListener('change', e => {
        chords.style.textAlign = e.target.value;
        guardarOpciones();
    });

    toggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        toggle.classList.toggle('menu-open');
    });
});
