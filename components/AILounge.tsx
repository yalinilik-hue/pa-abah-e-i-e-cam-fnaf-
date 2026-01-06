
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Language } from '../types';

interface AILoungeProps {
  language: Language;
  onBack: () => void;
}

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const AILounge: React.FC<AILoungeProps> = ({ language, onBack }) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'IMAGE' | 'GALLERY'>('CHAT');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'bot', text: language === 'tr' ? 'Merhaba! Ben P.A.S.A. Fabrika arşivi ve tasarım modülüne hoş geldin.' : 'Hello! I am P.A.S.A. Welcome to the factory archive and design module.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Örnek Galeri Verileri (Base64 yerine placeholder linkleri, gerçekte AI tarafından üretilmiş sayılacak)
  const galleryImages = [
    { id: 1, title: 'Kristal Varlık', url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, title: 'Boru Canavarı Konsept', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000' },
    { id: 3, title: 'Antik Paşabahçe Camı', url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1000' }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChat = async () => {
    if (!inputText.trim() || isTyping) return;
    const userMsg = inputText.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Sen Paşabahçe Cam Fabrikası'nın yapay zekası P.A.S.A'sın. Gizemli ve teknolojik bir karakterin var.`,
        }
      });
      setChatHistory(prev => [...prev, { role: 'bot', text: response.text || '...' }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'bot', text: 'Bağlantı hatası.' }]);
    } finally { setIsTyping(false); }
  };

  const handleGenerateImage = async () => {
    if (!inputText.trim() || isTyping) return;
    setIsTyping(true);
    setGeneratedImage(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `High quality Pasabahce glass sculpture: ${inputText}` }] }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
      }
    } catch (e) { alert('Hata oluştu.'); } finally { setIsTyping(false); }
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col p-8 font-mono overflow-hidden">
      <div className="flex justify-between items-center mb-8 border-b-2 border-cyan-900 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-600 rounded-full animate-pulse flex items-center justify-center text-white font-black shadow-[0_0_20px_cyan]">AI</div>
          <h1 className="text-3xl font-black text-cyan-400 italic">P.A.S.A LABORATUVARI</h1>
        </div>
        <button onClick={onBack} className="px-10 py-3 bg-zinc-900 border-2 border-cyan-800 text-cyan-500 hover:bg-cyan-950 transition-all font-black uppercase text-xs">KAPAT</button>
      </div>

      <div className="flex gap-2 mb-6">
        {['CHAT', 'IMAGE', 'GALLERY'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-8 py-3 font-black text-sm transition-all border-b-4 ${activeTab === tab ? 'bg-cyan-900/20 border-cyan-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
          >
            {tab === 'CHAT' ? (language === 'tr' ? 'SOHBET' : 'CHAT') : tab === 'IMAGE' ? (language === 'tr' ? 'TASARLA' : 'DESIGN') : (language === 'tr' ? 'GALERİ' : 'GALLERY')}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-zinc-900 border-4 border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-[inset_0_0_50px_black] relative">
        {activeTab === 'CHAT' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl border-2 ${msg.role === 'user' ? 'bg-cyan-950 border-cyan-800 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 bg-black/40 border-t-2 border-zinc-800 flex gap-4">
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} className="flex-1 bg-zinc-950 border-2 border-zinc-800 p-4 text-cyan-400 font-black" />
              <button onClick={handleChat} className="px-8 bg-cyan-700 text-white font-black hover:bg-cyan-600">GÖNDER</button>
            </div>
          </>
        )}

        {activeTab === 'IMAGE' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full max-w-lg bg-zinc-950 border-2 border-zinc-800 p-6 text-cyan-400 mb-4" placeholder="Tasarım betimle..." />
            <button onClick={handleGenerateImage} className="w-full max-w-lg py-6 bg-cyan-600 text-white font-black text-xl mb-8 shadow-xl">ÜRET</button>
            <div className="relative w-80 h-80 border-4 border-zinc-800 bg-black rounded-xl overflow-hidden">
               {generatedImage && (
                 <>
                   <img src={generatedImage} alt="AI" className="w-full h-full object-cover" />
                   <button onClick={() => handleDownload(generatedImage, 'pasabahce-ai-design.png')} className="absolute bottom-4 right-4 p-3 bg-cyan-600 text-white rounded-full hover:scale-110 transition-all font-black">⬇</button>
                 </>
               )}
            </div>
          </div>
        )}

        {activeTab === 'GALLERY' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 p-12 overflow-y-auto">
             {galleryImages.map(img => (
               <div key={img.id} className="group relative bg-black border-4 border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500 transition-all">
                  <img src={img.url} alt={img.title} className="w-full h-64 object-cover opacity-60 group-hover:opacity-100 transition-all" />
                  <div className="p-4 bg-zinc-900 flex justify-between items-center">
                     <span className="text-cyan-400 font-black text-xs">{img.title}</span>
                     <button onClick={() => handleDownload(img.url, `${img.title}.jpg`)} className="px-4 py-2 bg-cyan-700 text-white text-[10px] font-black hover:bg-cyan-500">İNDİR</button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AILounge;
