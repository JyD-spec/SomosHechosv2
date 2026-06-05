<?php

class Editar {
    

    
    public static function editar($data) {

        if (empty($data['id'])){
            return ['error' => 'No se proporcionó un ID valido para actulizar'];
        }
        //Validar la captura de los datos
        if (!isset($data['verificado'])) {
            return ['error' => 'Debes marcar la casilla de Verificado para poder actualizar la canción.',
                    'detalle' => 'Chequeo de seguridad'];
        }

        //Validar la captura de los datos
        if (empty($data['nombre']) || empty($data['autor']) || empty($data['acordes']) || empty($data['tipo'])) {
            return ['error' => 'Todos los campos son obligatorios.'];
        }

        // Preparar los datos para enviar a Supabase
        $payload = [
            'name' => $data['nombre'],
            'author' => $data['autor'],
            'chords' => $data['acordes'],
            'type' => $data['tipo']
        ];

        $url = SUPABASE_URL . '/rest/v1/Canciones?id=eq.' . $data['id'];
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'apikey:' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
            'Prefer: return=minimal'

        ]);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);


        //Respuesta

        if ($httpCode === 204 || $httpCode === 200) {
            return ['success' => true];
        } else {
            return ['error' => 'Error al actualizar la canción.',
            'detalle' => $response
            ];
        }


    }

}