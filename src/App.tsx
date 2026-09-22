import Navbar from './component/navbar/Navbar';
import CipherContainer from './component/contianer/CipherContainer';

import './App.css';

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#070b14] text-slate-100 ">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          <CipherContainer />
        </main>
      </div>
    </>
  );
}

export default App;
