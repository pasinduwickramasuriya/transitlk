'use client';

import { useState } from 'react';

interface Message {
    text: string;
    isUser: boolean;
}

export default function BusAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi! Ask me about Sri Lankan buses!", isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });
            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { text: data.message, isUser: false }]);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window - Matching Hero Colors */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 h-96 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col z-50 border border-rose-200/50">

                    {/* Header - Rose to Violet Gradient */}
                    <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-violet-500 text-white px-4 py-3 rounded-t-3xl flex justify-between items-center shadow-lg">
                        <h3 className="font-bold text-sm flex items-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                            🚌 Bus Helper
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-300 hover:rotate-90"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages - Soft Pastel Background */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-rose-50 via-blue-50 to-violet-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${msg.isUser
                                    ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-violet-500 text-white shadow-lg'
                                    : 'bg-white/60 backdrop-blur-xl shadow-md border border-rose-200/40 text-slate-700'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/60 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-md border border-violet-200/40">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input - Matching Theme */}
                    <div className="p-3 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-t border-rose-200/50 rounded-b-3xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Ask me anything..."
                                className="text-slate-800 flex-1 border-2 border-rose-200/50 bg-white/60 backdrop-blur-xl rounded-full px-3 py-2 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-4 py-2 rounded-full text-sm font-medium disabled:from-gray-300 disabled:to-gray-300 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button - Matching Hero Style */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 text-white rounded-full shadow-2xl hover:shadow-rose-500/25 hover:scale-110 active:scale-95 transition-all duration-500 flex items-center justify-center z-50 border-3 border-white"
            >
                {isOpen ? (
                    <span className="text-xl font-bold group-hover:rotate-90 transition-transform duration-300">✕</span>
                ) : (
                    <div className="relative">
                        <span className="text-2xl">🚌</span>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse border-2 border-white shadow-lg">
                            1
                        </span>
                        {/* Animated pulse ring */}
                        <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-20"></div>
                    </div>
                )}
            </button>
        </>
    );
}
