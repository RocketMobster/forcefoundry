import Link from 'next/link';
import { useRouter } from 'next/router';
import { getResourceUrl } from '../utils/paths';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-gray-800 border-b border-gray-700 mb-8 w-full">
      <div className="max-w-screen-sm mx-auto w-full px-2 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between items-center w-full">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold text-white">ForceFoundry</h1>
          </div>
          {/* Navigation moved to floating container in index.js for mobile UX */}
        </div>
      </div>
    </header>
  );
}
