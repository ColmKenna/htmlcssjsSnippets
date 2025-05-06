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

## Sample Usage

Here is a sample usage demonstrating how to use the dialog component in an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dialog Confirm Example</title>
  <link rel="stylesheet" href="dialog.css">
</head>
<body>
  <button id="openDialog" data-dialog-id="formDialog">Open Dialog</button>

  <dialog id="formDialog">
    <div class="dialog-content">
      <h2>Confirm Action</h2>

      <label for="username">Username</label>
      <input type="text" id="username" name="username">

      <label for="email">Email</label>
      <input type="email" id="email" name="email">

      <p>Are you sure you want to continue?</p>
      <div class="dialog-buttons">
        <button id="formDialog-confirm" class="confirmBtn" data-input-ids="username,email">Confirm</button>
        <button type="button" class="cancelBtn" data-input-ids="username,email">Cancel</button>
      </div>
    </div>
  </dialog>

  <script src="dialog.js"></script>
  <script>
    // Add example event listeners for dialog events
    const formDialog = document.getElementById('formDialog');
    if (formDialog) {
      formDialog.addEventListener('dialogConfirmed', (e) => {
        console.log('Confirm Event Caught:', e.detail);
      });

      formDialog.addEventListener('dialogCancelled', (e) => {
        console.log('Cancel Event Caught:', e.detail);
      });
    }
  </script>
</body>
</html>
```
