function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
}