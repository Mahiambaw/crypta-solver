declare module 'wordsninja' {
  export default class WordsNinja {
    loadDictionary(): Promise<void>;

    splitSentence(text: string, options?: { joinWords?: boolean }): string;
  }
}
