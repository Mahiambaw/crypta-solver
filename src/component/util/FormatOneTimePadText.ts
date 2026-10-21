import WordsNinja from 'wordsninja';

let dictionary: Promise<WordsNinja> | undefined;

export async function formatOneTimePadText(text: string): Promise<string> {
  if (!text) return '';
  try {
    dictionary ??= (async () => {
      const words = new WordsNinja();
      await words.loadDictionary();
      return words;
    })();
    const words = await dictionary;
    const punctuation = text
      .replace(/comma/gi, ', ')
      .replace(/dot/gi, '. ')
      .replace(/dash/gi, ' - ')
      .replace(/colon/gi, ': ');
    return punctuation.replace(/[a-z]+/gi, (run) =>
      words.splitSentence(run, { joinWords: true }),
    )
      .replace(/\s+([,.:])/g, '$1')
      .replace(/([,.:])\s*/g, '$1 ')
      .replace(/\s*-\s*/g, ' - ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    dictionary = undefined;
    return text;
  }
}
