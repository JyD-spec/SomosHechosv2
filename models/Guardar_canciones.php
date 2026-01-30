<?php

class Guardar {
    

    
    public static function guardar($data) {
        //Validar la captura de los datos
        if (!isset($data['verificado'])) {
            return ['error' => 'Debes marcar la casilla de Verificado para poder guardar la canción.',
                    'detalle' => 'Chequeo de seguridad'];
        }

        //Validar la captura de los datos
        if (empty($data['nombre']) || empty($data['autor']) || empty($data['acordes']) || empty($data['agregado_por']) || empty($data['tipo'])) {
            return ['error' => 'Todos los campos son obligatorios.'];
        }

        // Preparar los datos para enviar a Supabase
        $payload =[
            'name' => $data['nombre'],
            'author' => $data['autor'],
            'chords' => $data['acordes'],
            'added_by' => $data['agregado_por'],
            'type' => $data['tipo']
        ];


        //cURL
        $ch = curl_init(SUPABASE_URL . '/rest/v1/Canciones');

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'apikey:' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
            'Prefer: return=minimal'

        ]);

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
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


        //Respuesta

        if ($httpCode === 201) {
            return ['success' => true];
        } else {
            return ['error' => 'Error al guardar la canción.',
            'detalle' => $response
            ];
        }


    }

}
