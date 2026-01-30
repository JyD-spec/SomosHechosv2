<?php

class Listado_servicio {

    // 1. Obtener el listado completo
    public static function generarListado() {
        // Cambiado a ListadoDeServicio
        $url = SUPABASE_URL . '/rest/v1/ListadoDeServicio?select=*,Canciones(*)&order=posicion_id.asc';

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 

        $response = curl_exec($ch);
        return json_decode($response, true) ?: [];
    }

    // 2. Quitar de la lista (Mejorado: usamos el ID de la fila, no el de la canción)
    public static function quitarDeListado($id_fila) {
        // Es mejor borrar por el ID único de la fila en la tabla ListadoDeServicio
        // así, si una canción está dos veces, solo borras la que elegiste.
        $url = SUPABASE_URL . '/rest/v1/ListadoDeServicio?id=eq.' . $id_fila;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return ($httpCode === 204 || $httpCode === 200);
    }

    // 3. Agregar a la lista
    public static function agregar($cancionId) {
        $actuales = self::generarListado();
        $nuevaPosicion = count($actuales) + 1;

        $payload = [
            'cancion_id' => $cancionId,
            'posicion_id' => $nuevaPosicion
        ];

        // Cambiado a ListadoDeServicio
        $ch = curl_init(SUPABASE_URL . '/rest/v1/ListadoDeServicio');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        curl_exec($ch);
        curl_close($ch);
    }

    public static function mover($id_fila, $direccion) {
    $listado = self::generarListado();
    
        // Encontrar el índice de la canción que queremos mover
        $indiceActual = -1;
        foreach ($listado as $key => $item) {
            if ($item['id'] == $id_fila) {
                $indiceActual = $key;
                break;
            }
        }

        $nuevoIndice = ($direccion === 'up') ? $indiceActual - 1 : $indiceActual + 1;

        // Verificar que el movimiento sea posible
        if (isset($listado[$nuevoIndice])) {
            $itemActual = $listado[$indiceActual];
            $itemDestino = $listado[$nuevoIndice];

            // Intercambiar posicion_id en la base de datos
            self::actualizarPosicion($itemActual['id'], $itemDestino['posicion_id']);
            self::actualizarPosicion($itemDestino['id'], $itemActual['posicion_id']);
        }
    }

    private static function actualizarPosicion($id, $nuevaPos) {
        $url = SUPABASE_URL . '/rest/v1/ListadoDeServicio?id=eq.' . $id;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH"); // Usamos PATCH para actualizar solo una columna
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['posicion_id' => $nuevaPos]));
        curl_exec($ch);
        curl_close($ch);
    }

    public static function vaciarListado() {
        // Usamos el filtro 'id=neq.0' para indicar que borre todo donde el ID no sea 0 (o sea, todo)
        $url = SUPABASE_URL . '/rest/v1/ListadoDeServicio?id=neq.0';
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
            'Content-Type: application/json'
        ]);
        
        // El método para borrar en la API de Supabase es DELETE
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $httpCode >= 200 && $httpCode < 300;
    }
}






