import React from 'react';

function ReadingStats({ books = [] }) {
  // Calculate statistics
  const totalBooks = books.length;
  const booksRead = books.filter(book => book.status === 'finished').length;
  const currentlyReading = books.filter(book => book.status === 'reading').length;
  const wantToRead = books.filter(book => book.status === 'want-to-read').length;
  
  // Calculate total reading progress
  const booksWithProgress = books.filter(book => book.lastReadPage > 0);
  const totalPagesRead = books.reduce((sum, book) => {
    return sum + (parseInt(book.pagesRead) || 0);
  }, 0);
  
  const totalPages = books.reduce((sum, book) => {
    return sum + (parseInt(book.totalPages) || 0);
  }, 0);
  
  const overallProgress = totalPages > 0 ? Math.round((totalPagesRead / totalPages) * 100) : 0;

  const stats = [
    { label: 'Total Books', value: totalBooks, color: 'bg-blue-100 text-blue-800 h-40' },
    { label: 'Books Read', value: booksRead, color: 'bg-green-100 text-green-800' },
    { label: 'Reading Now', value: currentlyReading, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Want to Read', value: wantToRead, color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="mb-8 p-6 rounded-xl margin">
      <h2 className="text-2xl font-bold text-gray-800 ">📊 Reading Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 margin">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.color} p-4 rounded-lg text-center transition-transform hover:scale-105`}
          >
            <div className="text-5xl font-bold margin-sp">{stat.value}</div>
            <div className="text-xl font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      {totalBooks > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 margin">
          <div className="flex justify-between text-xl text-gray-600 mb-2">
            <span>Overall Reading Progress</span>
            <span className='margin'>{overallProgress}% ({totalPagesRead}/{totalPages} pages)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[#8b5a2b] h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xl text-gray-500 margin">
            {booksWithProgress.length} books have reading progress saved
          </div>
        </div>
      )}

      {totalBooks === 0 && (
        <div className="mt-4 text-center text-gray-500">
          Add your first book to see statistics!
        </div>
      )}
    </div>
  );
}

export default ReadingStats;