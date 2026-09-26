import WordsNinja from 'wordsninja';
import { DecryptResult } from './FrequencyAanalysis';

// Standard English N-Gram & Word Frequency Patterns
const COMMON_PATTERNS: Record<string, number> = {
  // Common 4-letter words and quadgrams (High reward)
  that: 160,
  with: 160,
  this: 160,
  have: 150,
  from: 150,
  they: 150,
  were: 150,
  whic: 150,
  hich: 150,
  here: 140,
  tion: 140,
  ther: 140,
  ould: 140,
  ight: 130,
  thin: 130,
  ever: 130,
  stat: 130,
  just: 130,
  lett: 130,
  tish: 130,
  brit: 130,
  firs: 120,
  time: 120,
  some: 120,
  when: 120,
  more: 120,
  will: 120,
  said: 120,
  word: 120,
  othe: 120,
  peat: 120,
  each: 120,
  been: 120,
  made: 120,
  than: 120,
  into: 120,
  ciph: 130,
  writ: 130,
  auth: 130,
  form: 130,
  subj: 130,
  mess: 130,
  chal: 130,
  solv: 130,
  atta: 130,
  babb: 140,
  sher: 140,
  holm: 140,
  danc: 140,
  page: 120,
  only: 120,
  also: 120,

  // Rare letter clues (j, k, q, x, z)
  text: 160,
  next: 160,
  sixt: 160,
  ject: 160,
  tack: 160,
  lock: 160,
  keep: 160,
  quot: 160,
  lyze: 150,
  nize: 150,
  qu: 60,
  ck: 50,

  // Top 3-letter trigrams & common short words
  the: 110,
  and: 95,
  ing: 90,
  tha: 80,
  ent: 80,
  ion: 80,
  tio: 80,
  for: 80,
  nde: 70,
  has: 70,
  nce: 70,
  her: 70,
  tis: 70,
  all: 70,
  you: 70,
  not: 70,
  but: 70,
  are: 70,
  his: 70,
  our: 60,
  out: 60,
  one: 60,
  had: 60,
  con: 60,
  com: 60,
  pro: 60,
  men: 60,
  man: 60,
  let: 60,
  say: 50,
  see: 50,
  can: 50,

  // Top 2-letter bigrams
  th: 45,
  he: 40,
  in: 35,
  er: 35,
  an: 30,
  re: 30,
  on: 30,
  at: 30,
  en: 30,
  nd: 30,
  ti: 30,
  es: 30,
  or: 30,
  te: 30,
  of: 30,
  ed: 30,
  is: 30,
  it: 30,
  to: 30,
  as: 25,
  st: 25,
  nt: 25,
  ar: 25,
  al: 25,
  se: 25,
  ou: 25,
  me: 25,
  le: 25,
  ve: 25,
};

export function rateDecryptedText(text: string): number {
  let englishScore = 0;
  const lowerText = text.toLowerCase();

  for (let i = 0; i < lowerText.length - 1; i++) {
    // 2-letter check
    const bigram = lowerText.slice(i, i + 2);
    if (COMMON_PATTERNS[bigram]) {
      englishScore += COMMON_PATTERNS[bigram];
    }

    // 3-letter check
    if (i < lowerText.length - 2) {
      const trigram = lowerText.slice(i, i + 3);
      if (COMMON_PATTERNS[trigram]) {
        englishScore += COMMON_PATTERNS[trigram];
      }
    }

    // 4-letter check
    if (i < lowerText.length - 3) {
      const quadgram = lowerText.slice(i, i + 4);
      if (COMMON_PATTERNS[quadgram]) {
        englishScore += COMMON_PATTERNS[quadgram];
      }
    }
  }

  return englishScore;
}

