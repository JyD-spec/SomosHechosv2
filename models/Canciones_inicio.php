<?php

class Lista {

    public static function obtenerTodas($search = null) {

        $url = SUPABASE_URL . '/rest/v1/Canciones?select=*';

        if (!empty($search)){
            $searchTerm = urlencode('*' . $search . '*');
            $url .= "&or=(name.ilike.{$searchTerm},author.ilike.{$searchTerm})";
        }

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if ($httpCode === 200) {
            return json_decode($response, true);
        }

        return [];
    }
}

