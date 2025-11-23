import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Book, User, LogOut } from 'lucide-react';
import { loadEntries, saveEntry } from './services/storage';
import { DiaryEntry } from './types';
import LoginModal from './components/LoginModal';
import DiaryEditor from './components/DiaryEditor';

// --- Helper Functions ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// --- Main Component ---
const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load entries on mount
  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  // Calendar Navigation
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };
  
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  // Calendar Generation Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-stone-50/50 border-b border-r border-stone-200"></div>);
  }
  
  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateKey = formatDateKey(dateObj);
    const hasEntry = !!entries[dateKey];
    
    // Check if it is "today"
    const isToday = new Date().toDateString() === dateObj.toDateString();
    
    // Style logic: Red text if entry exists, bold red if it's the date, gray if empty
    const dayColorClass = hasEntry ? "text-red-600 font-bold" : "text-stone-700";
    const bgClass = isToday ? "bg-stone-100" : "bg-white hover:bg-stone-50";

    days.push(
      <div 
        key={d} 
        onClick={() => setSelectedDate(dateObj)}
        className={`h-24 md:h-32 border-b border-r border-stone-200 p-2 cursor-pointer transition-colors relative group ${bgClass}`}
      >
        <span className={`text-lg md:text-xl font-serif inline-block w-8 h-8 text-center leading-8 rounded-full ${isToday ? 'bg-red-500 text-white' : dayColorClass}`}>
          {d}
        </span>
        {hasEntry && (
          <div className="mt-2 text-xs text-stone-400 line-clamp-2 md:line-clamp-3 font-serif px-1">
            {entries[dateKey].content}
          </div>
        )}
        {!hasEntry && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
             <span className="text-stone-300 text-xs border border-stone-200 px-2 py-1 rounded-full">작성하기</span>
          </div>
        )}
      </div>
    );
  }

  // --- Render Helpers ---

  // Generate Year Options (Range: 2010 - 2030)
  const yearOptions = [];
  for (let y = 2010; y <= 2030; y++) {
    yearOptions.push(<option key={y} value={y}>{y}년</option>);
  }

  // Generate Month Options
  const monthOptions = Array.from({ length: 12 }, (_, i) => (
    <option key={i} value={i}>{i + 1}월</option>
  ));

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      
      {/* Top Navigation Bar */}
      <nav className="bg-stone-800 text-stone-100 py-4 px-6 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Book className="text-stone-300" />
          <h1 className="text-xl font-serif font-bold tracking-wider">나만의 비밀 일기장</h1>
        </div>
        <div>
          {isLoggedIn ? (
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center text-sm bg-stone-700 hover:bg-stone-600 px-3 py-1.5 rounded transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              로그아웃
            </button>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="flex items-center text-sm bg-stone-700 hover:bg-stone-600 px-3 py-1.5 rounded transition-colors"
            >
              <User size={16} className="mr-2" />
              관리자 로그인
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        
        {/* View Switch: Calendar vs Editor */}
        {selectedDate ? (
          <DiaryEditor 
            dateStr={formatDateKey(selectedDate)}
            initialContent={entries[formatDateKey(selectedDate)]?.content || ''}
            isLoggedIn={isLoggedIn}
            onBack={() => setSelectedDate(null)}
            onLoginRequest={() => setShowLoginModal(true)}
            onSave={(content) => {
              const newEntries = saveEntry(formatDateKey(selectedDate), content);
              setEntries(newEntries);
            }}
          />
        ) : (
          <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-stone-200">
            {/* Calendar Header */}
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <button onClick={prevMonth} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-600">
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-3xl font-serif font-bold text-stone-800">
                {year}년 <span className="text-red-600">{month + 1}월</span>
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-600">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-100">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
                <div key={day} className={`text-center py-2 text-xs font-bold tracking-widest ${idx === 0 ? 'text-red-500' : 'text-stone-500'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 bg-stone-200 gap-px border-l border-t border-stone-200">
               {/* Using gap-px with bg-stone-200 creates the grid lines effect, but let's stick to border logic inside items for cleaner look */}
               {days}
            </div>

            {/* Bottom Controls (Year/Month Selection) */}
            <div className="bg-stone-50 p-6 border-t border-stone-200 flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-stone-500 font-serif text-sm">연도 선택:</label>
                <select 
                  value={year} 
                  onChange={handleYearChange}
                  className="px-4 py-2 bg-white border border-stone-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 text-stone-800"
                >
                  {yearOptions}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-stone-500 font-serif text-sm">월 선택:</label>
                <select 
                  value={month} 
                  onChange={handleMonthChange}
                  className="px-4 py-2 bg-white border border-stone-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 text-stone-800"
                >
                  {monthOptions}
                </select>
              </div>

              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm text-stone-500 hover:text-red-600 underline underline-offset-2 transition-colors"
              >
                오늘 날짜로 이동
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center p-6 text-stone-400 text-sm font-serif">
        &copy; {new Date().getFullYear()} My Personal Diary.
      </footer>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={setIsLoggedIn}
      />
    </div>
  );
};

export default App;
