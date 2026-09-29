import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { formatPhone, maskPhone, deletePhoneDigit } from '../src/components/contact-request/contact-phone.ts';

test('phone mask accepts a national number and pasted +7 or 8 formats', () => {
  for (const value of ['9991234567', '+79991234567', '89991234567', '+7 (999) 123-45-67']) {
    assert.equal(formatPhone(value), '+7 (999) 123-45-67');
  }
  assert.equal(formatPhone(''), '');
  assert.equal(formatPhone('letters'), '');
  assert.equal(formatPhone('999'), '+7 (999) ');
  assert.equal(formatPhone('9991234'), '+7 (999) 123-4');
});

test('backspace crosses mask separators and deleting all digits clears the field', () => {
  const dom = new JSDOM('<input type="tel">');
  const input = dom.window.document.querySelector('input');
  input.value = '+7 (999) ';
  input.setSelectionRange(9, 9);
  const event = new dom.window.InputEvent('beforeinput', { inputType: 'deleteContentBackward', cancelable: true });
  deletePhoneDigit(event, input);
  assert.equal(event.defaultPrevented, true);
  assert.equal(input.value, '+7 (99');
  for (let i=0;i<2;i++) {
    input.setSelectionRange(input.value.length, input.value.length);
    deletePhoneDigit(new dom.window.InputEvent('beforeinput', { inputType: 'deleteContentBackward', cancelable:true }), input);
  }
  assert.equal(input.value, '');
  dom.window.close();
});

test('mask retains the caret when editing the middle of a number', () => {
  const dom = new JSDOM('<input type="tel">');
  const input = dom.window.document.querySelector('input');
  input.value = '+7 (999) 123-45-67';
  input.setSelectionRange(11, 11);
  maskPhone(input);
  assert.equal(input.selectionStart, 11);
  dom.window.close();
});
