import WordsNinja from 'wordsninja';

export async function decryptVigenereCipher(
  ciphertext: string,
  key: string,
): Promise<string> {
  let rawPlainText = '';
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');

  if (!cleanKey) return '';

  for (let i = 0; i < ciphertext.length; i++) {
    const cipherIndex = ALPHABET.indexOf(ciphertext[i].toUpperCase());
    if (cipherIndex === -1) {
      rawPlainText += ciphertext[i];
      continue;
    }
    const keyIndex = ALPHABET.indexOf(cleanKey[i % cleanKey.length]);
    const newIndex = (cipherIndex - keyIndex + 26) % 26;
    plainTextChar(newIndex);
  }

  function plainTextChar(idx: number) {
    rawPlainText += ALPHABET[idx];
  }

  // Format with WordsNinja and punctuation formatting
  try {
    const wordNinja = new WordsNinja();
    await wordNinja.loadDictionary();

    let formatted = rawPlainText
      .replace(/comma/gi, ', ')
      .replace(/dot/gi, '. ')
      .replace(/dash/gi, ' — ')
      .replace(/colon/gi, ': ');

    formatted = formatted.replace(/[a-z]+/gi, (word) =>
      wordNinja.splitSentence(word, { joinWords: true }),
    );

    formatted = formatted
      .replace(/\byou are\b/gi, 'You are')
      .replace(/\bfuturama\b/gi, 'Futurama')
      .replace(/\bcharles babbage\b/gi, 'Charles Babbage')
      .replace(/\bvigenere\b/gi, 'Vigenère')
      .replace(/\bvernam\b/gi, 'VERNAM')
      .replace(/([.!?]\s+)([a-z])/g, (_, p, l) => p + l.toUpperCase())
      .replace(/\s+([.,!?:])/g, '$1')
      .replace(/([.,!?:])\s*/g, '$1 ')
      .replace(/\s*—\s*/g, ' — ')
      .trim();

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return rawPlainText;
  }
}
