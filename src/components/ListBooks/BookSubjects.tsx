interface BookSubjectsProps {
  subjects: string[];
}

export const BookSubjects = ({ subjects }: BookSubjectsProps) => {
  if (!subjects) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {subjects.slice(0, 3).map((subject, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
        >
          {subject}
        </span>
      ))}
      {subjects.length > 3 && (
        <span className="text-gray-500 text-xs">
          +{subjects.length - 3} more
        </span>
      )}
    </div>
  );
}; 