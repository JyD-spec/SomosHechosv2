<?php

class Borrar {

    public static function borrarPorId($id) {

        if (empty($id)) {
            return ['error' => 'ID no válido'];
        }

        // Endpoint con filtro por ID
        $url = SUPABASE_URL . '/rest/v1/Canciones?id=eq.' . urlencode($id);

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey:' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
            'Prefer: return=minimal'
        ]);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);

        if ($response === false) {
            $errorCurl = curl_error($ch);
            curl_close($ch);

            return [
                'error' => 'Error de cURL',
                'detalle' => $errorCurl
            ];
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Supabase devuelve 204 cuando borra correctamente
        if ($httpCode === 204) {
            return ['success' => true];
        }

        return [
            'error' => 'No se pudo borrar la canción',
            'detalle' => $response
        ];
    }
}
