import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  RefreshCw, 
  Image as ImageIcon, 
  Maximize2, 
  AlertCircle,
  Loader2,
  Zap,
  Sparkles,
  Layers,
  MessageSquare,
  Bot,
  Key,
  X,
  Check
} from 'lucide-react';
import GroupChat from './components/GroupChat';
import AIChat from './components/AIChat';
import ApiDashboard from './components/ApiDashboard';

export default function App() {
  const [verificationStep, setVerificationStep] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'gen' | 'group' | 'ai'>('gen');
  const [isApiOpen, setIsApiOpen] = useState(false);
  const [isUiMenuOpen, setIsUiMenuOpen] = useState(false);
  const [selectedUi, setSelectedUi] = useState('Default');

  const uiOptions = [
    { id: 'default', name: 'Default', bg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', title: 'Sexy Pic', subtitle: 'Generator', tagline: 'ULTIMATE VISUAL GENERATOR', btn: 'GENERATE IMAGE', status: 'GENERATING...', description: 'Welcome to the ultimate visual generator. Select a category and start creating high-quality images.' },
    { id: 'mom', name: 'সেক্সি মম', bg: 'https://images.unsplash.com/photo-1481326329074-851de7af66ee?q=80&w=2564&auto=format&fit=crop', title: 'Sexy', subtitle: 'MOM', tagline: 'আপনার প্রিয় সেক্সি মমের ছবি তৈরি করুন', btn: 'মা কে চুদুন', status: 'মা তৈরি হচ্ছে...', description: 'মাকে চুদুন। মাকে চুদলে যে শান্তি পাওয়া যায় তা আর কিছুতে নেই। মা আমার জান, মাকে আমি প্রাণভরে চোদবো। মায়ের পাছা মারবো আর মাকে প্রেগন্যান্ট করবো।' },
    { id: 'sis', name: 'সেক্সি বোন', bg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop', title: 'Sexy', subtitle: 'SISTER', tagline: 'আপনার আদরের সেক্সি বোনের গোপন ছবি', btn: 'বোনকে চুদুন', status: 'বোন তৈরি হচ্ছে...', description: 'নিজের বোনকে চুদতে কার না ভালো লাগে? সেক্সি বোনের টাইট শরীর আর পাছা দেখে নিজেকে সামলানো দায়। আজই বোনকে চুদুন এবং তার গর্ভে নিজের সন্তান দিন।' },
    { id: 'aunt', name: 'সেক্সি খালা', bg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop', title: 'Sexy', subtitle: 'AUNT', tagline: 'সেক্সি খালার সাথে গরম মুহূর্ত', btn: 'খালাকে চুদুন', status: 'খালা তৈরি হচ্ছে...', description: 'খালার সাথে সেক্স করার মজাই আলাদা। সেক্সি খালার দুধ আর পাছার নেশায় পাগল সবাই। খালার সাথে নোংরা খেলায় মেতে উঠুন এবং তাকে চুদে শান্ত করুন।' },
    { id: 'girl', name: 'সেক্সি মেয়ে', bg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2487&auto=format&fit=crop', title: 'Sexy', subtitle: 'GIRL', tagline: 'অচেনা সেক্সি মেয়ের সাথে খেলা করুন', btn: 'মেয়েকে চুদুন', status: 'মেয়ে তৈরি হচ্ছে...', description: 'অচেনা সেক্সি মেয়ের সাথে উদ্দাম সেক্স। সুন্দরীর পাছা আর ঠোঁটের ছোঁয়ায় হারিয়ে যান কামনার জগতে। মেয়েটিকে ইচ্ছেমতো চুদুন এবং তার শরীর উপভোগ করুন।' }
  ];

  const [currentUi, setCurrentUi] = useState(uiOptions[0]);
  const [generatedDescription, setGeneratedDescription] = useState(currentUi.description);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  useEffect(() => {
    const fetchDescription = async () => {
      if (currentUi.id === 'default') {
        setGeneratedDescription(currentUi.description);
        return;
      }

      setIsGeneratingDesc(true);
      try {
        const response = await fetch('/api/generate-description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: currentUi.name }),
        });
        const data = await response.json();
        if (data.description) {
          setGeneratedDescription(data.description);
        } else {
          setGeneratedDescription(currentUi.description);
        }
      } catch (err) {
        console.error("Failed to generate description:", err);
        setGeneratedDescription(currentUi.description);
      } finally {
        setIsGeneratingDesc(false);
      }
    };

    fetchDescription();
  }, [currentUi]);

  const handleUiChange = (option: typeof uiOptions[0]) => {
    setCurrentUi(option);
    setSelectedUi(option.name);
    setBackgroundUrl(option.bg);
    setIsUiMenuOpen(false);
  };

  const questions = [
    {
      title: "ভেরিফিকেশন: ধাপ ১",
      question: "আপনি শেষ কবে অ্যাডাল্ট বা পর্ন ভিডিও দেখেছেন?",
      options: ["আজকেই", "গত কয়েকদিনের মধ্যে", "অনেক আগে", "কখনো না"]
    },
    {
      title: "ভেরিফিকেশন: ধাপ ২",
      question: "আপনি কি কখনো স্বমেহন করেছেন অথবা অন্য কারো সাথে শারীরিক সম্পর্ক করেছেন?",
      options: ["হ্যাঁ, নিয়মিত", "হ্যাঁ, মাঝে মাঝে", "একবার করেছি", "না, কখনো না"]
    },
    {
      title: "ভেরিফিকেশন: ধাপ ৩",
      question: "আপনি কি পরিবারের কারো প্রতি কখনো যৌন আকর্ষণ অনুভব করেছেন (মা, বোন বা অন্য কেউ)?",
      options: ["হ্যাঁ", "না", "বলতে চাই না"]
    }
  ];

  const handleNextStep = () => {
    if (verificationStep < questions.length - 1) {
      setVerificationStep(verificationStep + 1);
    } else {
      setIsAuthorized(true);
    }
  };
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");
  const [isGenerating, setIsGenerating] = useState(false);
  const [category, setCategory] = useState('yuri');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'pussy', name: 'Pussy', icon: Zap },
    { id: 'cuckold', name: 'Cuckold', icon: Layers },
    { id: 'yuri', name: 'Yuri', icon: Sparkles },
    { id: 'milf', name: 'Milf', icon: ImageIcon },
    { id: 'blowjob', name: 'Blowjob', icon: RefreshCw },
  ];

  // Background auto-update logic
  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const randomCat = categories[Math.floor(Math.random() * categories.length)].id;
        const response = await fetch(`/api/random-image?category=${randomCat}`);
        const data = await response.json();
        const url = data.url || data.image || data.link || (typeof data === 'string' ? data : null);
        if (url) setBackgroundUrl(url);
      } catch (err) {
        console.error("Failed to fetch background:", err);
      }
    };

    fetchBackground();
    const interval = setInterval(fetchBackground, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      let response;
      if (prompt.trim()) {
        response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspectRatio: '1:1' }),
        });
      } else {
        response = await fetch(`/api/random-image?category=${category}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch image');
      }

      const url = data.imageUrl || data.url || data.image || data.link || (typeof data === 'string' ? data : null);
      
      if (url) {
        setImageUrl(url);
      } else {
        throw new Error('No valid image URL found in response');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center p-6 text-center">
        <motion.div 
          key={verificationStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-md w-full glass-panel p-8 rounded-[2.5rem] border border-white/5"
        >
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Zap className="w-6 h-6 text-white" />
          </div>
          
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 block">
            {questions[verificationStep].title}
          </span>
          
          <h2 className="text-xl font-display font-bold text-white mb-8 leading-tight">
            {questions[verificationStep].question}
          </h2>

          <div className="grid gap-3">
            {questions[verificationStep].options.map((option, idx) => (
              <button 
                key={idx}
                onClick={handleNextStep}
                className="w-full py-4 px-6 bg-white/5 border border-white/10 text-slate-300 rounded-2xl font-medium hover:bg-white hover:text-black hover:border-white transition-all text-sm active:scale-95"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-1">
            {questions.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${idx === verificationStep ? 'w-8 bg-white' : 'w-2 bg-white/10'}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `hc-gen-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen mesh-bg selection:bg-white/30 flex flex-col items-center py-4 px-4 sm:px-6 overflow-hidden relative">
      {/* Dynamic Background Wallpaper */}
      <AnimatePresence>
        {backgroundUrl && (
          <motion.div
            key={backgroundUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <img 
              src={backgroundUrl} 
              alt="Background" 
              className="w-full h-full object-cover blur-[2px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/70" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 relative z-10 w-full"
      >
        <div className="absolute left-0 top-0 sm:left-4">
          <button 
            onClick={() => setIsUiMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white hover:text-black transition-all group active:scale-95"
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">UI</span>
          </button>
        </div>

        <div className="absolute right-0 top-0 sm:right-4">
          <button 
            onClick={() => setIsApiOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white hover:text-black transition-all group active:scale-95"
          >
            <Key className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">API</span>
          </button>
        </div>

        <div className="inline-flex items-center justify-center p-2.5 glass-panel rounded-xl mb-3 relative">
          <Zap className="w-6 h-6 text-white relative z-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tighter text-white mb-1 uppercase italic">
          {currentUi.title} <span className="text-white/50">{currentUi.subtitle}</span>
        </h1>
        <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] max-w-xl mx-auto uppercase">
          {currentUi.tagline}
        </p>
      </motion.header>

      {/* Navigation Tabs */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm glass-panel rounded-2xl p-1.5 flex gap-1 shadow-black/40 shadow-2xl">
        {[
          { id: 'gen', icon: Zap, label: 'জেনারেশন' },
          { id: 'group', icon: MessageSquare, label: 'গ্রুপ' },
          { id: 'ai', icon: Bot, label: 'AI চ্যাট' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-black shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Sections */}
      <AnimatePresence mode="wait">
        {activeTab === 'gen' && (
          <motion.main 
            key="gen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-2xl flex flex-col items-center gap-5 relative z-10 pb-24"
          >
            {/* Search Input */}
            <div className="w-full">
              <div className="relative glass-panel rounded-xl overflow-hidden group">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="এখানে লিখে সার্চ দিন..."
                  className="w-full py-3.5 px-5 bg-transparent text-white placeholder:text-slate-600 focus:outline-none text-sm"
                />
                {prompt && (
                  <button 
                    onClick={() => setPrompt('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Selector */}
            {!prompt && (
              <div className="w-full flex flex-wrap justify-center gap-1.5">
                {categories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-bold text-[10px] transition-all border ${
                      category === cat.id
                        ? 'bg-white border-white text-black neon-glow'
                        : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <cat.icon className="w-2.5 h-2.5" />
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Preview Area */}
            <div className="w-full aspect-square glass-panel rounded-2xl overflow-hidden flex flex-col relative group shadow-2xl">
              <AnimatePresence mode="wait">
                {!imageUrl && !isGenerating && !error && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-3 border border-white/10">
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-sm font-display font-bold text-white mb-1 uppercase tracking-wider">SYSTEM READY</h3>
                    <p className="text-slate-600 font-mono text-[9px] uppercase tracking-tighter">জেনারেশন শুরু করতে নিচের বাটনে চাপ দিন।</p>
                  </motion.div>
                )}

                {isGenerating && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 font-display font-black text-white text-sm tracking-tighter uppercase italic animate-pulse">
                      {currentUi.status}
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-red-950/20"
                  >
                    <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
                    <h3 className="text-sm font-display font-bold text-red-500 mb-1 uppercase italic tracking-wider">ERROR</h3>
                    <p className="text-red-400/80 mb-4 font-mono text-[10px] leading-relaxed max-w-[200px]">{error}</p>
                    <button 
                      onClick={handleGenerate}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all text-[10px] uppercase"
                    >
                      RETRY
                    </button>
                  </motion.div>
                )}

                {imageUrl && !isGenerating && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 relative h-full w-full"
                  >
                    <img
                      src={imageUrl}
                      alt="Hardcore Output"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 gap-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={handleDownload}
                          className="flex-1 py-2.5 bg-white text-black rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-lg active:scale-95 text-xs"
                        >
                          <Download className="w-4 h-4" />
                          SAVE
                        </button>
                        <button 
                          onClick={() => window.open(imageUrl, '_blank')}
                          className="p-2.5 glass-panel text-white rounded-lg hover:bg-white/10 transition-all active:scale-95"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate Button */}
            <div className="w-full max-w-[200px]">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="group relative w-full py-3 px-6 bg-white text-black hover:bg-slate-200 disabled:bg-zinc-900 disabled:text-zinc-600 rounded-xl font-display font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.95] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                ) : (
                  <Zap className="w-4 h-4 relative z-10" />
                )}
                <span className="relative z-10 italic uppercase tracking-tighter">
                  {isGenerating ? currentUi.status : currentUi.btn}
                </span>
              </button>

              {/* Theme Description Box */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={currentUi.id}
                className="mt-8 p-10 bg-white/[0.03] border border-white/10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-50" />
                
                {isGeneratingDesc ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest animate-pulse">Generating Story...</p>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium relative z-10">
                    {generatedDescription}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
                  <div className="h-[1px] w-8 bg-white/10" />
                  <Sparkles className="w-3 h-3 text-white/20" />
                  <div className="h-[1px] w-8 bg-white/10" />
                </div>
              </motion.div>
            </div>
          </motion.main>
        )}

        {activeTab === 'group' && (
          <motion.div 
            key="group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl flex-1 flex flex-col relative z-10 pb-24 h-[70vh]"
          >
            <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <MessageSquare className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">পাবলিক গ্রুপ চ্যাট</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Global Community</p>
                </div>
              </div>
              <GroupChat />
            </div>
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div 
            key="ai"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl flex-1 flex flex-col relative z-10 pb-24 h-[70vh]"
          >
            <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI সেক্স গাইড</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Private Assistant</p>
                </div>
              </div>
              <AIChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-8 text-center">
        <p className="text-slate-700 font-mono text-[7px] uppercase tracking-[0.4em]">
          STABLE RELEASE v2.0 • 2026
        </p>
      </footer>

      {/* UI Selection Modal */}
      <AnimatePresence>
        {isUiMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm glass-panel rounded-[2rem] overflow-hidden border-white/5 bg-black"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Select Visual UI</h2>
                <button onClick={() => setIsUiMenuOpen(false)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 gap-2">
                {uiOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleUiChange(option)}
                    className={`w-full p-4 rounded-2xl text-left transition-all border ${
                      selectedUi === option.name 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{option.name}</span>
                      {selectedUi === option.name && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-4 bg-white/5 text-center">
                <p className="text-[8px] text-slate-600 uppercase tracking-widest">Interface Engine v2.0</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Dashboard Modal */}
      <ApiDashboard 
        isOpen={isApiOpen} 
        onClose={() => setIsApiOpen(false)} 
      />
    </div>
  );
}
