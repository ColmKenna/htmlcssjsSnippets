/**
 * @jest-environment jsdom
 */
const dialogModule = require('./dialog');
const {
  setupDialog,
  handleOpenDialog,
  handleCancel,
  handleConfirm,
  confirmedClicked,
  clearInputs
} = dialogModule;

describe('Dialog Component', () => {
  let dialog, openBtn, cancelBtn, confirmBtn, input1, input2;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="openBtn" data-dialog-id="testDialog">Open</button>
      <dialog id="testDialog">
        <input id="input1" value="foo" />
        <input id="input2" value="bar" />
        <button class="cancelBtn" data-input-ids="input1,input2">Cancel</button>
        <button class="confirmBtn" data-input-ids="input1,input2">Confirm</button>
      </dialog>
    `;
    dialog = document.getElementById('testDialog');
    openBtn = document.getElementById('openBtn');
    cancelBtn = dialog.querySelector('.cancelBtn');
    confirmBtn = dialog.querySelector('.confirmBtn');
    input1 = dialog.querySelector('#input1');
    input2 = dialog.querySelector('#input2');
    setupDialog(openBtn);
    // Mock dialog.showModal and close for jsdom
    dialog.showModal = jest.fn();
    dialog.close = jest.fn();


  });

  test('opens dialog on open button click', () => {
    openBtn.click();
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('cancels dialog and clears inputs on cancel button click', () => {
    // Set initial values for inputs
    input1.value = 'abc';
    input2.value = 'def';
    const cancelSpy = jest.fn();
    dialog.addEventListener('dialogCancelled', cancelSpy);
    cancelBtn.click();
    expect(dialog.close).toHaveBeenCalled();
    expect(input1.value).toBe('');
    expect(input2.value).toBe('');
    expect(cancelSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        dialogId: 'testDialog',
        values: { input1: 'abc', input2: 'def' }
      }
    }));
  });

  test('confirms dialog, collects input values, clears inputs, and dispatches event', () => {
    input1.value = 'val1';
    input2.value = 'val2';
    const confirmSpy = jest.fn();
    dialog.addEventListener('dialogConfirmed', confirmSpy);
    confirmBtn.click();
    expect(dialog.close).toHaveBeenCalled();
    expect(input1.value).toBe('');
    expect(input2.value).toBe('');
    expect(confirmSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        dialogId: 'testDialog',
        values: { input1: 'val1', input2: 'val2' }
      }
    }));
  });

  test('handleOpenDialog calls showModal', () => {
    handleOpenDialog(dialog);
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('handleCancel calls close and dispatches event', () => {
    const cancelSpy = jest.fn();
    dialog.addEventListener('dialogCancelled', cancelSpy);
    handleCancel(dialog,cancelBtn);
    expect(dialog.close).toHaveBeenCalled();
    expect(cancelSpy).toHaveBeenCalled();
  });

  test('handleConfirm calls confirmedClicked with correct inputIds', () => {
    
    var called = false;
    dialog.addEventListener('dialogConfirmed', (e) => {
      expect(e.detail.dialogId).toBe(dialog.id);
      expect(e.detail.values).toEqual({ input1: 'val1', input2: 'val2' });
      called = true;
    });

    input1.value = 'val1';
    input2.value = 'val2';

    handleConfirm(dialog, confirmBtn);
    expect(called).toBe(true);
  });

  test('confirmedClicked collects input values', () => {

    var called = false;
    dialog.addEventListener('dialogCancelled', (e) => {
      expect(e.detail.dialogId).toBe(dialog.id);
      expect(e.detail.values).toEqual({ input1: 'val1', input2: 'val2' });
      called = true;
    });

    input1.value = 'val1';
    input2.value = 'val2';
    handleCancel(dialog, cancelBtn);
    expect(dialog.close).toHaveBeenCalled();
    expect(called).toBe(true);
    
    });



  test('confirmedClicked collects only existing input values', () => {
    input1.value = 'x';
    input2.remove();
    const confirmSpy = jest.fn();
    dialog.addEventListener('dialogConfirmed', confirmSpy);
    confirmedClicked(dialog, ['input1', 'input2']);
    expect(confirmSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        dialogId: 'testDialog',
        values: { input1: 'x' }
      }
    }));
  });

  test('clearInputs clears all input values', () => {
    input1.value = 'a';
    input2.value = 'b';
    clearInputs(dialog);
    expect(input1.value).toBe('');
    expect(input2.value).toBe('');
  });

  test('button with data-dialog-id attribute initializes dialog', () => { 
    const newOpenBtn = document.createElement('button');
    newOpenBtn.id = 'newOpenBtn';
    newOpenBtn.setAttribute('data-dialog-id', 'testDialog2');
    document.body.appendChild(newOpenBtn);
    setupDialog(newOpenBtn);
    expect(newOpenBtn.dataset.dialogId).toBe('testDialog2');
  });

  
});
