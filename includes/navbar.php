<?php $pagina = basename($_SERVER['PHP_SELF']); ?>

<header>
    <nav class="navbar navbar-expand-lg ">
        <div class="container-fluid">
            <a class="navbar-brand" href="#"><i class="fas fa-church"></i> Hechos Comunidad Cristiana</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="<?= BASE_URL ?>index.php">Inicio</a>
                </li>
                <li class="nav-item">
                <a class="nav-link <?= $pagina == 'list.php' ? 'active' : '' ?>" href="<?= BASE_URL ?>pages/list.php">Listado de Servicio</a>
                </li>
                <li class="nav-item ">
                <a class="nav-link <?= $pagina == 'add.php' ? 'active' : '' ?>" href="<?= BASE_URL ?>pages/add.php">Agregar Acordes</a>
                </li>
            </ul>
            <form class="d-flex" role="search" action="<?= BASE_URL ?>index.php" method="GET">
                <input class="form-control search-input me-2" type="search" name="q" placeholder="Buscar Canciones" aria-label="Search" value="<?= isset($_GET['q']) ? htmlspecialchars($_GET['q']) : '' ?>"/>
                <button class="btn btn-success d-flex align-items-center gap-2" type="submit">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>Buscar</span>
                </button>
            </form>
            <!-- Botón para alternar tema claro/oscuro -->
            <div class="ms-3 d-flex align-items-center">
                <button id="themeToggle" class="btn btn-outline-success" style="border-radius: 50%; width: 40px; height: 40px; padding: 0;">☀️</button>
            </div>
            </div>
        </div>
    </nav>                                          
</header>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    // Determina tema por preferencia o localStorage
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored : (prefersDark ? 'dark' : 'light');

    const apply = (theme) => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    };

    apply(initial);

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const isDark = document.body.classList.contains('dark-mode');
        const next = isDark ? 'light' : 'dark';
        apply(next);
        localStorage.setItem('theme', next);
    });
});
</script>