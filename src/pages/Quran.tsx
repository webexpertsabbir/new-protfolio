import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Book, 
  Search, 
  ChevronLeft, 
  Loader2, 
  BookType, 
  Hash, 
  Globe,
  Settings2,
  X,
  Volume2,
  Pause
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  audio?: string;
}

interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
}

export default function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [translationDetail, setTranslationDetail] = useState<{ ayahs: Ayah[] } | null>(null);
  const [audioDetail, setAudioDetail] = useState<{ ayahs: Ayah[] } | null>(null);
  const [translationLang, setTranslationLang] = useState<string>("en.sahih");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [showTranslation, setShowTranslation] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isFullSurahPlaying, setIsFullSurahPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSurahs();
    fetchEditions();
  }, []);

  useEffect(() => {
    if (selectedSurah) {
      fetchTranslationOnly(selectedSurah);
    }
  }, [translationLang]);

  const fetchSurahs = async () => {
    try {
      const response = await fetch("https://api.alquran.cloud/v1/surah");
      const data = await response.json();
      setSurahs(data.data);
    } catch (error) {
      console.error("Error fetching surahs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditions = async () => {
    try {
      const response = await fetch("https://api.alquran.cloud/v1/edition?type=translation&format=text");
      const data = await response.json();
      // Only keep one edition per language for simplicity, or just keep all
      setEditions(data.data);
    } catch (error) {
      console.error("Error fetching editions:", error);
    }
  };

  const fetchTranslationOnly = async (number: number) => {
    try {
      const translationRes = await fetch(`https://api.alquran.cloud/v1/surah/${number}/${translationLang}`);
      const translationData = await translationRes.json();
      setTranslationDetail(translationData.data);
    } catch (error) {
      console.error("Error fetching translation:", error);
    }
  };

  const fetchSurahDetail = async (number: number) => {
    setLoadingDetail(true);
    try {
      // Fetch Arabic
      const arabicRes = await fetch(`https://api.alquran.cloud/v1/surah/${number}`);
      const arabicData = await arabicRes.json();
      
      // Fetch Selected Translation
      const translationRes = await fetch(`https://api.alquran.cloud/v1/surah/${number}/${translationLang}`);
      const translationData = await translationRes.json();

      // Fetch Audio (Recitation)
      const audioRes = await fetch(`https://api.alquran.cloud/v1/surah/${number}/ar.alafasy`);
      const audioData = await audioRes.json();

      setSurahDetail(arabicData.data);
      setTranslationDetail(translationData.data);
      setAudioDetail(audioData.data);
    } catch (error) {
      console.error("Error fetching surah details:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSurahClick = (number: number) => {
    if (audioPlayer) {
      audioPlayer.pause();
      setPlayingAyah(null);
    }
    setSelectedSurah(number);
    fetchSurahDetail(number);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const playAudio = (url: string, ayahNumber: number, isSequential: boolean = false) => {
    if (audioPlayer) {
      audioPlayer.pause();
      if (playingAyah === ayahNumber && !isSequential) {
        setPlayingAyah(null);
        setIsFullSurahPlaying(false);
        return;
      }
    }

    const audio = new Audio(url);
    setAudioPlayer(audio);
    setPlayingAyah(ayahNumber);
    
    audio.play();
    audio.onended = () => {
      setPlayingAyah(null);
      
      // Handle sequential playback
      if (isSequential && audioDetail && surahDetail) {
        const nextIndex = audioDetail.ayahs.findIndex(a => a.number === ayahNumber) + 1;
        if (nextIndex < audioDetail.ayahs.length) {
          const nextAyah = audioDetail.ayahs[nextIndex];
          playAudio(nextAyah.audio!, nextAyah.number, true);
        } else {
          setIsFullSurahPlaying(false);
        }
      } else {
        setIsFullSurahPlaying(false);
      }
    };
  };

  const startFullPlayback = () => {
    if (audioDetail && audioDetail.ayahs.length > 0) {
      if (isFullSurahPlaying) {
        audioPlayer?.pause();
        setPlayingAyah(null);
        setIsFullSurahPlaying(false);
      } else {
        setIsFullSurahPlaying(true);
        const firstAyah = audioDetail.ayahs[0];
        playAudio(firstAyah.audio!, firstAyah.number, true);
      }
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.number.toString().includes(searchTerm) ||
    s.name.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
          <p className="text-white/40 uppercase tracking-widest text-xs font-bold animate-pulse">Loading Holy Quran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-brand-dark">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedSurah ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-white mb-4">
                    Holy <span className="text-brand-orange">Quran</span>
                  </h1>
                  <p className="text-white/60 max-w-md text-sm uppercase tracking-widest leading-relaxed">
                    Explore the divine wisdom and guidance in every verse. Select a surah to begin your spiritual journey.
                  </p>
                </div>
                
                <div className="relative group w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-orange transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search Surah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50 transition-all font-display"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSurahs.map((surah) => (
                  <motion.div
                    key={surah.number}
                    whileHover={{ y: -5 }}
                    onClick={() => handleSurahClick(surah.number)}
                    className="group relative bg-white/5 border border-white/5 rounded-3xl p-6 cursor-pointer hover:border-brand-orange/30 hover:bg-brand-orange/[0.02] transition-all overflow-hidden"
                  >
                    {/* Number Background */}
                    <div className="absolute -right-4 -bottom-4 text-9xl font-display font-black text-white/[0.02] pointer-events-none group-hover:text-brand-orange/[0.03] transition-colors">
                      {surah.number}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange transition-colors">
                          <span className="text-brand-orange group-hover:text-white font-display font-bold">{surah.number}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-arabic text-white group-hover:text-brand-orange transition-colors">{surah.name}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">{surah.englishName}</h3>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{surah.englishNameTranslation}</p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                            <Hash className="w-3 h-3" />
                            {surah.numberOfAyahs} Verses
                          </div>
                          <div className="flex items-center gap-1.5 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                            <Globe className="w-3 h-3" />
                            {surah.revelationType}
                          </div>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-brand-orange rotate-180 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* Detail Header */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setSelectedSurah(null)}
                  className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-orange group-hover:bg-brand-orange/10 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Back to Index</span>
                </button>

                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={cn(
                    "p-3 rounded-full border border-white/10 transition-all",
                    showSettings ? "bg-brand-orange border-brand-orange text-white" : "text-white/40 hover:text-white"
                  )}
                >
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 flex flex-wrap gap-12">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Font Size</label>
                        <div className="flex items-center gap-6">
                          <input 
                            type="range" 
                            min="16" 
                            max="48" 
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-48 accent-brand-orange"
                          />
                          <span className="text-sm font-display text-white">{fontSize}px</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Translation Visibility</label>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setShowTranslation(!showTranslation)}
                            className={cn(
                              "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] border transition-all",
                              showTranslation 
                                ? "bg-brand-orange/10 border-brand-orange text-brand-orange" 
                                : "border-white/10 text-white/40 hover:border-white/20"
                            )}
                          >
                            {showTranslation ? "Enabled" : "Disabled"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {loadingDetail ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em]">Retrieving Verses...</p>
                  </div>
                </div>
              ) : surahDetail && (
                <div className="space-y-24">
                  {/* Language Selector */}
                  <div className="flex flex-col items-center gap-4 py-8 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Select Translation Language</span>
                    <div className="relative w-full max-w-xs">
                      <select 
                        value={translationLang}
                        onChange={(e) => setTranslationLang(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-orange shadow-lg transition-all appearance-none cursor-pointer"
                      >
                        {editions.length > 0 ? (
                          editions.map((edition) => (
                            <option key={edition.identifier} value={edition.identifier} className="bg-brand-dark text-white">
                              {edition.englishName} ({edition.language.toUpperCase()})
                            </option>
                          ))
                        ) : (
                          <option value="en.sahih">English (Sahih International)</option>
                        )}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                         <Globe className="w-4 h-4 text-brand-orange" />
                      </div>
                    </div>
                  </div>

                  {/* Surah Banner */}
                  <div className="text-center relative py-12">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-display font-black text-white/[0.02] pointer-events-none whitespace-nowrap">
                       {surahDetail.number}
                     </div>
                     <div className="relative z-10">
                       <p className="text-brand-orange text-xs font-bold uppercase tracking-[0.4em] mb-4">Surah</p>
                       <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter text-white mb-4">
                         {surahDetail.englishName}
                       </h2>
                       <p className="text-3xl md:text-5xl font-arabic text-white/80 mb-6">{surahDetail.name}</p>
                       <div className="flex items-center justify-center gap-8 mb-8">
                         <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                           <Hash className="w-3 h-3 text-brand-orange" />
                           {surahDetail.numberOfAyahs} Ayahs
                         </div>
                         <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                           <Globe className="w-3 h-3 text-brand-orange" />
                           {surahDetail.revelationType}
                         </div>
                       </div>

                       <div className="flex justify-center">
                         <button 
                           onClick={startFullPlayback}
                           className={cn(
                             "px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all",
                             isFullSurahPlaying 
                               ? "bg-brand-orange text-white shadow-xl shadow-brand-orange/20" 
                               : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                           )}
                         >
                           {isFullSurahPlaying ? (
                             <>
                               <Pause className="w-4 h-4" /> Stop Recitation
                             </>
                           ) : (
                             <>
                               <Volume2 className="w-4 h-4 text-brand-orange" /> Play Full Surah
                             </>
                           )}
                         </button>
                       </div>
                     </div>
                  </div>

                  {/* Verses */}
                  <div className="space-y-12 max-w-4xl mx-auto">
                    {/* Bismillah */}
                    {surahDetail.number !== 1 && surahDetail.number !== 9 && (
                      <div className="text-center py-12 border-y border-white/5">
                        <p className="text-4xl font-arabic text-white mb-4">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                        <p className="text-white/40 text-xs italic tracking-wide">In the name of Allah, the Entirely Merciful, the Especially Merciful.</p>
                      </div>
                    )}

                    {surahDetail.ayahs.map((ayah, index) => {
                      // Remove Bismillah from text if it's already there and not Fatiha
                      let verseText = ayah.text;
                      if (surahDetail.number !== 1 && index === 0) {
                        verseText = verseText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "").trim();
                      }

                      return (
                        <div 
                          key={ayah.number}
                          className="group relative space-y-8 pb-12 border-b border-white/5 last:border-0"
                        >
                          {/* Ayah Number Badge */}
                          <div className="absolute -left-16 top-0 hidden xl:flex flex-col items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-white/40">{ayah.numberInSurah}</span>
                            <div className="w-[1px] h-12 bg-gradient-to-b from-brand-orange to-transparent" />
                          </div>

                          <div className="flex flex-col gap-8">
                            <div className="flex items-start justify-between gap-8">
                              <button 
                                onClick={() => audioDetail?.ayahs[index].audio && playAudio(audioDetail.ayahs[index].audio, ayah.number)}
                                className={cn(
                                  "mt-2 p-3 rounded-full border transition-all shrink-0",
                                  playingAyah === ayah.number 
                                    ? "bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20" 
                                    : "border-white/10 text-white/40 hover:border-brand-orange hover:text-brand-orange"
                                )}
                              >
                                {playingAyah === ayah.number ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </button>

                              <p 
                                className="text-right leading-loose font-arabic text-white/90 hover:text-white transition-colors"
                                style={{ fontSize: `${fontSize}px` }}
                                dir="rtl"
                              >
                                {verseText}
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-brand-orange/30 text-[10px] font-display font-medium text-brand-orange mr-4">
                                  {ayah.numberInSurah}
                                </span>
                              </p>
                            </div>

                            {showTranslation && translationDetail && (
                              <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 group-hover:border-brand-orange/20 transition-all">
                                <p className="text-white/70 leading-relaxed text-sm md:text-base font-medium">
                                  {translationDetail.ayahs[index].text}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-12 border-t border-white/5">
                     <button 
                       disabled={surahDetail.number === 1}
                       onClick={() => handleSurahClick(surahDetail.number - 1)}
                       className="flex items-center gap-4 text-white group disabled:opacity-20"
                     >
                       <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all">
                         <ChevronLeft className="w-6 h-6" />
                       </div>
                       <div className="text-left">
                         <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Previous</p>
                         <p className="text-xs font-bold uppercase tracking-widest">Surah</p>
                       </div>
                     </button>

                     <button 
                       disabled={surahDetail.number === 114}
                       onClick={() => handleSurahClick(surahDetail.number + 1)}
                       className="flex items-center gap-4 text-white group text-right disabled:opacity-20"
                     >
                       <div className="text-right">
                         <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Next</p>
                         <p className="text-xs font-bold uppercase tracking-widest">Surah</p>
                       </div>
                       <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all">
                         <ChevronLeft className="w-6 h-6 rotate-180" />
                       </div>
                     </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
