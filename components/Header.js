import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-gray-800 border-b border-gray-700 mb-8">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold text-white">ForceFoundry</h1>
          </div>
          
          <nav className="flex space-x-1">
            <Link href="/" className={`px-4 py-2 rounded-lg transition-colors ${
                router.pathname === '/' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                🧘 Character Generator
            </Link>
            <Link href="/names" className={`px-4 py-2 rounded-lg transition-colors ${
                router.pathname === '/names' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                📝 Name Generator
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
