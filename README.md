# Substitution Cipher Solver

A simple web application built with **React**, **TypeScript**, and **Tailwind CSS** that automatically solves substitution ciphers.

## What it does

- Takes encrypted ciphertext as input.
- Uses letter frequency analysis to find how often each letter appears.
- Uses a hill climbing algorithm to test letter swaps and find the correct decryption key.
- Displays the decrypted message in readable English with proper spaces and punctuation.
- Shows a bar chart of letter frequencies (A to Z).
- Allows you to copy the decrypted text or key with one click.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite

## How to run it

```bash
git clone https://github.com/<YOUR_USERNAME>/cipher-solver.git
cd cipher-solver
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
