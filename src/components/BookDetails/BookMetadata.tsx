import { Book } from '../../types';

interface BookMetadataProps {
  book: Book;
}

export function BookMetadata({ book }: BookMetadataProps) {
  return (
    <div className="space-y-8">
      {book.metadata.summary && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
          <p className="text-gray-700 leading-relaxed">{book.metadata.summary}</p>
        </div>
      )}

      {book.metadata.subjects && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {book.metadata.subjects.map((subject, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {book.metadata.notes && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Notes</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {book.metadata.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(book.metadata)
            .filter(([key]) => !['notes', 'subjects', 'summary'].includes(key))
            .map(([key, value]) => (
              value && (
                <div key={key}>
                  <span className="text-gray-600">
                    {key
                      .replace(/^./, str => str.toUpperCase())
                      .trim()}:
                  </span>
                  <span className="ml-2 font-medium">{value}</span>
                </div>
              )
            ))}
        </div>
      </div>
    </div>
  );
} 