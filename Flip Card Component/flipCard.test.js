/**
 * @jest-environment jsdom
 */
const {
  setupFlipCards,
} = require('./flipCard.js');


describe('Flip Card Functionality', () => {
  beforeEach(() => {
    // Reset the DOM before each test
    document.documentElement.innerHTML = `<div class="flip-card-container">
    <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">
                <div>Front Side</div>
                <button class="flip-button">Flip to Back</button>
            </div>
            <div class="flip-card-back">
                <div>Back Side</div>
                <button class="flip-button">Flip to Front</button>
            </div>
        </div>
    </div>
</div>`
    // Re-run the setup function after resetting the DOM
    setupFlipCards();
  });

  test('clicking a flip button toggles the "flip" class on the parent flip-card', () => {
    const flipButton = document.querySelector('.flip-button');
    const flipCard = flipButton.closest('.flip-card');

    expect(flipCard.classList.contains('flip')).toBe(false);

    flipButton.click();

    expect(flipCard.classList.contains('flip')).toBe(true);

    flipButton.click();

    expect(flipCard.classList.contains('flip')).toBe(false);
  });

  test('clicking each flip button toggles the "flip" class on the correct parent flip-card', () => {
    const flipButtons = document.querySelectorAll('.flip-button');
    const flipCards = document.querySelectorAll('.flip-card');

    expect(flipButtons.length).toBe(2);
    expect(flipCards.length).toBe(1);

    flipButtons.forEach((button) => {
      const flipCard = button.closest('.flip-card');
      expect(flipCard.classList.contains('flip')).toBe(false);
      button.click();
      expect(flipCard.classList.contains('flip')).toBe(true);
      button.click();
      expect(flipCard.classList.contains('flip')).toBe(false);
    });
  });
});
