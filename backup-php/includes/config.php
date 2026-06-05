<?php
session_start();
define('BASE_URL', '/ProyectosDeHTML/ProyectoHCC/');
define('ROOT_PATH', dirname(__DIR__));
define('INCLUDES_PATH', ROOT_PATH . '/includes');
define('MODELS_PATH', ROOT_PATH . '/models');

define('SUPABASE_URL', 'https://tztymszjnbcqemrevkfv.supabase.co');
define('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dHltc3pqbmJjcWVtcmV2a2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MjQwOTIsImV4cCI6MjA4NDEwMDA5Mn0.br0EDFW9D68ck87EAiGvIju5ZXVUwRtjQn93tv-G2IM');