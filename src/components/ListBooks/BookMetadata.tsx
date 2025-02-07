import { Book, Clock, Download, Languages } from 'lucide-react';

interface BookMetadataProps {
  gutenbergId: string;
  releaseDate: string;
  downloads: number;
  language: string;
}

export const BookMetadata = ({ gutenbergId, releaseDate, downloads, language }: BookMetadataProps) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <span className="flex items-center gap-1">
        <Book size={16} />
        ID: {gutenbergId}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={16} />
        Release Date: {new Date(releaseDate).toLocaleDateString()}
      </span>
      <span className="flex items-center gap-1">
        <Download size={16} />
        {downloads}
      </span>
      <span className="flex items-center gap-1">
        <Languages size={16} />
        {language}
      </span>
    </div>
  );
}; 