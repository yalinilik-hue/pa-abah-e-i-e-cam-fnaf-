
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Language } from '../types';

interface AILoungeProps {
  language: Language;
  onBack: () => void;
  isPasaGold?: boolean; // P.A.S.A Gold desteği
}

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const AILounge: React.FC<AILoungeProps> = ({ language, onBack, isPasaGold = false }) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'IMAGE' | 'GALLERY'>('CHAT');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'bot', text: language === 'tr' ? `Merhaba! P.A.S.A Sistemine hoş geldin. ${isPasaGold ? "Gold üyelik avantajların aktif!" : ""}` : `Hello! Welcome to P.A.S.A System. ${isPasaGold ? "Gold membership benefits active!" : ""}` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
          systemInstruction: `Sen Paşabahçe Cam Fabrikası'nın yapay zekası P.A.S.A'sın. ${isPasaGold ? "Kullanıcın bir Gold Üye, ona çok daha saygılı ve detaylı bilgi ver." : ""}`,
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
        contents: { parts: [{ text: `Masterpiece Pasabahce glass art, cinematic lighting: ${inputText}` }] },
        config: {
          imageConfig: { aspectRatio: '1:1' }
        }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
      }
    } catch (e) { alert('Hata oluştu.'); } finally { setIsTyping(false); }
  };

  return (
    <div className={`w-full h-full flex flex-col p-8 font-mono overflow-hidden transition-colors duration-1000 ${isPasaGold ? 'bg-zinc-950 border-8 border-purple-900 shadow-[inset_0_0_100px_purple]' : 'bg-zinc-950'}`}>
      <div className="flex justify-between items-center mb-8 border-b-2 border-cyan-900 pb-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full animate-pulse flex items-center justify-center text-white font-black shadow-2xl ${isPasaGold ? 'bg-purple-600 shadow-[0_0_30px_purple]' : 'bg-cyan-600 shadow-[0_0_20px_cyan]'}`}>
            {isPasaGold ? 'GOLD' : 'AI'}
          </div>
          <h1 className={`text-3xl font-black italic ${isPasaGold ? 'text-purple-400' : 'text-cyan-400'}`}>P.A.S.A LABORATUVARI</h1>
        </div>
        <button onClick={onBack} className="px-10 py-3 bg-zinc-900 border-2 border-cyan-800 text-cyan-500 hover:bg-cyan-950 transition-all font-black uppercase text-xs">KAPAT</button>
      </div>

      <div className="flex gap-2 mb-6">
        {['CHAT', 'IMAGE', 'GALLERY'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-8 py-3 font-black text-sm transition-all border-b-4 ${activeTab === tab ? (isPasaGold ? 'bg-purple-900/20 border-purple-500 text-white' : 'bg-cyan-900/20 border-cyan-500 text-white') : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
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
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 bg-black/40 border-t-2 border-zinc-800 flex gap-4">
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} className="flex-1 bg-zinc-950 border-2 border-zinc-800 p-4 text-cyan-400 font-black outline-none focus:border-cyan-500" />
              <button onClick={handleChat} className={`px-8 font-black text-white hover:opacity-80 transition-all ${isPasaGold ? 'bg-purple-600' : 'bg-cyan-700'}`}>GÖNDER</button>
            </div>
          </>
        )}

        {activeTab === 'IMAGE' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full max-w-lg bg-zinc-950 border-2 border-zinc-800 p-6 text-cyan-400 mb-4 text-center font-black italic" placeholder="Hayalindeki tasarımı betimle..." />
            <button onClick={handleGenerateImage} className={`w-full max-w-lg py-6 font-black text-xl mb-8 shadow-xl transition-all ${isPasaGold ? 'bg-purple-600 animate-pulse' : 'bg-cyan-600 hover:scale-105'}`}>ÜRET</button>
            <div className="relative w-80 h-80 border-4 border-zinc-800 bg-black rounded-xl overflow-hidden shadow-2xl">
               {generatedImage && (
                 <>
                   <img src={generatedImage} alt="AI" className="w-full h-full object-cover animate-in fade-in duration-500" />
                   <button onClick={() => handleDownload(generatedImage, 'pasabahce-gold-design.png')} className="absolute bottom-4 right-4 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-all font-black text-xl">⬇</button>
                 </>
               )}
               {isTyping && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-cyan-500 font-black tracking-widest animate-bounce">İŞLENİYOR...</div>}
            </div>
          </div>
        )}

        {activeTab === 'GALLERY' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 p-12 overflow-y-auto scrollbar-hide">
             {galleryImages.map(img => (
               <div key={img.id} className="group relative bg-black border-4 border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500 transition-all shadow-xl">
                  <img src={img.url} alt={img.title} className="w-full h-64 object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                  <div className="p-4 bg-zinc-900/90 flex justify-between items-center">
                     <span className="text-white font-black text-xs italic">{img.title}</span>
                     <button onClick={() => handleDownload(img.url, `${img.title}.jpg`)} className="px-4 py-2 bg-zinc-800 text-white text-[10px] font-black border border-zinc-700 hover:bg-purple-600 transition-colors">İNDİR</button>
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
