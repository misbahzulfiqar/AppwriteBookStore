import React from 'react';

function ReadingStats({ books = [] }) {
  // Calculate statistics
  const totalBooks = books.length;
  const booksRead = books.filter(book => book.status === 'finished').length;
  const currentlyReading = books.filter(book => book.status === 'reading').length;
  const wantToRead = books.filter(book => book.status === 'want-to-read').length;

  const stats = [
    { label: 'Total Books', value: totalBooks, color: 'bg-blue-100 text-blue-800' },
    { label: 'Books Read', value: booksRead, color: 'bg-green-100 text-green-800' },
    { label: 'Reading Now', value: currentlyReading, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Want to Read', value: wantToRead, color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Reading Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.color} p-4 rounded-lg text-center transition-transform hover:scale-105`}
          >
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {totalBooks === 0 && (
        <div className="mt-4 text-center text-gray-500">
          Add your first book to see statistics!
        </div>
      )}
    </div>
  );
}

export default ReadingStats;