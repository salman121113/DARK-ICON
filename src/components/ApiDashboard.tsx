import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Copy, Check, X, Code, Terminal, ExternalLink } from 'lucide-react';

interface ApiDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiDashboard({ isOpen, onClose }: ApiDashboardProps) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('user_api_key') || '');
  const [copied, setCopied] = useState(false);

  const generateKey = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const newKey = `IMRAN${randomDigits}${suffix}`;
    localStorage.setItem('user_api_key', newKey);
    setApiKey(newKey);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseUrl = window.location.origin;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-2xl glass-panel rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] border-white/5 bg-black"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white text-black rounded-2xl shadow-xl shadow-white/5">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-black text-white tracking-tighter uppercase italic">Developer Portal</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-mono">Infrastructure Access Panel</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
            {/* Key Generation Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  AUTHENTICATION KEY
                </h3>
              </div>
              
              {!apiKey ? (
                <div className="p-12 border border-white/5 bg-white/[0.01] rounded-[2.5rem] text-center space-y-6">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                    <Key className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">No API credentials detected on this device. Initialize a new session key to begin development.</p>
                  <button 
                    onClick={generateKey}
                    className="px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-slate-200 transition-all shadow-2xl shadow-white/10 active:scale-95 uppercase text-xs tracking-widest"
                  >
                    Initialize API Key
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="w-full py-6 px-8 bg-white/[0.02] border border-white/10 rounded-2.5rem font-mono text-white text-lg overflow-x-auto whitespace-nowrap pr-20 tracking-tighter shadow-inner">
                      {apiKey}
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white text-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button 
                      onClick={generateKey}
                      className="text-[10px] text-slate-500 hover:text-white transition-colors uppercase tracking-[0.3em] font-bold py-2 px-4 rounded-lg hover:bg-white/5"
                    >
                      Reset Credentials
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Documentation Section */}
            <section className="space-y-6">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <Code className="w-4 h-4 text-slate-400" />
                INTEGRATION PROTOCOL
              </h3>

              <div className="space-y-6">
                <div className="p-8 rounded-[2rem] space-y-6 bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-white text-black text-[9px] font-black rounded-full uppercase tracking-widest">GET</span>
                    <span className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter italic">Endpoint: /api/random-image</span>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      To generate a random image, use the base endpoint and provide a category as a query parameter.
                    </p>
                    <div className="relative group">
                      <code className="block text-sm text-white bg-black p-5 rounded-2xl border border-white/10 break-all font-mono shadow-inner">
                        {baseUrl}/api/random-image?category=<span className="text-white/40">milf</span>
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Supported Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {['pussy', 'milf', 'blowjob', 'yuri', 'cuckold'].map(c => (
                        <span key={c} className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[10px] font-mono text-slate-300">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] pl-2">Implementation Sketch</p>
                  <pre className="p-8 bg-black rounded-[2.5rem] font-mono text-[11px] text-slate-400 overflow-x-auto leading-relaxed border border-white/5 shadow-2xl">
{`// Generate a direct image URL
async function fetchImage(cat = "milf") {
  const url = "${baseUrl}/api/random-image?category=" + cat;
  const res = await fetch(url);
  const data = await res.json();
  return data.url;
}`}
                  </pre>
                </div>
              </div>
            </section>
          </div>
          
          <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
            <p className="text-[7px] text-slate-800 uppercase tracking-[0.5em] font-black italic">RDX SYSTEM v2.0 • CORE ACCESS GRANTED</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
