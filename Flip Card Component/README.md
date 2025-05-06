# Flip Card Component

## flipCard.js

The `flipCard.js` file handles the interactions for the flip card component. It sets up event listeners for the flip buttons and toggles the "flip" class on the parent flip-card element when a button is clicked.

### Functions

- `setupFlipCards()`: Initializes the flip card interactions by adding event listeners to all elements with the class `flip-button`. When a flip button is clicked, it toggles the "flip" class on the closest parent element with the class `flip-card`.

## flipCard.test.js

The `flipCard.test.js` file contains tests for the flip card interactions. It uses the Jest testing framework to ensure that the flip card component behaves as expected.

### Tests

- **Clicking a flip button toggles the "flip" class on the parent flip-card**: This test checks that clicking a flip button adds the "flip" class to the parent flip-card element and clicking it again removes the "flip" class.
- **Clicking each flip button toggles the "flip" class on the correct parent flip-card**: This test ensures that each flip button correctly toggles the "flip" class on its respective parent flip-card element.
