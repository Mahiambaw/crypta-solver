import { useEffect, useMemo, useState } from 'react';
import { formatOneTimePadText } from '../util/FormatOneTimePadText';
import {
  countOneTimePadCipherBlocks,
  decryptOneTimePad,
  oneTimePadKeyToLetters,
  type OneTimePadResultData,
} from '../util/OneTimePadSolver';

export type { OneTimePadResultData };

type OneTimePadResultProps = {
  results: unknown;
};

export function OneTimePadResult({ results }: OneTimePadResultProps) {
  if (!isOneTimePadResult(results)) return null;
  return <OneTimePadResultContent results={results} />;
}

function OneTimePadResultContent({
  results,
}: {
  results: OneTimePadResultData;
}) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [formatted, setFormatted] = useState({ raw: '', text: '' });
  const totalBlocks = countOneTimePadCipherBlocks(results.cipherText);
  const recoveredCount = results.derivedKey.length;
  const keyLetters = oneTimePadKeyToLetters(results.derivedKey);
  const keyBinary = results.derivedKey
    .map((value) => value.toString(2).padStart(5, '0'))
    .join(' ');
  const blockMatches = results.blockMatches;
  const decoded = useMemo(() => {
    try {
      return {
        text: decryptOneTimePad(results.cipherText, results.derivedKey),
        error: '',
      };
    } catch (error) {
      return {
        text: '',
        error:
          error instanceof Error
            ? error.message
            : 'Unable to decrypt the message.',
      };
    }
  }, [results.cipherText, results.derivedKey]);
  const decodedText = decoded.text;

  useEffect(() => {
    let active = true;
    if (decodedText) {
      void formatOneTimePadText(decodedText).then((text) => {
        if (active) setFormatted({ raw: decodedText, text });
      });
    }
    return () => {
      active = false;
    };
  }, [decodedText]);

  const displayedText =
    formatted.raw === decodedText ? formatted.text : decodedText;

  const copyKey = async () => {
    if (!keyLetters) return;
    await navigator.clipboard.writeText(keyLetters);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyMessage = async () => {
    if (!displayedText) return;
    await navigator.clipboard.writeText(displayedText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const boxClass =
    'bg-[#060a17] border border-blue-900/50 rounded-xl p-4 text-xs font-mono leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap break-words select-all';
  const buttonClass =
    'text-xs py-1.5 px-3 bg-[#0d1633] hover:bg-[#132047] border border-blue-900/40 text-slate-200 rounded-lg cursor-pointer';

  return (
    <div className="bg-[#0b132b]/80 border border-blue-900/40 rounded-2xl p-6 shadow-2xl space-y-5">
      <h3 className="text-sm sm:text-base font-semibold text-white">
        One-Time Pad Result
      </h3>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-xs font-semibold text-slate-300">
            Recovered values ({recoveredCount})
          </h4>
          <button type="button" onClick={copyKey} className={buttonClass}>
            {copiedKey ? 'Copied' : 'Copy recovered values'}
          </button>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-300">Recovered key — letters</p>
          <div className={`${boxClass} text-sky-300 break-all`}>
            {keyLetters || 'No values recovered.'}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-300">Same key — 5-bit binary</p>
          <div className={`${boxClass} text-slate-200`}>{keyBinary || '—'}</div>
        </div>
        <details className="text-xs text-slate-400">
          <summary className="cursor-pointer">
            Match key values to ciphertext blocks
          </summary>
          <p className="mt-2">
            Recovered key values are listed first. Reused values appear only
            when the final three recovered values match.
          </p>
          <div className="mt-2 max-h-64 overflow-auto rounded border border-blue-900/50">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[#060a17] text-slate-300">
                <tr>
                  <th className="px-3 py-2">Block</th>
                  <th className="px-3 py-2">Cipher</th>
                  <th className="px-3 py-2">Key</th>
                  <th className="px-3 py-2">Source</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {blockMatches.map((match) => (
                  <tr
                    key={match.blockNumber}
                    className="border-t border-blue-900/30"
                  >
                    <td className="px-3 py-1.5">{match.blockNumber}</td>
                    <td className="px-3 py-1.5">{match.cipherBlock}</td>
                    <td className="px-3 py-1.5">
                      {match.keyValue === null
                        ? 'Unknown'
                        : `${match.keyValue === 0 ? 'space' : oneTimePadKeyToLetters([match.keyValue])} (${match.keyValue})`}
                    </td>
                    <td className="px-3 py-1.5">
                      {match.reused
                        ? 'Reused'
                        : match.keyValue === null
                          ? 'Unavailable'
                          : 'Recovered'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <details className="text-xs text-slate-400">
          <summary className="cursor-pointer">
            Decimal key and ciphertext
          </summary>
          <p className="mt-2 text-slate-300">Recovered key — decimal numbers</p>
          <p className="mt-1 font-mono break-words">
            {results.derivedKey.join(' ') || '—'}
          </p>
          <p className="mt-3 text-slate-300">Ciphertext used — 5-bit blocks</p>
          <div className={`${boxClass} mt-2`}>
            {results.slicedCipherText || 'No complete blocks.'}
          </div>
        </details>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-xs font-semibold text-slate-300">
            Decrypted message
          </h4>
          <button type="button" onClick={copyMessage} className={buttonClass}>
            {copiedMessage ? 'Copied' : 'Copy text'}
          </button>
        </div>
        {decoded.error ? (
          <p role="alert" className="text-xs text-amber-300">
            {decoded.error}
          </p>
        ) : (
          <>
            <p className="text-xs text-slate-400">
              Decoded {decodedText.length} of {totalBlocks} blocks.
            </p>
            <div className={`${boxClass} text-slate-200 max-h-72`}>
              {displayedText || 'No message decoded yet.'}
            </div>
          </>
        )}
        {decodedText.includes('�') && (
          <p role="alert" className="text-xs text-amber-300">
            Some decoded values are outside the letter alphabet, shown as �.
            Check your input.
          </p>
        )}
      </section>
    </div>
  );
}

function isOneTimePadResult(results: unknown): results is OneTimePadResultData {
  return (
    typeof results === 'object' &&
    results !== null &&
    'cipherText' in results &&
    typeof results.cipherText === 'string' &&
    'knownPlainText' in results &&
    typeof results.knownPlainText === 'string' &&
    'slicedCipherText' in results &&
    typeof results.slicedCipherText === 'string' &&
    'derivedKey' in results &&
    Array.isArray(results.derivedKey) &&
    'blockMatches' in results &&
    Array.isArray(results.blockMatches)
  );
}

export default OneTimePadResult;
