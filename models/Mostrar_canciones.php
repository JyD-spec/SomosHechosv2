<?php

class Mostrar
{
    public static function obtenerPorId($id)
    {
        if (empty($id)) {
            return null;
        }

        $url = SUPABASE_URL . '/rest/v1/Canciones?id=eq.' . intval($id) . '&select=*';

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if ($httpCode !== 200) {
            return null;
        }

        $data = json_decode($response, true);

        // Supabase devuelve un array, aunque sea un solo registro
        return $data[0] ?? null;
    }
}
