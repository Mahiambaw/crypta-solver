import { autoSolveSubstitution } from './AutoSubstitutionSolver';

export async function frequencyAanalysisSolver(text: string) {
  if (!text.trim()) {
    return null;
  }
  const textEmptySpaceCountResult = textAndEmptySpaceCount(text);
  const percentageCalculatorResult = percentageCalculator(
    text,
    textEmptySpaceCountResult.alphabetCount,
    textEmptySpaceCountResult.emptySpace,
  );

  const compareFrequeniesResult = compareFrequencies(
    percentageCalculatorResult,
  );
  const decryptResult = DecryptResult(
    text,
    compareFrequeniesResult.alpahbetKeys,
  );
  const autoResult = await autoSolveSubstitution(
    text,
    compareFrequeniesResult.alpahbetKeys,
  );
  console.log(decryptResult);
  return {
    percentageCalculatorResult,
    compareFrequeniesResult,
    decryptResult,
    autoResult,
  };
}

function textAndEmptySpaceCount(text: string) {
  const alphabetCount: number[] = new Array(26).fill(0);
  const emptySpace: number[] = [];

  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ' || text[i] === '\n') {
      emptySpace.push(i);
    } else {
      const alphabetNumber = text[i].toLowerCase().charCodeAt(0) - 97;
      if (alphabetNumber >= 0 && alphabetNumber < 26) {
        alphabetCount[alphabetNumber]++;
      }
    }
  }
  return { alphabetCount, emptySpace };
}
function percentageCalculator(
  text: string,
  alphabetCount: number[],
  emptySpace: number[],
) {
  const percentages: number[] = [];
  const totalLetters = text.length - emptySpace.length;
  for (let i = 0; i < alphabetCount.length; i++) {
    percentages.push((alphabetCount[i] / totalLetters) * 100);
  }
  return percentages;
}

function compareFrequencies(percentages: number[]) {
  // 1. English letters pre-sorted from highest to lowest frequency
  const englishOrder = [
    'e',
    't',
    'a',
    'o',
    'i',
    'n',
    's',
    'h',
    'r',
    'd',
    'l',
    'c',
    'u',
    'm',
    'w',
    'f',
    'g',
    'y',
    'p',
    'b',
    'v',
    'k',
    'j',
    'x',
    'q',
    'z',
  ];

  // 2. Pair each ciphertext letter index (0 = a, 1 = b...) with its % and sort descending
  const sortedCipher = percentages
    .map((percentage, index) => ({ index, percentage }))
    .sort((a, b) => b.percentage - a.percentage);

  // 3. Prepare the 26-letter substitution map
  const alpahbetKeys: string[] = new Array(26);
  const keys: number[] = new Array(26);

  // 4. Match Rank 0 to Rank 0, Rank 1 to Rank 1, etc.
  for (let i = 0; i < 26; i++) {
    const cipherIndex = sortedCipher[i].index;
    const englishLetter = englishOrder[i];

    alpahbetKeys[cipherIndex] = englishLetter;
    keys[cipherIndex] = englishLetter.charCodeAt(0) - 97;
  }

  return { keys, alpahbetKeys };
}

export function DecryptResult(text: string, alphabetKey: string[]) {
  let decyrptText = '';
  for (let i = 0; i < text.length; i++) {
    const alphabet = text[i].toLowerCase();
    const alpahbetNumber = alphabet.charCodeAt(0) - 97;
    if (alpahbetNumber >= 0 && alpahbetNumber <= 25) {
      const decruptedAlphabet = alphabetKey[alpahbetNumber];
      decyrptText = decyrptText + decruptedAlphabet;
    } else {
      decyrptText = decyrptText + text[i];
    }
  }
  return decyrptText;
}
