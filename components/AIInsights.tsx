
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, Send, Bot, Loader2, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { Product, Transaction } from '../types';
import { analyzeInventory, chatWithInventory } from '../services/geminiService';

interface AIInsightsProps {
  products: Product[];
  transactions: Transaction[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ products, transactions }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      const result = await analyzeInventory(products, transactions);
      setAnalysis(result);
      setLoading(false);
    };
    getAnalysis();
  }, [products, transactions]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMsg = chatQuery;
    setChatQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    const botResp = await chatWithInventory(userMsg, products);
    setChatHistory(prev => [...prev, { role: 'bot', text: botResp }]);
    setIsChatLoading(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Analysis Panel */}
      <div className="xl:col-span-2 space-y-8">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-blue-200" />
              <h2 className="text-2xl font-bold">Інтелектуальний Аналіз</h2>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-200" />
                <p className="text-blue-100 font-medium animate-pulse text-lg">Gemini аналізує дані вашого складу...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                <p className="text-xl leading-relaxed text-blue-50 font-medium">
                  {analysis.summary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4 text-amber-300">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="font-bold">Попередження</h3>
                    </div>
                    <ul className="space-y-3">
                      {analysis.warnings.map((w: string, i: number) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-amber-300">•</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4 text-emerald-300">
                      <TrendingUp className="w-5 h-5" />
                      <h3 className="font-bold">Прогноз</h3>
                    </div>
                    <p className="text-sm italic">{analysis.forecast}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white/10 rounded-xl">
                Не вдалося отримати аналіз. Перевірте API ключ.
              </div>
            )}
          </div>
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        {analysis?.suggestions && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-bold text-slate-800">Рекомендації Gemini</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.suggestions.map((s: string, i: number) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-slate-600 text-sm font-medium">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Assistant */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col h-[700px]">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">AI Помічник</h3>
            <span className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Онлайн
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none mr-8">
            <p className="text-sm text-slate-700">
              Привіт! Я ваш інтелектуальний помічник складу. Запитуйте про товари, прогнози або статистику.
            </p>
          </div>
          {chatHistory.map((chat, i) => (
            <div 
              key={i} 
              className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                chat.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none ml-8' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none mr-8'
              }`}>
                {chat.text}
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none mr-8 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-slate-500">Думаю...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleChat} className="p-4 border-t border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              placeholder="Запитайте що завгодно..."
              className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
            />
            <button 
              type="submit"
              disabled={isChatLoading || !chatQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIInsights;
