import React, { useState, useMemo } from 'react';
import { Heart, Search, ExternalLink, Trash2, X, Globe, RotateCw } from 'lucide-react';

export interface LikedSite {
  id: string;
  url: string;
  host: string;
  query: string;
  platform: string;
  likedAt: number;
}

interface LikedSitesModalProps {
  likedSites: LikedSite[];
  onSelectSite: (site: LikedSite) => void;
  onRemoveSite: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const LikedSitesModal: React.FC<LikedSitesModalProps> = ({
  likedSites,
  onSelectSite,
  onRemoveSite,
  onClearAll,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSites = useMemo(() => {
    if (!searchTerm.trim()) return likedSites;
    const q = searchTerm.toLowerCase().trim();
    return likedSites.filter(
      (s) =>
        s.host.toLowerCase().includes(q) ||
        s.query.toLowerCase().includes(q) ||
        s.platform.toLowerCase().includes(q)
    );
  }, [likedSites, searchTerm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[85vh] rounded-2xl bg-[#171a21] border border-[#262b36] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262b36] flex-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Heart className="w-4 h-4 fill-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm sm:text-base leading-tight">
                Liked Sites History
              </h2>
              <span className="text-[11px] text-slate-400">
                Kul {likedSites.length} site(s) saved
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {likedSites.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Kya aap sach me saari liked sites delete karna chahte hain?')) {
                    onClearAll();
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-red-500/10 transition"
                title="Saari list clear karein"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search filter for large lists (60-300+ sites) */}
        {likedSites.length > 3 && (
          <div className="p-3 border-b border-[#262b36]/60 bg-[#12151c]">
            <div className="flex items-center bg-[#0f1115] border border-[#262b36] focus-within:border-[#4f8cff] rounded-xl px-3 py-1.5 transition">
              <Search className="w-4 h-4 text-slate-500 mr-2 flex-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Liked sites search karein (e.g. vercel, portfolio)..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-500 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sites List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredSites.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Heart className="w-10 h-10 mx-auto text-slate-700 mb-2 stroke-[1.5]" />
              {likedSites.length === 0 ? (
                <>
                  <p className="text-sm font-medium text-slate-400">Abhi koi site like nahi ki gayi hai</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Jab koi site open ho, to screen ke bottom-left par bane ❤️ button ko click karke yahan save karein.
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-400">&apos;{searchTerm}&apos; ke liye koi site nahi mili.</p>
              )}
            </div>
          ) : (
            filteredSites.map((site) => (
              <div
                key={site.id}
                className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#0f1115] hover:bg-[#1a1e27] border border-[#262b36] hover:border-blue-500/30 transition-all shadow-sm"
              >
                {/* Clickable site entry */}
                <div
                  onClick={() => onSelectSite(site)}
                  className="flex-1 min-w-0 cursor-pointer pr-3"
                  title="Click karke is site ko reload karein"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-3.5 h-3.5 text-blue-400 flex-none" />
                    <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-blue-400 transition truncate">
                      {site.host}
                    </span>
                    <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-none">
                      {site.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono truncate">
                    <span className="truncate">{site.url}</span>
                    <span className="text-slate-600 flex-none">•</span>
                    <span className="text-slate-500 text-[10px] flex-none">
                      {new Date(site.likedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-none">
                  <button
                    onClick={() => onSelectSite(site)}
                    className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white transition"
                    title="Reload site in app"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => window.open(site.url, '_blank', 'noopener,noreferrer')}
                    className="p-1.5 rounded-lg bg-[#171a21] hover:bg-[#262b36] text-slate-400 hover:text-white transition"
                    title="Naye tab me kholo ↗"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveSite(site.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition"
                    title="Unlike / Delete karein"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {likedSites.length > 0 && (
          <div className="px-4 py-2 border-t border-[#262b36] bg-[#12151c] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Kisi bhi site par click karke turant app me reload karein</span>
            <span className="font-mono text-slate-500">{filteredSites.length} items</span>
          </div>
        )}
      </div>
    </div>
  );
};
