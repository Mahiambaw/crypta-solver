function Navbar() {
  return (
    <>
      <header className="w-full bg-[#0a0f1d] border-b border-slate-800 px-4 py-3  sm:px-6 md:px-8 md:py-4 flex items-center justify-between ">
        <section className="flex items-center gap-2.5 text-white">
          <span>🔒</span>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide leading-tight">
              Substitution Cipher Solver
            </h1>
            <p className="text-[11px] text-slate-400 font-normal">
              Analyze, Decrypt and Learn
            </p>
          </div>
        </section>
        <nav>
          <ul className="flex items-center justify-evenly gap-6  sm:gap-6 list-none text-xs sm:text-sm md:text-base">
            <li>
              <a className="text-blue-400 font-medium" href="/">
                Home
              </a>
            </li>
            <li>
              <a
                className="text-slate-400 hover:text-white transition"
                href="/How It Wworks"
              >
                {' '}
                How It Works
              </a>
            </li>
            <li>
              <a
                className="text-slate-400 hover:text-white transition"
                href="/About"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
