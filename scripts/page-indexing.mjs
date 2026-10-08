export function hasNoindex(document) {
  return [...document.querySelectorAll('meta[name="robots" i], meta[name="googlebot" i], meta[name="yandex" i]')]
    .some(meta => /\b(?:noindex|none)\b/i.test(meta.content));
}
