export function decryptWithKey(text: string, shift: number) {
  let decodedText = '';
  if (!text.trim()) {
    return null;
  }
  for (let i = 0; i < text.length; i++) {
    const code = text[i].toLowerCase().charCodeAt(0);
    if (code >= 97 && code <= 122) {
      const decodeNumber = ((code - 97 - shift + 26) % 26) + 97;
      decodedText += String.fromCharCode(decodeNumber);
    } else {
      decodedText += text[i];
    }
  }
  return decodedText;
}
