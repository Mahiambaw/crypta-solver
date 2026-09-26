import { useState } from 'react';

export type VigenereResultData = {
  decodedText: string | null;
  keyUsed?: string;
};

export type VigenereResultsProps = {
  results: VigenereResultData | unknown | null;
};

export function VigenereCipherResolver({ results }: VigenereResultsProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isVigenereResult(results)) {
    return null;
  }

  const handleCopy = async () => {
    if (!results.decodedText) return;
    await navigator.clipboard.writeText(results.decodedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b132b]/80 border border-blue-900/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
            🔑
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Vigenère Decryption Result
            </h3>
            {results.keyUsed && (
              <p className="text-xs text-slate-400">
                Passphrase:{' '}
                <span className="text-sky-300 font-mono font-semibold">
                  {results.keyUsed}
                </span>
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-xs py-1.5 px-3 bg-[#0d1633] hover:bg-[#132047] border border-blue-900/40 text-slate-200 font-medium rounded-lg transition cursor-pointer"
        >
          {copied ? '✓ Copied Text' : '📋 Copy Text'}
        </button>
      </div>

      {/* Decrypted Text Display Box */}
      <div className="bg-[#060a17] border border-blue-900/50 rounded-xl p-4 sm:p-5 text-xs sm:text-sm font-mono text-slate-200 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap select-all shadow-inner">
        {results.decodedText}
      </div>
    </div>
  );
}

function isVigenereResult(results: unknown): results is VigenereResultData {
  return (
    typeof results === 'object' &&
    results !== null &&
    'decodedText' in results &&
    'keyUsed' in results
  );
}

export default VigenereCipherResolver;
