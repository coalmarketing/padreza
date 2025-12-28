
const cards = document.querySelectorAll('.card');
const infos = document.querySelectorAll('.info');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const key = card.dataset.key;
        const info = document.querySelector(`.info[data-key="${key}"]`);

        const isActive = card.classList.contains('active');

        // reset všeho
        cards.forEach(c => c.classList.remove('active'));
        infos.forEach(i => i.classList.remove('active'));

        // pokud nebyla aktivní, aktivuj
        if (!isActive) {
            card.classList.add('active');
            info.classList.add('active');
        }
    });
});
