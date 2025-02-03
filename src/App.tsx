import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { BookDetails } from './components/BookDetails';
import { Library } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <a href='/' className="flex items-center gap-2">
              <Library className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-800">Digital Library</h1>
            </a>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;