import { useState } from 'react';

export type CeaserResultData = {
  decodedText: string | null;
};

export type CeaserResultsProps = {
  results: CeaserResultData | unknown | null;
};

export function CeaserResults({ results }: CeaserResultsProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isCeaserResult(results)) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-sm">
            🏛️
          </span>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Caesar Cipher Result
            </h3>
            <p className="text-xs text-slate-400">
              Decrypted using your selected shift key.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-xs py-1.5 px-3 bg-[#0d1633] hover:bg-[#132047] border border-blue-900/40 text-slate-200 font-medium rounded-lg transition cursor-pointer"
        >
          {copied ? '✓ Copied' : '📋 Copy Text'}
        </button>
      </div>

      <div className="bg-[#060a17] border border-blue-900/50 rounded-xl p-4 text-xs sm:text-sm font-mono text-slate-200 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap select-all">
        {results.decodedText}
      </div>
    </div>
  );
}

function isCeaserResult(results: unknown): results is CeaserResultData {
  return (
    typeof results === 'object' &&
    results !== null &&
    'decodedText' in results &&
    !('keyUsed' in results) &&
    !('compareFrequeniesResult' in results)
  );
}

export default CeaserResults;
