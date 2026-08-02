'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Book } from '@/lib/ims-data';
import { Library, Search, QrCode, BookOpen, Plus, CheckCircle, Lock, User, Clock, Download, X, CheckCircle2 } from 'lucide-react';

export function LibraryManagement() {
  const { currentRole, books, addBook, issueBook, students } = useIMS();
  const isStudentRole = currentRole === 'Student';
  const myStudent = students[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Add Book form state
  const [newBook, setNewBook] = useState({
    title: 'Clean Architecture in TypeScript',
    author: 'Robert C. Martin',
    isbn: '978-0134494166',
    category: 'Computer Science',
    rackLocation: 'Rack B-04',
    copiesTotal: 10,
    copiesAvailable: 10,
    status: 'Available' as const,
  });

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.includes(searchTerm)
  );

  // Student's borrowed books mock data
  const myBorrowedBooks = [
    {
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Thomas H. Cormen',
      issueDate: '2026-07-15',
      dueDate: '2026-08-15',
      fine: '₹0 (No Overdue)',
    },
    {
      title: 'Operating System Concepts (Silberschatz)',
      author: 'Abraham Silberschatz',
      issueDate: '2026-07-20',
      dueDate: '2026-08-20',
      fine: '₹0 (No Overdue)',
    },
  ];

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBook({
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn,
      category: newBook.category,
      rackLocation: newBook.rackLocation,
      copiesTotal: Number(newBook.copiesTotal),
      copiesAvailable: Number(newBook.copiesAvailable),
      status: newBook.status,
      isDigital: false,
    });
    setIsAddModalOpen(false);
    setNotification(`Book "${newBook.title}" added to catalog!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleIssueBook = (b: Book) => {
    if (b.copiesAvailable <= 0) {
      alert('No copies available for issue.');
      return;
    }
    issueBook(b.id, myStudent?.name || 'Aarav Sharma');
    setNotification(`Book "${b.title}" issued to student!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isStudentRole ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <User className="h-3 w-3 text-blue-400" /> Student Catalog & Borrowing Portal
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Librarian Scoped View
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Library className="h-5 w-5 text-blue-400" /> Library & Barcode Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Book catalog, ISBN barcode scanner, automated overdue fine calculator, and digital e-book library.
          </p>
        </div>

        {!isStudentRole && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" /> Add New Book Title
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Student View: My Borrowed Books Card */}
      {isStudentRole && (
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" /> My Currently Borrowed Books
            </h3>
            <span className="text-xs font-bold text-emerald-400">2 Active Borrowings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myBorrowedBooks.map((b, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>{b.title}</span>
                  <span className="text-emerald-400 text-[10px]">Issued ✓</span>
                </div>
                <p className="text-slate-400">{b.author}</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                  <span>Issued: {b.issueDate}</span>
                  <span className="text-amber-400 font-bold">Due: {b.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by book title, author, or ISBN barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBooks.map((b) => (
          <div key={b.id} className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/20 text-blue-300">
                {b.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.status === 'Available' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {b.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm leading-snug">{b.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{b.author}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
              <p><strong>ISBN:</strong> {b.isbn}</p>
              <p><strong>Rack Location:</strong> {b.rackLocation}</p>
              <p><strong>Copies:</strong> {b.copiesAvailable} / {b.copiesTotal} Available</p>
            </div>

            {!isStudentRole ? (
              <button
                onClick={() => handleIssueBook(b)}
                className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-xs transition"
              >
                Issue Book to Student
              </button>
            ) : (
              <div className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-[11px] text-center">
                {b.status === 'Available' ? '✓ Available on Rack ' + b.rackLocation : 'Temporarily Out of Stock'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Add New Book to Library Catalog</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Author Name</label>
                <input
                  type="text"
                  required
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ISBN Code</label>
                  <input
                    type="text"
                    required
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Rack Location</label>
                  <input
                    type="text"
                    required
                    value={newBook.rackLocation}
                    onChange={(e) => setNewBook({ ...newBook, rackLocation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Total Copies</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newBook.copiesTotal}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      setNewBook({ ...newBook, copiesTotal: num, copiesAvailable: num });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30"
                >
                  Add Book to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
