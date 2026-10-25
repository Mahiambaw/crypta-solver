function findFactors(n: number) {
  for (let testNumber = 2; testNumber * testNumber <= n; testNumber++) {
    if (n % testNumber === 0) {
      return [testNumber, n / testNumber];
    }
  }
  return;
}

export function getPhiN(n: number) {
  const factors = findFactors(n);
  if (factors === undefined) return;

  const [p, q] = factors;
  return (p - 1) * (q - 1);
}

function findPrivateKey(e: number, phiN: number) {
  for (let d = 1; d < phiN; d++) {
    if ((e * d) % phiN === 1) {
      return d;
    }
  }
  return;
}

function decryptCipherBlockToNumber(
  cipherNumber: number,
  d: number,
  N: number,
) {
  let result = 1;
  let base = cipherNumber % N;
  let exponent = d;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % N;
    }
    base = (base * base) % N;
    exponent = Math.floor(exponent / 2);
  }

  return result;
}
type DecryptedRsaMessage = {
  decryptedNumbers: number[];
  message: string;
};

function decryptRsaMessage(
  cipherText: string,
  d: number,
  N: number,
): DecryptedRsaMessage {
  const cipherNumbers = cipherText
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(Number);

  const decryptedNumbers = cipherNumbers.map((cipherNumber) =>
    decryptCipherBlockToNumber(cipherNumber, d, N),
  );

  const message = decryptedNumbers
    .map((number) => String.fromCharCode(number))
    .join('');

  return { decryptedNumbers, message };
}

export type RsaSolveResult = DecryptedRsaMessage & {
  phiN: number;
  privateExponent: number;
};

export function solveRsaCipher(
  cipherText: string,
  e: number,
  N: number,
): RsaSolveResult | undefined {
  const phiN = getPhiN(N);
  if (phiN === undefined) return;

  const privateExponent = findPrivateKey(e, phiN);
  if (privateExponent === undefined) return;

  return {
    phiN,
    privateExponent,
    ...decryptRsaMessage(cipherText, privateExponent, N),
  };
}