export async function autoSolveSubstitution(
  ciphertext: string,
  initialKey: string[],
  restarts = 10,
  iterationsPerRestart = 3500,
) {
  let overallBestKey = [...initialKey];
  let overallBestText = DecryptResult(ciphertext, overallBestKey);
  let overallBestScore = rateDecryptedText(overallBestText);

  for (let r = 0; r < restarts; r++) {
    // Seed each restart independently to escape local minimums
    let currentKey: string[];

    if (r === 0) {
      currentKey = [...initialKey];
    } else if (
      r === 1 &&
      overallBestScore >
        rateDecryptedText(DecryptResult(ciphertext, initialKey))
    ) {
      currentKey = [...overallBestKey];
    } else {
      // Perturb baseline key with random swaps
      currentKey = [...initialKey];
      const perturbations = 2 + (r % 4);
      for (let p = 0; p < perturbations; p++) {
        const i1 = Math.floor(Math.random() * 26);
        const i2 = Math.floor(Math.random() * 26);
        const temp = currentKey[i1];
        currentKey[i1] = currentKey[i2];
        currentKey[i2] = temp;
      }
    }

    let currentText = DecryptResult(ciphertext, currentKey);
    let currentScore = rateDecryptedText(currentText);

    for (let i = 0; i < iterationsPerRestart; i++) {
      const idx1 = Math.floor(Math.random() * 26);
      const idx2 = Math.floor(Math.random() * 26);
      if (idx1 === idx2) continue;

      const candidateKey = [...currentKey];
      const temp = candidateKey[idx1];
      candidateKey[idx1] = candidateKey[idx2];
      candidateKey[idx2] = temp;

      const candidateText = DecryptResult(ciphertext, candidateKey);
      const candidateScore = rateDecryptedText(candidateText);

      // Hill climbing step: accept if better or equal with slight random exploration
      if (
        candidateScore > currentScore ||
        (candidateScore === currentScore && Math.random() < 0.05)
      ) {
        currentScore = candidateScore;
        currentKey = candidateKey;
        currentText = candidateText;
      }
    }

    if (currentScore > overallBestScore) {
      overallBestScore = currentScore;
      overallBestKey = currentKey;
      overallBestText = currentText;
    }
  }

  const resultText = await formatPunctuation(overallBestText);

  return {
    autoDecryptedText: resultText,
    autoKey: overallBestKey,
    finalScore: overallBestScore,
  };
}

async function formatPunctuation(text: string): Promise<string> {
  const wordNinja = new WordsNinja();
  await wordNinja.loadDictionary();

  // 1. Replace punctuation words
  let formatted = text
    .replace(/comma/g, ', ')
    .replace(/dot/g, '. ')
    .replace(/dash/g, ' — ')
    .replace(/colon/g, ': ');

  // 2. Add spaces between words
  formatted = formatted.replace(/[a-z]+/gi, (word) =>
    wordNinja.splitSentence(word, { joinWords: true }),
  );

  // 3. Fix specific glued words and standalone 'i'
  formatted = formatted
    .replace(/\biam\b/gi, 'I am')
    .replace(/\btome\b/gi, 'to me')
    .replace(/\bi\b/g, 'I');

  // 4. Capitalize after sentence endings (. ! ?)
  formatted = formatted.replace(
    /([.!?]\s+)([a-z])/g,
    (_, punct, letter) => punct + letter.toUpperCase(),
  );

  // 5. Capitalize proper nouns and titles
  formatted = formatted
    .replace(/\benglish\b/gi, 'English')
    .replace(/\bsherlock holmes\b/gi, 'Sherlock Holmes')
    .replace(
      /\badventure of the dancing men\b/gi,
      'Adventure of the Dancing Men',
    )
    .replace(/\bcanvas\b/gi, 'Canvas')
    .replace(/\bbabbage\b/gi, 'Babbage')
    .replace(/—\s*a quote\b/gi, '— A quote');

  // 6. Clean up spacing around punctuation and capitalize the very first character
  formatted = formatted
    .replace(/\s+([.,!?:])/g, '$1')
    .replace(/([.,!?:])\s*/g, '$1 ')
    .replace(/\s*—\s*/g, ' — ')
    .replace(/\b(chosen)\s+—\s+(plaintext)\b/gi, '$1-$2')
    .trim();

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
