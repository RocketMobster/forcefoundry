import Link from 'next/link';
import { useRouter } from 'next/router';
import { getResourceUrl } from '../utils/paths';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-gray-800 border-b border-gray-700 mb-8">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between items-center w-full">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold text-white">ForceFoundry</h1>
          </div>
          
          <nav className="flex flex-col w-full gap-2 md:flex-row md:w-auto md:gap-1 items-center">
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
            <Link href={getResourceUrl('/info')} className={`px-3 py-2 rounded-lg transition-colors ${
                router.pathname === '/info' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`} title="App Information">
                ℹ️
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
