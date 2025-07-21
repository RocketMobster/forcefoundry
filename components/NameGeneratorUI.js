import { useState, useEffect } from 'react';
import canonNamesData from '../data/canon_names.json';
import maleFirstNames from '../data/male_first_names.json';
import maleLastNames from '../data/male_last_names.json';
import femaleFirstNames from '../data/female_first_names.json';
import femaleLastNames from '../data/female_last_names.json';
import otherNamesNeutral from '../data/other_names_neutral.json';

const availableSpecies = Object.keys(maleFirstNames);

function isCanonName(name, species = null) {
  // Check for exact match or wildcard match (e.g., * Skywalker)
  // First, check the specific species if provided
  if (species && canonNamesData[species]) {
    for (const canon of canonNamesData[species]) {
      if (canon.startsWith('* ')) {
        const suffix = canon.slice(2).trim();
        if (name.endsWith(suffix)) return true;
      } else if (canon === name) {
        return true;
      }
    }
  }
  
  // Then check Special and Human/Common as fallbacks
  const fallbackSpecies = ['Special', 'Human/Common'];
  for (const fallback of fallbackSpecies) {
    if (canonNamesData[fallback]) {
      for (const canon of canonNamesData[fallback]) {
        if (canon.startsWith('* ')) {
          const suffix = canon.slice(2).trim();
          if (name.endsWith(suffix)) return true;
        } else if (canon === name) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export default function NameGeneratorUI() {
  const [names, setNames] = useState([]);
  const [gender, setGender] = useState('Male');
  const [species, setSpecies] = useState('Random Mix');
  const [quantity, setQuantity] = useState(18);
  const [loading, setLoading] = useState(false);

  const getRandom = (arr) => {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const getNameFromSpecies = (nameData, species, fallbackSpecies = 'Human/Common') => {
    if (nameData[species] && nameData[species].length > 0) {
      return getRandom(nameData[species]);
    }
    if (nameData[fallbackSpecies] && nameData[fallbackSpecies].length > 0) {
      return getRandom(nameData[fallbackSpecies]);
    }
    const available = Object.keys(nameData).find(key => nameData[key] && nameData[key].length > 0);
    if (available) {
      return getRandom(nameData[available]);
    }
    return 'Unknown';
  };

  const generateNames = () => {
    setLoading(true);
    const newNames = [];
    const firstNameData = gender === 'Male' ? maleFirstNames : femaleFirstNames;
    const lastNameData = gender === 'Male' ? maleLastNames : femaleLastNames;
    for (let i = 0; i < quantity; i++) {
      let firstName, lastName, selectedSpecies;
      if (species === 'Crazy Mix') {
        const firstNameSpecies = getRandom(availableSpecies);
        const lastNameSpecies = getRandom(availableSpecies);
        firstName = getNameFromSpecies(firstNameData, firstNameSpecies);
        lastName = getNameFromSpecies(lastNameData, lastNameSpecies);
        selectedSpecies = `${firstNameSpecies}/${lastNameSpecies}`;
      } else if (species === 'Random Mix') {
        selectedSpecies = getRandom(availableSpecies);
        firstName = getNameFromSpecies(firstNameData, selectedSpecies);
        lastName = getNameFromSpecies(lastNameData, selectedSpecies);
      } else {
        selectedSpecies = species;
        firstName = getNameFromSpecies(firstNameData, selectedSpecies);
        lastName = getNameFromSpecies(lastNameData, selectedSpecies);
      }
      // Check for name variations
      const speciesForCheck = species === 'Random Mix' ? selectedSpecies : species;
      const speciesExistsInAllFiles = speciesForCheck === 'Crazy Mix' || (
        (maleFirstNames[speciesForCheck] && maleFirstNames[speciesForCheck].length > 0) &&
        (femaleFirstNames[speciesForCheck] && femaleFirstNames[speciesForCheck].length > 0) &&
        (maleLastNames[speciesForCheck] && maleLastNames[speciesForCheck].length > 0) &&
        (femaleLastNames[speciesForCheck] && femaleLastNames[speciesForCheck].length > 0) &&
        (otherNamesNeutral[speciesForCheck] && otherNamesNeutral[speciesForCheck].length > 0)
      );
      let neutralNames = [];
      if (species === 'Crazy Mix') {
        const neutralSpecies = getRandom(availableSpecies);
        neutralNames = otherNamesNeutral[neutralSpecies] || [];
      } else if (speciesExistsInAllFiles) {
        neutralNames = otherNamesNeutral[speciesForCheck] || [];
      }
      let finalName = '';
      let nameType = 'standard';
      const variationChance = Math.random();
      if (variationChance < 0.03 && neutralNames.length > 0) {
        const middleName = getRandom(neutralNames);
        finalName = `${firstName} ${middleName} ${lastName}`;
        nameType = 'middle';
      } else if (variationChance < 0.06 && neutralNames.length > 0) {
        const otherFirst = getRandom(neutralNames);
        finalName = `${otherFirst}-${firstName} ${lastName}`;
        nameType = 'hyphenated-prefix-first';
      } else if (variationChance < 0.09 && neutralNames.length > 0) {
        const otherFirst = getRandom(neutralNames);
        finalName = `${firstName}-${otherFirst} ${lastName}`;
        nameType = 'hyphenated-suffix-first';
      } else if (variationChance < 0.12 && neutralNames.length > 0) {
        const otherLast = getRandom(neutralNames);
        finalName = `${firstName} ${otherLast}-${lastName}`;
        nameType = 'hyphenated-prefix-last';
      } else if (variationChance < 0.15 && neutralNames.length > 0) {
        const otherLast = getRandom(neutralNames);
        finalName = `${firstName} ${lastName}-${otherLast}`;
        nameType = 'hyphenated-suffix-last';
      } else if (variationChance < 0.18 && species === 'Crazy Mix') {
        const randomSpecies1 = getRandom(availableSpecies);
        const randomSpecies2 = getRandom(availableSpecies);
        const lastName1 = getNameFromSpecies(lastNameData, randomSpecies1);
        const lastName2 = getNameFromSpecies(lastNameData, randomSpecies2);
        finalName = `${firstName} ${lastName1}-${lastName2}`;
        nameType = 'crazy-cross-species';
        selectedSpecies = `${selectedSpecies}+${randomSpecies1}/${randomSpecies2}`;
      } else {
        finalName = `${firstName} ${lastName}`;
      }
      newNames.push({
        id: i + 1,
        name: finalName,
        gender: gender.toLowerCase(),
        species: selectedSpecies,
        nameType: nameType
      });
    }
    setNames(newNames);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">⭐ Star Wars Name Generator</h2>
          <p className="text-gray-400">Generate authentic Star Wars character names</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-end gap-6 justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Random Mix">Random Mix</option>
                {availableSpecies.map(speciesName => (
                  <option key={speciesName} value={speciesName}>{speciesName}</option>
                ))}
                <option value="Crazy Mix">Crazy Mix (Cross-Species)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
              <input
                type="number"
                min="5"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 18)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={generateNames}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
        {species === 'Crazy Mix' && (
          <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">🌪️</span>
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">Crazy Mix Mode</h3>
                <p className="text-orange-200 text-sm mb-2">
                  This mode creates wild cross-species combinations by mixing first names, last names, 
                  and middle/hyphenated elements from different Star Wars species!
                </p>
                <p className="text-orange-300 text-xs italic">
                  Example: "Anakin Greedo-Chewbacca" (Human first + Rodian-Wookiee last)
                </p>
              </div>
            </div>
          </div>
        )}
        {names.length > 0 && (
          <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Gender:</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full font-medium">{gender}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Species:</span>
                <span className="bg-purple-600 text-white px-2 py-1 rounded-full font-medium">{species}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Count:</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded-full font-medium">{quantity} names</span>
              </div>
            </div>
          </div>
        )}
        {names.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {names.map((nameObj) => (
              <div
                key={nameObj.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">#{nameObj.id}</div>
                  <div className="text-xs text-blue-400 font-semibold">{nameObj.gender}</div>
                </div>
                <div className="mb-4">
                  <div className={`text-2xl font-bold mb-2 leading-tight ${isCanonName(nameObj.name, nameObj.species) ? 'text-yellow-300 bg-yellow-900/40 px-2 py-1 rounded shadow border border-yellow-400 animate-pulse' : 'text-white'}`}
                    title={isCanonName(nameObj.name, nameObj.species) ? 'Canon Star Wars name!' : undefined}
                  >
                    {nameObj.name}
                    {isCanonName(nameObj.name, nameObj.species) && (
                      <span className="ml-2 text-yellow-400" title="Canon Name">★</span>
                    )}
                  </div>
                  {isCanonName(nameObj.name, nameObj.species) && (
                    <div className="text-xs text-yellow-200 mt-1">Canon Star Wars character name</div>
                  )}
                  {/* Debug: log to console if canon (moved to generation logic) */}
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm font-medium">{nameObj.species}</span>
                </div>
                {nameObj.nameType !== 'standard' && (
                  <div className="mt-4 p-3 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <div className="text-xs text-gray-300 font-medium">
                      {nameObj.nameType === 'middle' && '✨ Contains middle name'}
                      {nameObj.nameType === 'hyphenated-prefix-first' && '🔗 Hyphenated first (prefix)'}
                      {nameObj.nameType === 'hyphenated-suffix-first' && '🔗 Hyphenated first (suffix)'}
                      {nameObj.nameType === 'hyphenated-prefix-last' && '🔗 Hyphenated last (prefix)'}
                      {nameObj.nameType === 'hyphenated-suffix-last' && '🔗 Hyphenated last (suffix)'}
                      {nameObj.nameType === 'crazy-cross-species' && (
                        <span className="text-orange-400 font-bold">🌪️ Cross-species chaos</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(nameObj.name)}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                    title="Copy to clipboard"
                  >📋</button>
                  <button
                    onClick={() => {
                      const data = `Name: ${nameObj.name}\nGender: ${nameObj.gender}\nSpecies: ${nameObj.species}`;
                      navigator.clipboard.writeText(data);
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                    title="Copy full details"
                  >📄</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {names.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto border border-gray-700">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Ready to Generate Names</h3>
              <p className="text-gray-400 mb-6">
                Choose your preferences and click Generate to create Star Wars character names
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
