type CipherFormProps = {
  text: string;
  keyText: number;
  subKey: string;
  knownPlainText: string;
  cipherType: string;
  setText: (value: string) => void;
  setKeyText: (value: number) => void;
  setSubKey: (value: string) => void;
  setKnownPlainText: (value: string) => void;
  setCipherType: (value: string) => void;
  onAnalyze: () => void;
  onClear?: () => void;
  isLoading?: boolean;
};

const CHALLENGE_1_CIPHERTEXT =
  'OYOIULXONYOWSIOBOTUSOUONBLBRROKNYEEBLWBTUSCIEEEDYKBIXYKNUXBLOYXNPEYILOBROYQOYKVKUHHYYLOQNBPYXXPNJYXBNYOUPBLXONBWYOBIXKIUEULZYYZYWB';

const CHALLENGE_2_VIGENERE_CIPHERTEXT =
  'RFCTYIQVNWKZVZALQDCUBEQMFSRIHSKVITKNMKYFMKWTSSOINAHELHAXTMEAGUWYWPMKYOAVZXALQZYEBXPMIIMUIFLKMKJSYUUGKJWFLOUVXGYNMBYHYQLJHILHAXTMMWTIMCBWFMRSFGTXZGATIFBKKHBPPIFKHSMLVQQBBAGXUNJLNMNLXILHATDMJSKVBHLRFMLLAVAVHVKLIGKUWMKEEPUINFBXMVAUZMMLZTTEUVUZXRLBUXTMJGECAXEGQTFWGKEHYOPWNAMJMXTWFPYNBXMGLVQWLSVCMFPKTBHGMGZHCMPMAGHUAXJYDQNQTWBXYEXTXGMKWJBSFMWZTITXZFMJVSZVKHTQMBBWYZZLAOZWQFMFMOLVNZYSDKPXCMSMHWKVKBWLQZWGEFVHUIANNZXDWLAWUVAMERZVOEDIWLXIQLAMOAIXMYMTYXANXWVZXALVUVAALKPXZXDWHYVFVOPGFQIFIFALLWEMXTRVDXYCBMLKHEKHTQMMPWGDWWLVMBYDRRKJBEUVNWWNQMOMFKIEFRBAHXTMCKTSTXASOWHKMICVAEOQJZXIEAPGTVITHUGXSWQKUFWVKBWLQZXGMPWNOEHMJJHMMGASNMUXHIUBKENTYSGUAAYIILWGWVJKLEWMLAGUMXKHABNZXEMQAGTIFDXEOXPWMSHGPELTZLBTUAGKMQAEFBUUDUWMFSGNCFWRTEALQKFMXJGHBRQMXXHIAHSZUVAUKPXMVGTIFDXEOXALDMYOBKPMOITMFHHWBAPWWMSUHCWGCIDVUE';

