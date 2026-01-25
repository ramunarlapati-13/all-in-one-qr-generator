import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Link as LinkIcon,
  User,
  Download,
  Upload,
  Share2,
  Settings,
  Plus,
  Trash2,
  Copy,
  Check,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LZString from 'lz-string';
import BioPage from './components/BioPage';
import LoginPage from './components/LoginPage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'qr' | 'bio' | 'settings';

type IconType = 'instagram' | 'youtube' | 'website' | 'shop' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok' | 'github';

interface BioLink {
  label: string;
  url: string;
  icon: IconType;
}

interface BioData {
  name: string;
  role: string;
  avatarUrl: string;
  links: BioLink[];
}

function App() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('bio');
  const [url, setUrl] = useState('https://raxplore-technologies.vercel.app');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [copying, setCopying] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Bio Page State
  const [bioData, setBioData] = useState<BioData>(() => {
    const dataParam = searchParams.get('d');
    if (dataParam) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(dataParam);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          if (parsed.n || parsed.r) {
            if (parsed.c) setTimeout(() => setQrColor(parsed.c), 0);
            return {
              name: parsed.n || '',
              role: parsed.r || '',
              avatarUrl: parsed.a || '',
              links: Array.isArray(parsed.l) ? parsed.l.map((link: { l: string, u: string, i: IconType }) => ({
                label: link.l,
                url: link.u,
                icon: link.i
              })) : []
            };
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse initial data', e);
      }
    }
    return {
      name: 'Sophia Carter',
      role: 'Digital Artist',
      avatarUrl: '/default-avatar.jpg',
      links: [
        { label: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
        { label: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
        { label: 'Twitter / X', url: 'https://x.com', icon: 'twitter' },
        { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
        { label: 'GitHub', url: 'https://github.com', icon: 'github' },
        { label: 'Store', url: 'https://shop.com', icon: 'shop' },
      ] as BioLink[]
    };
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setShowLoginPopup(false);
        try {
          const docRef = doc(db, 'profiles', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBioData(docSnap.data() as any);
            setLastSaved(new Date());
          }
        } catch (e) {
          console.error('Error loading profile:', e);
        }
      }
    });

    const timer = setTimeout(() => {
      if (!auth.currentUser && activeTab !== 'settings') {
        setShowLoginPopup(true);
      }
    }, 60000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [activeTab]);

  // Auto-save logic
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(async () => {
      setSaving(true);
      try {
        await setDoc(doc(db, 'profiles', user.uid), bioData);
        setLastSaved(new Date());
      } catch (e) {
        console.error('Auto-save failed:', e);
      } finally {
        setSaving(false);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [bioData, user?.uid]);

  const shareableUrl = useMemo(() => {
    const minifiedData = {
      n: bioData.name,
      r: bioData.role,
      a: bioData.avatarUrl,
      l: bioData.links.map((link: BioLink) => ({
        l: link.label,
        u: link.url,
        i: link.icon
      })),
      c: qrColor
    };
    const serialized = JSON.stringify(minifiedData);
    const compressed = LZString.compressToEncodedURIComponent(serialized);
    return `${window.location.origin}/p?d=${compressed}`;
  }, [bioData, qrColor]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a050c] text-white selection:bg-[#ce2bee]/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ce2bee]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#422348]/30 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 space-y-6 md:space-y-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-[#ce2bee] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ce2bee]/20">
              <QrCode className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-[#c092c9] bg-clip-text text-transparent">
                AIO QR
              </h1>
              <p className="text-[#c092c9] text-sm font-medium">All-in-One Generator</p>
            </div>
          </motion.div>

          <nav className="flex bg-[#1f1122]/50 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl">
            {(['qr', 'bio', 'settings'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                  activeTab === tab
                    ? "bg-[#ce2bee] text-white shadow-lg shadow-[#ce2bee]/20 scale-105"
                    : "text-[#c092c9] hover:text-white"
                )}
              >
                {tab === 'qr' && <QrCode size={18} />}
                {tab === 'bio' && <User size={18} />}
                {tab === 'settings' && <Settings size={18} />}
                {tab.toUpperCase()}
              </button>
            ))}
          </nav>
        </header>

        <main className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div layout className="space-y-8">
            {activeTab === 'qr' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1f1122]/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#ce2bee]/10 rounded-lg text-[#ce2bee]">
                    <LinkIcon size={20} />
                  </div>
                  <h2 className="text-xl font-bold">QR Configuration</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-extrabold text-[#c092c9] mb-3 uppercase tracking-wider">Destination URL</label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-[#0a050c]/80 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#ce2bee] transition-all font-medium focus:ring-4 focus:ring-[#ce2bee]/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-extrabold text-[#c092c9] mb-3 uppercase tracking-wider">QR Color</label>
                      <div className="flex items-center gap-3 bg-[#0a050c]/80 border border-white/10 rounded-2xl px-4 py-3">
                        <input
                          type="color"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                        />
                        <span className="font-mono text-xs uppercase font-bold">{qrColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-extrabold text-[#c092c9] mb-3 uppercase tracking-wider">Background</label>
                      <div className="flex items-center gap-3 bg-[#0a050c]/80 border border-white/10 rounded-2xl px-4 py-3">
                        <input
                          type="color"
                          value={qrBgColor}
                          onChange={(e) => setQrBgColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                        />
                        <span className="font-mono text-xs uppercase font-bold">{qrBgColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bio' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1f1122]/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ce2bee]/10 rounded-lg text-[#ce2bee]">
                      <User size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Bio Profile Customizer</h2>
                  </div>
                  {user && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-wider">
                      {saving ? (
                        <>
                          <div className="w-2 h-2 border-2 border-[#ce2bee]/30 border-t-[#ce2bee] rounded-full animate-spin" />
                          <span className="text-[#ce2bee]">Syncing...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-green-500/70">Synced {lastSaved?.toLocaleTimeString()}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-extrabold text-[#c092c9] mb-2 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={bioData.name}
                        onChange={(e) => setBioData({ ...bioData, name: e.target.value })}
                        className="w-full bg-[#0a050c]/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ce2bee] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-extrabold text-[#c092c9] mb-2 uppercase tracking-wider">Role</label>
                      <input
                        type="text"
                        value={bioData.role}
                        onChange={(e) => setBioData({ ...bioData, role: e.target.value })}
                        className="w-full bg-[#0a050c]/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ce2bee] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-[#c092c9] mb-2 uppercase tracking-wider">Avatar</label>
                    <div className="flex gap-4 items-center bg-[#0a050c]/50 p-4 rounded-2xl border border-white/5">
                      <div className="w-16 h-16 rounded-full bg-cover bg-center shrink-0 border-2 border-[#ce2bee]/30" style={{ backgroundImage: `url(${bioData.avatarUrl})` }} />
                      <div className="flex-1">
                        <label className="flex items-center gap-2 cursor-pointer bg-[#ce2bee]/10 hover:bg-[#ce2bee]/20 text-[#ce2bee] px-4 py-2 rounded-xl transition-colors w-fit font-bold text-xs uppercase tracking-wider">
                          <Upload size={16} />
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  const img = new Image();
                                  img.onload = () => {
                                    try {
                                      const canvas = document.createElement('canvas');
                                      const ctx = canvas.getContext('2d');
                                      const size = 300;
                                      canvas.width = size;
                                      canvas.height = size;
                                      const minDim = Math.min(img.width, img.height);
                                      const startX = (img.width - minDim) / 2;
                                      const startY = (img.height - minDim) / 2;
                                      ctx?.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
                                      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                                      setBioData((prev: BioData) => ({ ...prev, avatarUrl: compressedBase64 }));
                                    } catch (err) {
                                      console.error('Canvas processing error:', err);
                                      alert('Failed to process image.');
                                    }
                                  };
                                  img.onerror = () => alert('Failed to load image file.');
                                  img.src = reader.result as string;
                                };
                                reader.onerror = () => alert('Failed to read file.');
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <p className="text-[10px] text-[#c092c9] mt-2">1:1 Square (auto-cropped)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-[#c092c9] mb-2 uppercase tracking-wider">Links</label>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {bioData.links.map((link: BioLink, idx: number) => (
                        <div key={idx} className="flex gap-3 items-center bg-[#0a050c]/50 p-4 rounded-2xl border border-white/5 group hover:border-[#ce2bee]/30 transition-all">
                          <select
                            value={link.icon}
                            onChange={(e) => {
                              const newLinks = [...bioData.links];
                              newLinks[idx].icon = e.target.value as any;
                              newLinks[idx].label = e.target.options[e.target.selectedIndex].text;
                              setBioData({ ...bioData, links: newLinks });
                            }}
                            className="bg-[#1f1122] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-[#ce2bee]"
                          >
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="twitter">X / Twitter</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="github">GitHub</option>
                            <option value="facebook">Facebook</option>
                            <option value="tiktok">TikTok</option>
                            <option value="website">Website</option>
                            <option value="shop">Shop</option>
                          </select>
                          <div className="flex-1 flex flex-col gap-2">
                            <input
                              value={link.label}
                              onChange={(e) => {
                                const newLinks = [...bioData.links];
                                newLinks[idx].label = e.target.value;
                                setBioData({ ...bioData, links: newLinks });
                              }}
                              placeholder="Label"
                              className="bg-transparent border-none outline-none text-sm font-bold w-full"
                            />
                            <input
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...bioData.links];
                                newLinks[idx].url = e.target.value;
                                setBioData({ ...bioData, links: newLinks });
                              }}
                              placeholder="https://..."
                              className="bg-transparent border-none outline-none text-[10px] text-[#c092c9] w-full"
                            />
                          </div>
                          <button
                            onClick={() => setBioData({ ...bioData, links: bioData.links.filter((_: BioLink, i: number) => i !== idx) })}
                            className="text-white/20 hover:text-red-400 p-2 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setBioData({ ...bioData, links: [...bioData.links, { label: 'My Website', url: 'https://', icon: 'website' }] })}
                      className="w-full mt-4 bg-[#ce2bee]/10 text-[#ce2bee] hover:bg-[#ce2bee] hover:text-white py-3 rounded-xl border border-[#ce2bee]/30 font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> ADD NEW SOCIAL LINK
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1f1122]/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <Check size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Account Session</h2>
                </div>
                <div className="bg-[#0a050c]/50 p-6 rounded-2xl border border-white/5 text-center">
                  <p className="text-[#c092c9] text-sm mb-1 uppercase tracking-widest font-bold">Logged in as</p>
                  <p className="text-white font-mono text-lg truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => auth.signOut()}
                  className="w-full bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 py-3 rounded-xl border border-white/10 hover:border-red-500/30 font-bold transition-all"
                >
                  SIGN OUT
                </button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#ce2bee]/5 border border-[#ce2bee]/20 p-6 rounded-[24px] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud size={16} className="text-[#ce2bee]" />
                  <div>
                    <p className="text-[#ce2bee] text-xs font-black uppercase tracking-widest">Shareable Profile Link</p>
                    <p className="text-white/40 text-[10px]">Links update instantly based on your changes</p>
                  </div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="bg-[#ce2bee] text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#ce2bee]/20"
                >
                  {copying ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>

              <div className="flex justify-center py-2">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <QRCodeSVG
                    value={shareableUrl}
                    size={120}
                    fgColor={qrColor}
                    bgColor="#ffffff"
                    level="L"
                    marginSize={0}
                  />
                </div>
              </div>

              <div className="bg-[#0a050c]/80 p-4 rounded-xl border border-white/5 truncate font-mono text-xs text-[#c092c9]">
                {shareableUrl}
              </div>
            </motion.div>

            <div className="flex gap-4">
              <button
                onClick={downloadQR}
                className="flex-1 bg-white text-black h-16 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <Download size={24} /> DOWNLOAD QR
              </button>
              <button className="w-16 h-16 bg-[#1f1122]/50 backdrop-blur-xl border border-white/10 rounded-[24px] flex items-center justify-center hover:bg-[#ce2bee]/20 transition-all group">
                <Share2 size={24} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>

          <div className="relative sticky top-12 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {activeTab === 'qr' ? (
                <motion.div
                  key="qr-preview"
                  initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                  className="bg-white p-12 rounded-[56px] shadow-[0_0_100px_rgba(206,43,238,0.4)] flex items-center justify-center m-auto border-[12px] border-[#1f1122]"
                >
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={activeTab === 'qr' ? url : shareableUrl}
                    size={300}
                    fgColor={qrColor}
                    bgColor={qrBgColor}
                    level="L"
                    includeMargin={false}
                  />
                </motion.div>
              ) : activeTab === 'bio' ? (
                <motion.div
                  key="bio-preview"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -30 }}
                  className="w-full flex justify-center"
                >
                  <BioPage {...bioData} />
                </motion.div>
              ) : (
                <motion.div
                  key="settings-preview"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -30 }}
                  className="w-full flex justify-center"
                >
                  <LoginPage />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showLoginPopup && !user && activeTab !== 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-md w-full"
                  >
                    <button
                      onClick={() => setShowLoginPopup(false)}
                      className="absolute -top-12 right-0 text-white hover:text-[#ce2bee] transition-colors"
                    >
                      <Plus className="rotate-45" size={32} />
                    </button>
                    <LoginPage />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 text-center">
              <div className="flex items-center gap-2 justify-center text-[#ce2bee] mb-2 font-black uppercase tracking-widest text-[10px]">
                <div className="w-2 h-2 rounded-full bg-[#ce2bee] animate-ping" />
                Live Branding Active
              </div>
              <p className="text-sm font-medium text-white/40">
                {activeTab === 'qr' ? 'Branded QR Code' : activeTab === 'settings' ? 'Account Settings' : 'Profile Preview'}
              </p>
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full text-center py-6 mt-12 text-white/20 text-xs text-[#c092c9]">
        <p>Developed by Rexplore Technologies &copy; 2026</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ce2bee;
          border-radius: 10px;
        }
        select option {
          background: #1f1122;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default App;
