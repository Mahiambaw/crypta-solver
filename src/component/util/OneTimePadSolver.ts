export type OneTimePadResultData = {
  cipherText: string;
  knownPlainText: string;
  slicedCipherText: string;
  derivedKey: number[];
  blockMatches: OneTimePadBlockMatch[];
};

export type OneTimePadBlockMatch = {
  blockNumber: number;
  cipherBlock: string;
  keyValue: number | null;
  reused: boolean;
};

export function solveOneTimePadKey(
  cipherText: string,
  knownPlainText: string,
): OneTimePadResultData {
  const plainValues = encodeOneTimePadText(knownPlainText.replace(/\s/g, ''));
  const cipherBlocks = getBinaryBlocks(cipherText);
  const slicedCipherBlocks = cipherBlocks.slice(0, plainValues.length);
  const derivedKey: number[] = [];

  for (let i = 0; i < slicedCipherBlocks.length; i++) {
    const plainCharCode = plainValues[i];
    const cipherCharCode = parseInt(slicedCipherBlocks[i], 2);
    derivedKey.push(plainCharCode ^ cipherCharCode);
  }

  return {
    cipherText,
    knownPlainText,
    slicedCipherText: slicedCipherBlocks.join(' '),
    derivedKey,
    blockMatches: matchCipherBlocksToKey(cipherText, derivedKey),
  };
}

export function encodeOneTimePadText(text: string) {
  if (!/^[a-z ]*$/i.test(text)) {
    throw new Error('The 5-bit alphabet supports A–Z and spaces only.');
  }
  return Array.from(text.toLowerCase(), (char) =>
    char === ' ' ? 0 : char.charCodeAt(0) - 96,
  );
}

export function oneTimePadKeyToLetters(key: number[]) {
  return key
    .map((value) =>
      value === 0 ? ' ' : value <= 26 ? String.fromCharCode(96 + value) : '�',
    )
    .join('');
}

export function decryptOneTimePad(cipherText: string, key: number[]) {
  if (key.length === 0) {
    return '';
  }

  const cipherBlocks = getBinaryBlocks(cipherText);
  if (cipherBlocks.length > key.length) {
    const ending = key.slice(-3);
    if (ending.length < 3 || ending.some((value) => value !== ending[0])) {
      throw new Error(
        'Cannot continue the recovered values: the last three values are not the same. Check the end of your known sentence for an extra or mistyped letter, or provide a longer known sentence.',
      );
    }
  }
  let decodedText = '';

  for (let i = 0; i < cipherBlocks.length; i++) {
    const keyValue = key[Math.min(i, key.length - 1)];

    const cipherCharCode = parseInt(cipherBlocks[i], 2);

    decodedText += oneTimePadKeyToLetters([cipherCharCode ^ keyValue]);
  }

  return decodedText;
}

function getBinaryBlocks(cipherText: string) {
  const blocks = cipherText.match(/[01]{8}/g) ?? [];
  // Each input byte has three leading padding bits; keep its five data bits.
  return blocks.map((block) => block.slice(3));
}

export function countOneTimePadCipherBlocks(cipherText: string) {
  return getBinaryBlocks(cipherText).length;
}

export function matchCipherBlocksToKey(
  cipherText: string,
  key: number[],
): OneTimePadBlockMatch[] {
  const cipherBlocks = getBinaryBlocks(cipherText);
  const ending = key.slice(-3);
  const canReuseFinalValue =
    ending.length === 3 && ending.every((value) => value === ending[0]);

  return cipherBlocks.map((cipherBlock, index) => {
    const isRecovered = index < key.length;
    return {
      blockNumber: index + 1,
      cipherBlock,
      keyValue: isRecovered
        ? key[index]
        : canReuseFinalValue
          ? key[key.length - 1]
          : null,
      reused: !isRecovered && canReuseFinalValue,
    };
  });
}
