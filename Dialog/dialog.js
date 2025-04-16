// Dialog JS for reusable dialogs by dialog id

function setupDialog(openBtn) {
  const dialogId = openBtn.getAttribute('data-dialog-id');
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  openBtn.addEventListener('click', () => handleOpenDialog(dialog));

  // Cancel buttons inside this dialog
  dialog.querySelectorAll('.cancelBtn').forEach(btn => {
    btn.addEventListener('click', () => handleCancel(dialog, btn));
  });

  // Confirm button inside this dialog
  const confirmBtn = dialog.querySelector('.confirmBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => handleConfirm(dialog, confirmBtn));
  }
}

function handleOpenDialog(dialog) {
  dialog.showModal();
}

function handleCancel(dialog, cancelbtn) {
    const values = {};
    const inputIds = (cancelbtn.dataset.inputIds || '').split(',').filter(Boolean);
    inputIds.forEach(id => {
      const input = dialog.querySelector(`#${id}`);
      if (input) values[id] = input.value;
    });
  clearInputs(dialog);
  dialog.close();
  const cancelEvent = new CustomEvent('dialogCancelled', {
    detail: { dialogId: dialog.id , values }
  });
  dialog.dispatchEvent(cancelEvent);
}

function handleConfirm(dialog, confirmBtn) {
  const inputIds = (confirmBtn.dataset.inputIds || '').split(',').filter(Boolean);
  confirmedClicked(dialog, inputIds);
}

function confirmedClicked(dialog, inputIds) {
  const values = {};
  inputIds.forEach(id => {
    const input = dialog.querySelector(`#${id}`);
    if (input) values[id] = input.value;
  });
  clearInputs(dialog);
  dialog.close();
  console.log('Confirmed!');
  console.log('Dialog ID:', dialog.id);
  console.log('Input Values:', values);
  const confirmEvent = new CustomEvent('dialogConfirmed', {
    detail: { dialogId: dialog.id, values }
  });
  dialog.dispatchEvent(confirmEvent);
}

function clearInputs(dialog) {
  dialog.querySelectorAll('input').forEach(input => input.value = '');
}

// Initialize all dialogs
document.querySelectorAll('[data-dialog-id]').forEach(setupDialog);

// For testability
if (typeof module !== 'undefined') {
  module.exports = {
    setupDialog,
    handleOpenDialog,
    handleCancel,
    handleConfirm,
    confirmedClicked,
    clearInputs
  };
}
