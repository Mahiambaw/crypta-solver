import { useState } from 'react';

export type frequencyAanalysisSolverData = {
  percentageCalculatorResult: number[];
  compareFrequeniesResult: {
    keys: number[];
    alpahbetKeys: string[];
  };
  decryptResult: string;
  autoResult?: {
    autoDecryptedText: string;
    autoKey: string[];
    finalScore: number;
  };
};

type FrequencyAanalysisSolverResultsProps = {
  results: frequencyAanalysisSolverData | unknown | null;
};

export function FrequencyAanalysisResult({
  results,
}: FrequencyAanalysisSolverResultsProps) {
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  if (!isFrequencyAanalysisResult(results)) {
    return null;
  }

  const decryptedMessage =
    results.autoResult?.autoDecryptedText || results.decryptResult;
  const keyString =
    results.autoResult?.autoKey?.join('') ||
    results.compareFrequeniesResult.alpahbetKeys.join('');
  const score = results.autoResult?.finalScore ?? 0;

  const handleCopyDecryptedText = async () => {
    if (!decryptedMessage) return;
    await navigator.clipboard.writeText(decryptedMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyKey = async () => {
    if (!keyString) return;
    await navigator.clipboard.writeText(keyString);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleDownloadText = () => {
    if (!decryptedMessage) return;
    const element = document.createElement('a');
    const file = new Blob(
      [
        `CIPHER DECRYPTION REPORT\nScore: ${score}\nOptimized Key: ${keyString}\n\nDECRYPTED TEXT:\n${decryptedMessage}\n`,
      ],
      { type: 'text/plain' },
    );
    element.href = URL.createObjectURL(file);
    element.download = 'decrypted-cipher-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Letters A to Z data for the vertical bar chart
  const letterData = Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    const percentage = results.percentageCalculatorResult[i] || 0;
    return { letter, percentage };
  });

  return (
    <div className="space-y-6">
      {/* 1. HERO CARD: Auto-Solved Decryption */}
      <div className="bg-[#0b132b]/80 border border-blue-900/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-5">
        {/* Card Header: Green Check Badge + Score Badge */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-base shadow-md shadow-emerald-500/20">
              ✓
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Auto-Solved Decryption
              </h2>
              <p className="text-xs text-slate-400">
                The cipher has been successfully decrypted using frequency
                analysis.
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-mono text-xs sm:text-sm font-semibold shadow-inner">
            Score: <span className="font-bold">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Decrypted Text Box */}
        <div className="bg-[#060a17] border border-blue-900/50 rounded-xl p-4 sm:p-5 text-xs sm:text-sm font-mono text-slate-200 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap select-all shadow-inner">
          {decryptedMessage}
        </div>

        {/* Optimized Key Chip Row */}
        <div className="bg-[#070e24] border border-blue-900/40 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🔑</span>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                Optimized Key
              </h4>
              <p className="text-[11px] text-slate-400">
                Mapping from ciphertext letters to plaintext letters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#060a17] border border-blue-900/60 rounded-lg px-3 py-1.5 font-mono text-xs text-sky-300 font-semibold tracking-wider max-w-[220px] truncate">
              {keyString}
            </div>
            <button
              type="button"
              onClick={handleCopyKey}
              title="Copy Key"
              className="p-1.5 bg-[#0d1633] hover:bg-blue-600/30 text-slate-300 hover:text-white rounded-lg border border-blue-900/40 transition cursor-pointer"
            >
              📋
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopyDecryptedText}
            className="flex-1 min-w-[140px] py-2.5 px-4 bg-[#0d1633] hover:bg-[#132047] border border-blue-900/40 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:border-blue-500/40"
          >
            📋 {copiedText ? 'Copied Text!' : 'Copy Decrypted Text'}
          </button>

          <button
            type="button"
            onClick={handleDownloadText}
            className="flex-1 min-w-[140px] py-2.5 px-4 bg-[#0d1633] hover:bg-[#132047] border border-blue-900/40 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:border-blue-500/40"
          >
            💾 Download as Text
          </button>

          <button
            type="button"
            onClick={handleCopyKey}
            className="py-2.5 px-4 bg-[#0d1633] hover:bg-[#132047] border border-blue-900/40 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:border-blue-500/40"
          >
            🔑 {copiedKey ? 'Key Copied!' : 'Copy Key'}
          </button>
        </div>
      </div>

      {/* 2. ANALYSIS DETAILS & 26-LETTER VERTICAL BAR CHART */}
      <div className="bg-[#0b132b]/80 border border-blue-900/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
        {/* Details Header with Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
              📊
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Analysis Details
              </h3>
              <p className="text-xs text-slate-400">
                Explore the letter frequencies from your ciphertext.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1 cursor-pointer font-medium"
          >
            {showDetails ? 'Hide Details ▲' : 'Show Details ▼'}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 tracking-wide">
                Letter Frequency (Ciphertext)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                A — Z Distribution
              </span>
            </div>

            {/* Vertical 26-Bar Chart Container */}
            <div className="bg-[#060a17] border border-blue-900/40 rounded-xl p-4 sm:p-5 relative">
              {/* Chart Grid with Y-Axis and Bars */}
              <div className="flex h-44 items-end gap-1.5 sm:gap-2">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between h-full text-[10px] text-slate-500 font-mono pr-2 border-r border-slate-800 select-none pb-5">
                  <span>25%</span>
                  <span>20%</span>
                  <span>15%</span>
                  <span>10%</span>
                  <span>5%</span>
                  <span>0%</span>
                </div>

                {/* 26 Vertical Bars (A to Z) */}
                <div className="flex-1 flex items-end justify-between h-full pb-5 relative">
                  {/* Subtle horizontal grid lines */}
                  <div className="absolute inset-x-0 top-0 border-b border-slate-800/40 pointer-events-none" />
                  <div className="absolute inset-x-0 top-1/5 border-b border-slate-800/40 pointer-events-none" />
                  <div className="absolute inset-x-0 top-2/5 border-b border-slate-800/40 pointer-events-none" />
                  <div className="absolute inset-x-0 top-3/5 border-b border-slate-800/40 pointer-events-none" />
                  <div className="absolute inset-x-0 top-4/5 border-b border-slate-800/40 pointer-events-none" />

                  {letterData.map((item) => {
                    // Maximum scale is 25% for chart height
                    const heightPercent = Math.min(
                      100,
                      (item.percentage / 25) * 100,
                    );
                    const hasFrequency = item.percentage > 0;

                    return (
                      <div
                        key={item.letter}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-7 bg-slate-900 border border-blue-500/50 text-sky-300 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                          {item.letter}: {item.percentage.toFixed(1)}%
                        </div>

                        {/* Bar */}
                        <div
                          style={{
                            height: hasFrequency
                              ? `${Math.max(6, heightPercent)}%`
                              : '2px',
                          }}
                          className={`w-full max-w-[14px] rounded-t transition-all duration-300 ${
                            hasFrequency
                              ? 'bg-gradient-to-t from-blue-600 to-sky-400 shadow-sm shadow-blue-500/30 group-hover:from-blue-500 group-hover:to-sky-300'
                              : 'bg-slate-800/50'
                          }`}
                        />

                        {/* Letter Label */}
                        <span className="absolute -bottom-5 text-[10px] font-mono font-medium text-slate-400 group-hover:text-sky-300 transition">
                          {item.letter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function isFrequencyAanalysisResult(
  results: unknown,
): results is frequencyAanalysisSolverData {
  return (
    typeof results === 'object' &&
    results !== null &&
    'compareFrequeniesResult' in results
  );
}

export default FrequencyAanalysisResult;
