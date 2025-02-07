import { Users, Languages, Heart, BookText, Code, AlertCircle } from 'lucide-react';
import { Book } from '../../types';

interface BookAnalysisProps {
  book: Book;
}

export function BookAnalysis({ book }: BookAnalysisProps) {
  if (!book.text_analysis || Object.keys(book.text_analysis).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-600 py-8 space-y-2">
        <AlertCircle size={24} className="text-yellow-500" />
        <p className="text-lg font-medium">Unveiling the story's secrets...</p>
        <p className="text-xs text-gray-500">This usually takes a moment. Try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-blue-600" size={24} />
          <h3 className="text-xl font-semibold">Key Characters</h3>
        </div>
        <div className="grid gap-4">
          {book.text_analysis.characters
            .filter(character => character.mentions > 1)
            .sort((a, b) => b.mentions - a.mentions)
            .map((character) => (
              <div key={character.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-800">{character.name}</h4>
                  <p className="text-sm text-gray-600">{character.significance}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">{character.mentions}</div>
                  <div className="text-xs text-gray-500">mentions</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Languages className="text-green-600" size={24} />
          <h3 className="text-xl font-semibold">Language</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Primary Language</div>
              <div className="text-lg font-semibold">{book.text_analysis.language.primary}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Complexity Level</div>
              <div className="text-lg font-semibold">{book.text_analysis.language.complexity}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Unique Words</div>
              <div className="text-lg font-semibold">{Math.round(Number(book.text_analysis.language.uniqueWords).toLocaleString())}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg. Sentence Length</div>
              <div className="text-lg font-semibold">{Math.round(Number(book.text_analysis.language.averageSentenceLength))} words</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-red-600" size={24} />
          <h3 className="text-xl font-semibold">Sentiment</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-2 text-sm text-gray-600">Overall Tone</div>
            <div className="text-lg font-semibold">{book.text_analysis.sentiment.overall}</div>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Key Emotions</div>
              <div className="flex flex-wrap gap-2">
                {book.text_analysis.sentiment.keyEmotions.map((emotion) => (
                  <span key={emotion} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              {Object.entries(book.text_analysis.sentiment.breakdown).map(([type, value]) => (
                <div key={type} className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-gray-600 capitalize">{type}</div>
                    <div className="text-sm font-medium text-gray-600">{Number(value).toFixed(2)}%</div>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-200 rounded">
                    <div
                      style={{ width: `${value}%` }}
                      className={`h-full rounded ${
                        type === 'positive' ? 'bg-green-500' :
                        type === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plot Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookText className="text-purple-600" size={24} />
          <h3 className="text-xl font-semibold">Plot</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(book.text_analysis.plot).map(([stage, content]) => {
              if (stage === 'themes') return null;
              return (
                <div key={stage} className="border-l-4 border-purple-200 pl-4">
                  <div className="font-semibold text-gray-800 capitalize mb-1">
                    {stage.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <p className="text-gray-600">{content}</p>
                </div>
              );
            })}
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Major Themes</div>
            <div className="flex flex-wrap gap-2">
              {book.text_analysis.plot.themes.map((theme) => (
                <span key={theme} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Code className="text-indigo-600" size={24} />
          <h3 className="text-xl font-semibold">Syntax</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-3">Sentence Structure</div>
            <div className="space-y-2">
              {Object.entries(book.text_analysis.syntax.structure).map(([type, value]) => (
                <div key={type} className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-gray-600 capitalize">{type}</div>
                    <div className="text-sm font-medium text-gray-600">{Number(value).toFixed(2)}%</div>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-200 rounded">
                    <div
                      style={{ width: `${value}%` }}
                      className="h-full rounded bg-indigo-500"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Notable Patterns</div>
              <ul className="list-disc list-inside text-gray-700">
                {book.text_analysis.syntax.patterns.map((pattern) => (
                  <li key={pattern}>{pattern}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 