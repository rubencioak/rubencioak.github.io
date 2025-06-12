document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
    btn.classList.add('active');
    document.getElementById(btn.getAttribute('data-tab')).style.display = 'block';
    });
});
