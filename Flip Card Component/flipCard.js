function setupFlipCards() {
    document.querySelectorAll('.flip-button').forEach(function(button) {
        button.addEventListener('click', function() {
            this.closest('.flip-card').classList.toggle('flip');
        });
    });
}

document.addEventListener('DOMContentLoaded', setupFlipCards);


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupFlipCards
    };
}
