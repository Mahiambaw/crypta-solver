import { useEffect, useState } from 'react';
import { formatOneTimePadText } from '../util/FormatOneTimePadText';
import type { RsaSolveResult } from '../util/RsaSolve';

type RsaResultProps = {
  results: unknown;
};

export function RsaResult({ results }: RsaResultProps) {
  if (!isRsaSolveResult(results)) return null;
  return <RsaResultContent results={results} />;
}

function RsaResultContent({ results }: { results: RsaSolveResult }) {
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState({ raw: '', text: '' });

  useEffect(() => {
    let active = true;
    if (results.message) {
      void formatOneTimePadText(results.message).then((text) => {
        if (active) setFormatted({ raw: results.message, text });
      });
    }
    return () => {
      active = false;
    };
  }, [results.message]);

  const displayedMessage =
    formatted.raw === results.message ? formatted.text : results.message;

  const copyMessage = async () => {
    await navigator.clipboard.writeText(displayedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4 rounded-2xl border border-blue-900/40 bg-[#0b132b]/80 p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">RSA Result</h3>
          <p className="mt-1 text-xs text-slate-400">
            Decrypted {results.decryptedNumbers.length} ciphertext values.
          </p>
        </div>
        <button
          type="button"
          onClick={copyMessage}
          className="rounded-lg border border-blue-900/40 bg-[#0d1633] px-3 py-1.5 text-xs text-slate-200 hover:bg-[#132047]"
        >
          {copied ? 'Copied' : 'Copy message'}
        </button>
      </div>

      <div className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-blue-900/50 bg-[#060a17] p-4 font-mono text-sm leading-relaxed text-slate-200">
        {displayedMessage || 'No message decoded.'}
      </div>

      <details className="text-xs text-slate-400">
        <summary className="cursor-pointer">RSA values</summary>
        <p className="mt-3 text-slate-300">φ(N)</p>
        <p className="mt-1 break-all font-mono">{results.phiN}</p>
        <p className="mt-3 text-slate-300">Private exponent (d)</p>
        <p className="mt-1 break-all font-mono">{results.privateExponent}</p>
        <p className="mt-3 text-slate-300">Decrypted numbers</p>
        <div className="mt-1 max-h-32 overflow-auto break-all font-mono">
          {results.decryptedNumbers.join(' ')}
        </div>
      </details>
    </section>
  );
}

function isRsaSolveResult(results: unknown): results is RsaSolveResult {
  return (
    typeof results === 'object' &&
    results !== null &&
    'phiN' in results &&
    typeof results.phiN === 'number' &&
    'privateExponent' in results &&
    typeof results.privateExponent === 'number' &&
    'decryptedNumbers' in results &&
    Array.isArray(results.decryptedNumbers) &&
    results.decryptedNumbers.every((value) => typeof value === 'number') &&
    'message' in results &&
    typeof results.message === 'string'
  );
}
