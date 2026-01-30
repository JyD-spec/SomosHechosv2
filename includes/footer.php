    <script>
        document.addEventListener('input', function (e) {
            if (e.target.classList.contains('auto-grow')) {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }
        });
    </script>


    <footer class="footer">
        <p>&copy; 2026 HCC. Todos los derechos reservados.</p>
    </footer>
    <!-- Bootstrap JS Bundle with Popper -->
     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <!-- Custom JS -->
     <script src="<?= BASE_URL ?>assets/js/options.js"></script>
</body>
</html>