import React, { useState } from 'react';
import { Heart, Sparkles, User, ArrowRight, CheckCircle2, Search, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function App() {
  const [screen, setScreen] = useState('landing'); // landing, offer, need, matches
  const [mode, setMode] = useState('offer'); // offer or need
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [createdItem, setCreatedItem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) return;
    setLoading(true);

    const endpoint = mode === 'offer' ? `${API_BASE}/offers` : `${API_BASE}/requests`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b bg-white border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setScreen('landing')}
          >
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Heart size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">GiveBack</span>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-100 flex items-center gap-1">
            <Sparkles size={14} /> Powered by Google AI
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        {screen === 'landing' && (
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Give what you have.<br />Find what you need.
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
              Generosity isn't limited to money. GiveBack uses Google AI to semantically connect skills, time, and resources with people who need help.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => { setMode('offer'); setScreen('form'); }}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                I can help someone <ArrowRight size={18} />
              </button>
              <button
                onClick={() => { setMode('need'); setScreen('form'); }}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-300 transition flex items-center justify-center gap-2"
              >
                I need help <Search size={18} />
              </button>
            </div>
          </div>
        )}

        {screen === 'form' && (
          <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {mode === 'offer' ? 'Offer Support' : 'Request Support'}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {mode === 'offer' 
                ? 'Describe what skills, resources, or time you can share.'
                : 'Describe what you are stuck with or what help you are looking for.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
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
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Analyzing with Gemini...
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

        {screen === 'matches' && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Recommended Matches</h2>
                <p className="text-sm text-slate-500">
                  Matches found based on semantic embedding similarity and Gemini intent extraction.
                </p>
              </div>
              <button
                onClick={() => { setDescription(''); setScreen('form'); }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                + New {mode === 'offer' ? 'Offer' : 'Request'}
              </button>
            </div>

            {/* Created Summary */}
            {createdItem && (
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl mb-6 flex flex-wrap gap-2 items-center text-sm">
                <span className="font-semibold text-indigo-900">Your Entry:</span>
                <span className="text-slate-700">"{createdItem.description}"</span>
                <span className="ml-auto bg-indigo-100 text-indigo-800 font-medium px-2.5 py-0.5 rounded-full text-xs uppercase">
                  {createdItem.category}
                </span>
              </div>
            )}

            {matches.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <p className="text-slate-500 font-medium">No matches found above the similarity threshold yet.</p>
                <p className="text-xs text-slate-400 mt-1">Try posting another item to trigger reciprocal matching!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          {match.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{match.name}</h3>
                          <p className="text-xs text-slate-500">{match.availability_or_urgency}</p>
                        </div>
                      </div>
                      <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                        {match.match_percentage}% Match
                      </div>
                    </div>

                    <p className="mt-4 text-slate-700 text-sm">{match.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {match.skills.map((skill, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* "Why This Match?" Section */}
                    <div className="mt-4 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 mb-1">
                        <Sparkles size={14} className="text-indigo-600" />
                        Why this match?
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {match.explanation}
                      </p>
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