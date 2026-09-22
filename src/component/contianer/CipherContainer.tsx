import { useState } from 'react';
import CipherForm from '../form/CipherForm';

import { CeaserResults, type CeaserResultData } from '../result/CeaserResults';
import {
  FrequencyAanalysisResult,
  type frequencyAanalysisSolverData,
} from '../result/FrequencyAanalysisSolverResult';
import { decryptWithKey } from '../util/CeaserSolver';
import { frequencyAanalysisSolver } from '../util/FrequencyAanalysis';

function CipherContainer() {
  const [results, setResult] = useState<
    CeaserResultData | frequencyAanalysisSolverData | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = async (
    encryptedText: string,
    cipherType: string,
    key?: number,
  ) => {
    setIsLoading(true);
    setResult(null);

    try {
      if (cipherType === 'caesar') {
        const output = decryptWithKey(encryptedText, key ?? 0);
        setResult({ decodedText: output });
        return;
      }

      if (cipherType === 'frequency Analysis') {
        // Yield to allow the browser to paint the loading spinner immediately
        await new Promise((resolve) => setTimeout(resolve, 60));
        const output = await frequencyAanalysisSolver(encryptedText);
        setResult(output);
        return;
      }

      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column (5 cols): Input Form & Quote */}
      <div className="lg:col-span-5 space-y-6">
        <CipherForm
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          isLoading={isLoading}
        />
      </div>

      {/* Right Column (7 cols): Decrypted Output & Frequency Bar Chart */}
      <div className="lg:col-span-7 space-y-6">
        {/* Animated Circular Loading State */}
        {isLoading && (
          <div className="bg-[#0b132b]/80 border border-blue-500/40 rounded-2xl p-10 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center space-y-5">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing glow ring */}
              <div className="w-16 h-16 rounded-full bg-blue-500/20 animate-ping absolute" />
              {/* Rotating Circular Spinner */}
              <div className="w-14 h-14 rounded-full border-4 border-blue-900/60 border-t-sky-400 border-r-blue-500 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-wide flex items-center justify-center gap-2">
                <span>Decrypting Ciphertext</span>
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </span>
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Running letter frequency calculations and multi-restart hill
                climbing heuristic search...
              </p>
            </div>

            <div className="w-full max-w-xs bg-[#060a17] border border-blue-900/40 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 h-full w-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Empty State when no results yet and not loading */}
        {!results && !isLoading && (
          <div className="bg-[#0b132b]/50 border border-slate-800/60 border-dashed rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xl font-mono mx-auto flex items-center justify-center">
              🔒
            </div>
            <h3 className="text-sm font-semibold text-slate-300">
              Ready to Decrypt
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Paste your ciphertext or click{' '}
              <strong className="text-slate-400">Load Example</strong> on the
              left, then click{' '}
              <strong className="text-blue-400">Decrypt</strong> to see the
              auto-solved results and frequency analysis.
            </p>
          </div>
        )}

        {/* Solver Results */}
        {!isLoading && (
          <>
            <CeaserResults results={results} />
            <FrequencyAanalysisResult results={results} />
          </>
        )}
      </div>
    </div>
  );
}

export default CipherContainer;
