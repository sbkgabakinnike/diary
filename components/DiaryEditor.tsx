import React, { useState, useEffect } from 'react';
import { Save, Sparkles, PenLine, ArrowLeft } from 'lucide-react';
import { DiaryEntry } from '../types';
import { getGeminiReflection } from '../services/geminiService';

interface DiaryEditorProps {
  dateStr: string;
  initialContent: string;
  isLoggedIn: boolean;
  onSave: (content: string) => void;
  onBack: () => void;
  onLoginRequest: () => void;
}

const DiaryEditor: React.FC<DiaryEditorProps> = ({ 
  dateStr, 
  initialContent, 
  isLoggedIn, 
  onSave, 
  onBack,
  onLoginRequest
}) => {
  const [content, setContent] = useState(initialContent);
  const [aiComment, setAiComment] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Parse date for display
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString('ko-KR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    // If we have content and just opened, maybe don't edit immediately unless it's empty
    if (!initialContent && isLoggedIn) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [initialContent, isLoggedIn]);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  const handleAiReflection = async () => {
    if (!content.trim()) return;
    setIsAiLoading(true);
    const comment = await getGeminiReflection(content);
    setAiComment(comment);
    setIsAiLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-stone-100 p-6 border-b border-stone-200 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span className="text-sm">달력으로</span>
        </button>
        <h2 className="text-xl font-serif font-bold text-stone-800">{formattedDate}</h2>
        <div className="w-20"></div> {/* Spacer for center alignment */}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 flex flex-col">
        {isEditing ? (
          <textarea
            className="w-full h-full min-h-[400px] p-6 text-lg leading-relaxed bg-stone-50 border-none outline-none resize-none font-serif text-stone-700 placeholder:text-stone-300 rounded-lg focus:ring-1 focus:ring-stone-200"
            placeholder="오늘 하루는 어땠나요?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="w-full h-full min-h-[400px] p-6 text-lg leading-relaxed font-serif text-stone-800 whitespace-pre-wrap">
            {content || <span className="text-stone-400 italic">작성된 일기가 없습니다.</span>}
          </div>
        )}
      </div>

      {/* AI Section (Only if content exists) */}
      {(aiComment || isAiLoading) && (
        <div className="px-8 pb-4">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-indigo-800 text-sm flex items-start">
            <Sparkles size={16} className="mt-1 mr-2 flex-shrink-0 text-indigo-500" />
            <div>
              <p className="font-bold mb-1 text-indigo-600">AI의 한마디</p>
              {isAiLoading ? "생각하는 중..." : aiComment}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-between items-center">
        <div className="flex gap-2">
           {content && (
            <button
              onClick={handleAiReflection}
              disabled={isAiLoading}
              className="flex items-center px-4 py-2 text-stone-600 bg-white border border-stone-300 rounded hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-sm"
            >
              <Sparkles size={16} className="mr-2" />
              {aiComment ? '다시 듣기' : 'AI 조언 듣기'}
            </button>
           )}
        </div>

        <div className="flex gap-2">
          {isLoggedIn ? (
            isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-2 bg-stone-800 text-white rounded hover:bg-stone-900 transition-colors shadow-md"
              >
                <Save size={18} className="mr-2" />
                저장하기
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-6 py-2 bg-white text-stone-800 border border-stone-300 rounded hover:bg-stone-100 transition-colors"
              >
                <PenLine size={18} className="mr-2" />
                수정하기
              </button>
            )
          ) : (
            <button
              onClick={onLoginRequest}
              className="flex items-center px-6 py-2 bg-stone-200 text-stone-500 rounded cursor-pointer hover:bg-stone-300 transition-colors"
            >
              <PenLine size={18} className="mr-2" />
              작성하려면 로그인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryEditor;
