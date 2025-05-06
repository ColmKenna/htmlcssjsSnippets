# Dialog Component

## dialog.js

The `dialog.js` file handles dialog interactions, including opening, confirming, and canceling dialogs. It provides the following functions:

- `setupDialog(openBtn)`: Initializes the dialog by setting up event listeners for the open, confirm, and cancel buttons.
- `handleOpenDialog(dialog)`: Opens the dialog.
- `handleCancel(dialog, btn)`: Handles the cancel action, clears input values, and dispatches a custom event `dialogCancelled`.
- `handleConfirm(dialog, btn)`: Handles the confirm action and dispatches a custom event `dialogConfirmed`.
- `confirmedClicked(dialog, inputIds)`: Collects input values, clears inputs, and dispatches a custom event `dialogConfirmed`.
- `clearInputs(dialog)`: Clears all input values in the dialog.

## dialog.test.js

The `dialog.test.js` file tests the dialog interactions, including opening, confirming, and canceling dialogs. The tests cover the following scenarios:

- Opening the dialog on open button click.
- Canceling the dialog and clearing inputs on cancel button click.
- Confirming the dialog, collecting input values, clearing inputs, and dispatching the `dialogConfirmed` event.
- Calling `handleOpenDialog` to open the dialog.
- Calling `handleCancel` to cancel the dialog and dispatch the `dialogCancelled` event.
- Calling `handleConfirm` to confirm the dialog with the correct input IDs.
- Collecting input values with `confirmedClicked`.
- Clearing all input values with `clearInputs`.
- Initializing the dialog with a button having the `data-dialog-id` attribute.
