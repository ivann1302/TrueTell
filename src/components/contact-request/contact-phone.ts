export function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (value.trim().startsWith('+7') || (digits.length === 11 && /^[78]/.test(digits))) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return '';
  let result = `+7 (${digits.slice(0, 3)}`;
  if (digits.length >= 3) result += ') ';
  if (digits.length > 3) result += digits.slice(3, 6);
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
}

export function maskPhone(input: HTMLInputElement) {
  const raw = input.value;
  const caret = input.selectionStart ?? raw.length;
  const before = raw.slice(0, caret);
  let count = before.replace(/\D/g, '').length;
  const digits = raw.replace(/\D/g, '');
  if (raw.trim().startsWith('+7') || (digits.length === 11 && /^[78]/.test(digits))) count = Math.max(0, count - 1);
  input.value = formatPhone(raw);
  // Locate the same national digit after inserting punctuation.
  let position = input.value ? 4 : 0;
  let seen = 0;
  while (position < input.value.length && seen < count) {
    if (/\d/.test(input.value[position])) seen++;
    position++;
  }
  if (caret === raw.length) position = input.value.length;
  input.setSelectionRange(position, position);
}

export function deletePhoneDigit(event: InputEvent, input: HTMLInputElement) {
  if (!['deleteContentBackward', 'deleteContentForward'].includes(event.inputType)) return;
  const start = input.selectionStart ?? 0;
  if (start !== input.selectionEnd) return;
  const backward = event.inputType === 'deleteContentBackward';
  let position = backward ? start - 1 : start;
  while (position >= 4 && position < input.value.length && !/\d/.test(input.value[position])) position += backward ? -1 : 1;
  event.preventDefault();
  if (position < 4 || position >= input.value.length) return;
  input.value = input.value.slice(0, position) + input.value.slice(position + 1);
  input.setSelectionRange(position, position);
  maskPhone(input);
}
