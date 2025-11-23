import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials as requested
    if (id === 'kkkgg12341234' && password === 'wskimjason@1') {
      onLogin(true);
      setError('');
      setId('');
      setPassword('');
      onClose();
    } else {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative border border-stone-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-stone-600" size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">관리자 로그인</h2>
          <p className="text-stone-500 text-sm mt-2">일기를 수정하려면 로그인이 필요합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">아이디</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-stone-400 focus:outline-none transition-all"
              placeholder="Enter ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-stone-400 focus:outline-none transition-all"
              placeholder="Enter Password"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-stone-800 text-white py-3 rounded hover:bg-stone-900 transition-colors font-medium mt-2"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
