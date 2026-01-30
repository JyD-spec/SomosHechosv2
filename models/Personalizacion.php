<?php 

class Personalizacion {

    public static function obtener()
    {
        return [
            'font_size' => $_SESSION['font_size'] ?? '16',
            'align_chords' => $_SESSION['align_chords'] ?? 'left',
            'transpose' => $_SESSION['transpose'] ?? 0,
        ];
    }

    public static function guardar($data)
    {
        $_SESSION['font_size'] = $data['font_size'] ?? '16';
        $_SESSION['align_chords'] = $data['align_chords'] ?? 'left';
        $_SESSION['transpose'] = $data['transpose'] ?? 0;
    }
}