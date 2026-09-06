import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, Search, RefreshCw, Mail, CheckCircle2, User, HelpCircle, Share2, Copy } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [mode, setMode] = useState('offer');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [createdItem, setCreatedItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !contact) return;
    setLoading(true);

    const endpoint = mode === 'offer' ? `${API_BASE}/offers` : `${API_BASE}/requests`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, description }),
      });
      const data = await res.json();
      setCreatedItem(data.data);
      setMatches(data.matches || []);
      setScreen('matches');
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setScreen('landing')}
          >
            <div className="bg-gradient-to-tr from-indigo-500 to-rose-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">Give<span className="text-indigo-400">Back</span></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-indigo-500/10 text-indigo-300 px-3 py-1.5 rounded-full font-medium border border-indigo-500/20 flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Powered by Google AI
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        
        {/* Landing View */}
        {screen === 'landing' && (
          <div className="text-center py-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
              <Sparkles size={14} /> AI-Powered Generosity Platform
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Give what you have.<br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">Find what you need.</span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Generosity isn't limited to money. Share your skills, time, or experience, or find community members ready to help solve your challenges.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => { setMode('offer'); setScreen('form'); }}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                I can help someone <ArrowRight size={18} />
              </button>
              <button
                onClick={() => { setMode('need'); setScreen('form'); }}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-700 hover:border-slate-600 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                I need help <Search size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Input Form View */}
        {screen === 'form' && (
          <div className="max-w-xl mx-auto w-full bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                {mode === 'offer' ? <Share2 size={22} /> : <HelpCircle size={22} />}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {mode === 'offer' ? 'Offer Support' : 'Request Support'}
              </h2>
            </div>
            <p className="text-sm text-slate-400 mb-8 pl-1">
              {mode === 'offer' 
                ? 'Describe what skills, resources, or time you can share.'
                : 'Describe what you are stuck with or what help you are looking for.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Details</label>
                <input
                  type="text"
                  required
                  placeholder="Email, Telegram handle, or GitHub profile"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Description (Natural Language)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    mode === 'offer'
                      ? 'e.g. I know Flutter and can spend 3 hours this weekend helping someone build their first mobile app.'
                      : 'e.g. I am stuck with Firebase authentication in my Flutter project and need help debugging.'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Analyzing Intent with Gemini...
                  </>
                ) : mode === 'offer' ? (
                  'Find someone I can help'
                ) : (
                  'Find someone who can help'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Matches Results View */}
        {screen === 'matches' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-3xl font-extrabold text-white">Recommended Matches</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Semantic embeddings matched your entry with compatible community members.
                </p>
              </div>
              <button
                onClick={() => { setDescription(''); setScreen('form'); }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold rounded-xl border border-slate-700 text-xs transition self-start sm:self-auto"
              >
                + New {mode === 'offer' ? 'Offer' : 'Request'}
              </button>
            </div>

            {/* Created Item Banner */}
            {createdItem && (
              <div className="bg-indigo-950/40 border border-indigo-500/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 font-bold text-xs uppercase">Your Post</span>
                  <span className="text-slate-200">"{createdItem.description}"</span>
                </div>
                <span className="text-xs bg-slate-900 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20 font-medium self-start sm:self-auto">
                  {createdItem.category}
                </span>
              </div>
            )}

            {/* Match Cards List */}
            {matches.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-16 text-center">
                <p className="text-slate-400 font-medium text-base">No active matches above the relevance threshold yet.</p>
                <p className="text-xs text-slate-500 mt-2">Try adding complementary requests or offers to trigger matching!</p>
              </div>
            ) : (
              <div className="grid gap-5">
                {matches.map((match) => (
                  <div key={match.id} className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl transition-all">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                          {match.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{match.name}</h3>
                          <p className="text-xs text-slate-400">{match.availability_or_urgency}</p>
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-extrabold">
                        {match.match_percentage}% Match
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-slate-300 text-sm leading-relaxed">{match.description}</p>

                    {/* Skill Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {match.skills.map((skill, i) => (
                        <span key={i} className="bg-slate-950 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-lg text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Why This Match Explanation */}
                    <div className="mt-5 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1.5">
                        <Sparkles size={14} /> Why this match?
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {match.explanation}
                      </p>
                    </div>

                    {/* Improved Contact Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">Contact Details:</span>
                        <code className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-indigo-300 text-xs font-mono select-all">
                          {match.contact}
                        </code>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(match.contact, match.id)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          {copiedId === match.id ? (
                            <>
                              <CheckCircle2 size={14} className="text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy Contact
                            </>
                          )}
                        </button>

                        {match.contact.includes('@') && (
                          <a
                            href={`mailto:${match.contact}?subject=GiveBack Match: ${encodeURIComponent(match.description)}`}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                          >
                            <Mail size={14} /> Open Mail
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}