function CipherForm({
  text,
  keyText,
  subKey,
  knownPlainText,
  cipherType,
  setText,
  setKeyText,
  setSubKey,
  setKnownPlainText,
  setCipherType,
  onAnalyze,
  onClear,
  isLoading = false,
}: CipherFormProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === 'cipherText') {
      setText(value);
    }
    if (name === 'keyText') {
      setKeyText(Number(value));
    }
    if (name === 'subKey') {
      setSubKey(value);
    }
    if (name === 'knownPlainText') {
      setKnownPlainText(value);
    }
    if (name === 'cipherType') {
      setCipherType(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    onAnalyze();
  };

  const handleClearClick = () => {
    onClear?.();
  };

  const handleLoadExample = () => {
    if (cipherType === 'vigenere') {
      setText(CHALLENGE_2_VIGENERE_CIPHERTEXT);
      setSubKey('TRITHEMIUS');
    } else {
      setText(CHALLENGE_1_CIPHERTEXT);
      setCipherType('frequency Analysis');
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0b132b]/80 border border-blue-900/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6"
      >
        {/* Step 1: Enter Ciphertext */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/30">
                1
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Enter Ciphertext
                </h3>
                <p className="text-xs text-slate-400">
                  Paste your encrypted text below. Only letters will be analyzed.
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Characters: {text.length}
            </span>
          </div>

          <textarea
            name="cipherText"
            value={text}
            onChange={handleChange}
            rows={5}
            disabled={isLoading}
            className="w-full bg-[#060a17] border border-blue-900/50 rounded-xl p-4 text-xs font-mono text-slate-200 tracking-wider resize-none focus:outline-none focus:border-blue-500 transition leading-relaxed disabled:opacity-50"
            placeholder="Type or paste encrypted text here..."
          />
        </div>

        {/* Step 2: Cipher Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/30">
              2
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Cipher Type</h3>
              <p className="text-xs text-slate-400">
                Select the type of cipher to use.
              </p>
            </div>
          </div>

          <select
            name="cipherType"
            value={cipherType}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full bg-[#060a17] border border-blue-900/50 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
          >
            <option value="frequency Analysis">
              📊 Frequency Analysis (Substitution)
            </option>
            <option value="vigenere">
              🔑 Vigenère Cipher (Passphrase)
            </option>
            <option value="caesar">🏛️ Caesar Cipher</option>
            <option value="oneTimePad">🧮 One-Time Pad</option>
          </select>
        </div>

        {/* Caesar Cipher Shift Input (if selected) */}
        {cipherType === 'caesar' && (
          <div className="space-y-2 bg-[#060a17] border border-blue-900/40 rounded-xl p-3.5">
            <label className="text-xs text-slate-300 font-medium block">
              Shift key (0 to 25):
            </label>
            <input
              type="number"
              name="keyText"
              value={keyText}
              min={0}
              max={25}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full bg-[#0b132b] border border-blue-900/60 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              placeholder="e.g. 3"
            />
          </div>
        )}

        {/* Vigenère Cipher Passphrase Input (if selected) */}
        {cipherType === 'vigenere' && (
          <div className="space-y-2 bg-[#060a17] border border-blue-900/40 rounded-xl p-3.5">
            <label className="text-xs text-slate-300 font-medium block">
              Secret Passphrase / Key:
            </label>
            <input
              type="text"
              name="subKey"
              value={subKey}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full bg-[#0b132b] border border-blue-900/60 rounded-lg px-3 py-2 text-sm text-white font-mono uppercase tracking-wider focus:outline-none focus:border-blue-500"
              placeholder="e.g. TRITHEMIUS"
            />
          </div>
        )}

        {/* One-Time Pad Known Plaintext Input (if selected) */}
        {cipherType === 'oneTimePad' && (
          <div className="space-y-3 bg-[#060a17] border border-blue-900/40 rounded-xl p-3.5">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs text-slate-300 font-medium block">
                Known plaintext:
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Characters: {knownPlainText.length}
              </span>
            </div>
            <textarea
              name="knownPlainText"
              value={knownPlainText}
              disabled={isLoading}
              rows={3}
              onChange={handleChange}
              className="w-full bg-[#0b132b] border border-blue-900/60 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Paste the first known plaintext sentence..."
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2.5 text-base transition-all cursor-pointer ${
              isLoading
                ? 'bg-blue-600/50 text-sky-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 hover:from-blue-500 hover:to-sky-300 text-white shadow-blue-500/30 transform hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Decrypting Cipher...</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Decrypt</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearClick}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-[#0d1633] hover:bg-[#132047] border border-blue-900/40 text-slate-300 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              🗑 Clear Text
            </button>
            <button
              type="button"
              onClick={handleLoadExample}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-[#0d1633] hover:bg-[#132047] border border-blue-900/40 text-slate-300 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              📄 Load Example
            </button>
          </div>
        </div>
      </form>

      {/* Simon Singh Cryptography Quote Card with Sherlock Detective Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0b132b] via-[#091024]/95 to-[#040714] border border-blue-900/40 rounded-2xl p-6 shadow-xl text-slate-300 min-h-[160px] flex flex-col justify-between">
        <div
          className="absolute inset-0 bg-cover bg-right-top opacity-40 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: "url('/detective.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b132b] via-[#0b132b]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-start gap-4">
          <span className="text-3xl text-blue-400/80 font-serif leading-none">
            “
          </span>
          <div className="space-y-2 max-w-[280px] sm:max-w-[340px]">
            <p className="text-xs sm:text-sm italic text-slate-200 leading-relaxed font-medium">
              The art of cryptography is the art of thinking.
            </p>
            <p className="text-[11px] text-sky-400 font-semibold">
              — Simon Singh
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
          <span>Curiosity Decodes The World</span>
          <span className="text-blue-400/60">——</span>
        </div>
      </div>
    </div>
  );
}

export default CipherForm;
