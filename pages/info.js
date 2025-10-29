import Layout from '../components/Layout';

export default function Info() {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">⚡ ForceFoundry</h2>
        <p className="text-gray-400">Star Wars Character & Name Generator</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        {/* Version & Developer Info */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">📋 Application Info</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Version:</span>
                <span className="ml-2 text-white font-mono bg-gray-700 px-2 py-1 rounded">v2.5.0</span>
              </div>
              <div>
                <span className="text-gray-400">Developer:</span>
                <span className="ml-2 text-white">RocketMobster</span>
              </div>
              <div>
                <span className="text-gray-400">Repository:</span>
                <a href="https://github.com/RocketMobster/forcefoundry" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="ml-2 text-blue-400 hover:text-blue-300 transition-colors">
                  GitHub
                </a>
              </div>
              <div>
                <span className="text-gray-400">Built with:</span>
                <span className="ml-2 text-white">Next.js, React, Tailwind CSS</span>
              </div>
            </div>
          </div>
          {/* Features */}
          <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-400">🚀 Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Species-specific name generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Dual stat systems (Traditional RPG & SWTOR)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Force system integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Lightsaber color generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Character export (JSON)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Responsive design</span>
              </li>
            </ul>
          </div>
          {/* License */}
          <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">📄 License</h3>
            <div className="text-gray-300 text-sm leading-relaxed">
              <p className="mb-3">
                This project is licensed under the <strong>MIT License</strong>.
              </p>
              <p className="mb-3">
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software.
              </p>
              <p className="text-xs text-gray-400">
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
              </p>
            </div>
          </div>
          {/* Acknowledgments */}
          <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">🌟 Acknowledgments</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• Star Wars universe © Lucasfilm Ltd.</p>
              <p>• Star Wars: The Old Republic © BioWare & EA</p>
              <p>• Built with open-source technologies</p>
              <p>• Community feedback and contributions</p>
              <p>• Special thanks to the Star Wars RPG community</p>
            </div>
          </div>
        </div>
        {/* Fun Stats */}
        <div className="mt-8 bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-center text-red-400">⚡ Fun Stats</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 text-center">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">15+</div>
              <div className="text-sm text-gray-400">Species Supported</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">10</div>
              <div className="text-sm text-gray-400">Lightsaber Colors</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">4</div>
              <div className="text-sm text-gray-400">Character Classes</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">∞</div>
              <div className="text-sm text-gray-400">Name Combinations</div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>May the Force be with you, always. 🌟</p>
        </div>
    </>
  );
}
