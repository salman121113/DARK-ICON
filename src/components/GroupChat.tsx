import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GroupChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState(localStorage.getItem('chat_name') || '');
  const [isNameSet, setIsNameSet] = useState(!!localStorage.getItem('chat_name'));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, "group_messages"), orderBy("timestamp", "asc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    }, (error) => {
      console.error("Firestore listener error:", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userName) return;

    try {
      await addDoc(collection(db, "group_messages"), {
        text: newMessage,
        sender: userName,
        timestamp: serverTimestamp(),
        userId: 'temp-user' // In a real app, use Firebase Auth UID
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('chat_name', userName);
      setIsNameSet(true);
    }
  };

  if (!isNameSet) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm glass-panel p-8 rounded-3xl text-center"
        >
          <User className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-white mb-2">আপনার নাম দিন</h2>
          <p className="text-slate-500 text-xs mb-6">গ্রুপে চ্যাট করার জন্য একটি নাম সেট করুন।</p>
          <form onSubmit={handleSetName} className="space-y-4">
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="আপনার নাম..."
              className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20 transition-all"
              autoFocus
            />
            <button className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">
              শুরু করুন
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.sender === userName ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-slate-500 mb-1 px-1">{msg.sender}</span>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
              msg.sender === userName 
                ? 'bg-white text-black rounded-tr-none shadow-lg' 
                : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex gap-2">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="কিছু লিখুন..."
            className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-all"
          />
          <button className="p-3 bg-white text-black rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
