import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auth, db, rtdb } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, set, get, onDisconnect } from 'firebase/database';
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
  Cloud,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LZString from 'lz-string';
import BioPage from './components/BioPage';

// Optimize secondary components with lazy loading
const LoginPage = lazy(() => import('./components/LoginPage'));
const AdminPage = lazy(() => import('./components/AdminPage'));

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'qr' | 'bio' | 'settings' | 'admin';

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

const DEFAULT_BIO_DATA: BioData = {
  name: 'Rexplorer',
  role: 'Developer',
  avatarUrl: '/default-avatar.jpg',
  links: [
    { label: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    { label: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
    { label: 'Twitter / X', url: 'https://x.com', icon: 'twitter' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
    { label: 'GitHub', url: 'https://github.com', icon: 'github' },
    { label: 'Store', url: 'https://shop.com', icon: 'shop' },
  ]
};

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
  const [showShareToast, setShowShareToast] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);


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
    return DEFAULT_BIO_DATA;
  });

  // 1. Auth & Data Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsInitialLoad(true); // Block auto-save until fetch completes
        setUser(currentUser);
        setShowLoginPopup(false);
        try {
          const docRef = doc(db, 'profiles', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBioData(data as BioData);
            if (data.qrColor) setQrColor(data.qrColor);
            if (data.qrBgColor) setQrBgColor(data.qrBgColor);
            setLastSaved(new Date());
          }
        } catch (e) {
          console.error('Error loading profile:', e);
        } finally {
          setIsInitialLoad(false);
        }
      } else {
        setUser(null);
        setBioData(DEFAULT_BIO_DATA);
        setQrColor('#000000');
        setQrBgColor('#ffffff');
        setIsInitialLoad(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Login Popup Timer
  useEffect(() => {
    if (user) return;

    const timer = setTimeout(() => {
      if (!auth.currentUser && activeTab !== 'settings') {
        setShowLoginPopup(true);
      }
    }, 60000);

    if (searchParams.get('ref') === 'create' && !auth.currentUser) {
      setShowLoginPopup(true);
    }

    return () => clearTimeout(timer);
  }, [activeTab, user]);

  // 2. Real-time User Tracking (RTDB)
  useEffect(() => {
    if (!user) return;

    const trackUser = async () => {
      try {
        let ipData = { ip: 'Unknown', city: 'Unknown', region: 'Unknown', country_name: 'Unknown' };
        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          if (ipRes.ok) {
            ipData = await ipRes.json();
          }
        } catch (e) {
          console.warn('IP fetch blocked or failed');
        }

        const userRef = ref(rtdb, `users/${user.uid}`);

        const baseData = {
          uid: user.uid,
          email: user.email,
          username: bioData.name || 'Unknown',
          lastActive: Date.now(),
          ip: ipData.ip || 'Unknown',
          location: ipData.city !== 'Unknown' ? `${ipData.city}, ${ipData.region}, ${ipData.country_name}` : 'Unknown Location',
          isOnline: true
        };

        // Check for existing data to preserve createdAt
        const snapshot = await get(userRef);
        const existingData = snapshot.val();
        const createdAt = existingData?.createdAt || Date.now();

        // Set data with preserved createdAt
        await set(userRef, { ...baseData, createdAt });

        onDisconnect(userRef).update({
          isOnline: false,
          lastActive: Date.now()
        });

        console.log("Activity tracked (RTDB) for:", user.email);
      } catch (e) {
        console.error('Tracking failed:', e);
      }
    };

    trackUser();

    // Pulse/Heartbeat every 2.5 minutes while logged in
    const interval = setInterval(trackUser, 150000);
    return () => clearInterval(interval);
  }, [user, bioData.name]); // Re-track if name changes too

  // 3. Profile Auto-save
  useEffect(() => {
    if (!user || isInitialLoad) return;

    const timeoutId = setTimeout(async () => {
      setSaving(true);
      try {
        const profileData = {
          ...bioData,
          qrColor,
          qrBgColor,
          updatedAt: Date.now()
        };
        await setDoc(doc(db, 'profiles', user.uid), profileData);
        setLastSaved(new Date());
        console.log('Profile auto-saved successfully');
      } catch (e) {
        console.error('Auto-save failed:', e);
        // If it's a permission error, it might be due to Firestore rules
        if (e instanceof Error && e.message.includes('permission-denied')) {
          console.error('Firestore permission denied. Check security rules.');
        }
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [bioData, user?.uid, qrColor, qrBgColor]);

  const shareableUrl = useMemo(() => {
    if (user && user.uid) {
      return `${window.location.origin}/p?id=${user.uid}`;
    }

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
    let compressed = LZString.compressToEncodedURIComponent(serialized);

    // Safety check: if data is too long for QR (approx 2KB limit safe zone), try removing avatar
    if (compressed.length > 2000) {
      console.warn("Data too long for QR, removing avatar from link");
      const noAvatarData = { ...minifiedData, a: '' };
      compressed = LZString.compressToEncodedURIComponent(JSON.stringify(noAvatarData));
    }

    return `${window.location.origin}/p?d=${compressed}`;
  }, [bioData, qrColor, user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const downloadQR = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    // We target the hidden downloader QR which is always present and high-res
    const svg = document.getElementById('qr-code-downloader');
    if (!svg) {
      console.error('QR element not found');
      return;
    }
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

  const handleShare = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    navigator.clipboard.writeText(shareableUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a050c] text-white selection:bg-[#ce2bee]/30 pb-20 sm:pb-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ce2bee]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#422348]/30 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-[80%] mx-auto py-8 lg:py-12">
        <header className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 space-y-8 md:space-y-0 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row items-center gap-4"
          >
            <div className="w-12 h-12 bg-[#ce2bee] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ce2bee]/20 shrink-0">
              <QrCode className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white to-[#c092c9] bg-clip-text text-transparent">
                AIO REXPO QR
              </h1>
              <p className="text-[#c092c9] text-sm font-medium">All-in-One Generator</p>
            </div>
          </motion.div>

          <nav className="flex bg-[#1f1122]/50 backdrop-blur-xl border border-white/5 p-1 rounded-2xl flex-wrap justify-center sm:justify-start">
            {(['qr', 'bio', 'settings', 'admin'] as Tab[]).map((tab) => {
              if (tab === 'admin' && (!user || user.email !== 'ramunarlapati27@gmail.com')) return null;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 m-0.5",
                    activeTab === tab
                      ? "bg-[#ce2bee] text-white shadow-lg shadow-[#ce2bee]/20 border border-white/10"
                      : "text-[#c092c9] hover:text-white"
                  )}
                >
                  {tab === 'qr' && <QrCode size={16} />}
                  {tab === 'bio' && <User size={16} />}
                  {tab === 'settings' && <Settings size={16} />}
                  {tab === 'admin' && <ShieldAlert size={16} />}
                  {tab.toUpperCase()}
                </button>
              );
            })}
          </nav>
        </header>

        <main>
          {activeTab === 'admin' ? (
            <Suspense fallback={<div className="p-20 flex justify-center"><div className="w-8 h-8 border-4 border-[#ce2bee]/20 border-t-[#ce2bee] rounded-full animate-spin" /></div>}>
              <AdminPage />
            </Suspense>
          ) : (
            <div className="flex flex-col gap-12 max-w-3xl mx-auto">
              {/* Configuration Panel */}
              <motion.div
                layout
                className="space-y-6 sm:space-y-8 w-full"
              >
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
                        <label className="block text-xs font-black text-[#c092c9] mb-3 uppercase tracking-wider">Destination URL</label>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full bg-[#0a050c]/80 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#ce2bee] transition-all font-medium focus:ring-4 focus:ring-[#ce2bee]/10 text-sm sm:text-base"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#c092c9] mb-3 uppercase tracking-wider">QR Color</label>
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
                          <label className="block text-xs font-black text-[#c092c9] mb-3 uppercase tracking-wider">Background</label>
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
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#ce2bee]/10 rounded-lg text-[#ce2bee]">
                          <User size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Bio Customizer</h2>
                      </div>
                      {user && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] uppercase font-bold tracking-wider">
                          {saving ? (
                            <>
                              <div className="w-2 h-2 border-2 border-[#ce2bee]/30 border-t-[#ce2bee] rounded-full animate-spin" />
                              <span className="text-[#ce2bee]">Syncing</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-green-500/70">{lastSaved?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#c092c9] mb-2 uppercase tracking-wider">Name</label>
                          <input
                            type="text"
                            value={bioData.name}
                            onChange={(e) => setBioData({ ...bioData, name: e.target.value })}
                            className="w-full bg-[#0a050c]/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ce2bee] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-[#c092c9] mb-2 uppercase tracking-wider">Role</label>
                          <input
                            type="text"
                            value={bioData.role}
                            onChange={(e) => setBioData({ ...bioData, role: e.target.value })}
                            className="w-full bg-[#0a050c]/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ce2bee] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-[#c092c9] mb-2 uppercase tracking-wider">Avatar</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#0a050c]/50 p-4 rounded-2xl border border-white/5">
                          <div className="w-16 h-16 rounded-full bg-cover bg-center shrink-0 border-2 border-[#ce2bee]/30 shadow-lg" style={{ backgroundImage: `url(${bioData.avatarUrl})` }} />
                          <div className="flex-1 w-full text-center sm:text-left">
                            <label className="flex items-center justify-center sm:justify-start gap-2 cursor-pointer bg-[#ce2bee]/10 hover:bg-[#ce2bee] hover:text-white text-[#ce2bee] px-4 py-2 rounded-xl transition-all w-full sm:w-fit font-bold text-[10px] uppercase tracking-wider">
                              <Upload size={14} />
                              Pick Image
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
                                          // Reduced size to prevent "Data too long" QR error
                                          const size = 100;
                                          canvas.width = size;
                                          canvas.height = size;
                                          const minDim = Math.min(img.width, img.height);
                                          const startX = (img.width - minDim) / 2;
                                          const startY = (img.height - minDim) / 2;
                                          ctx?.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
                                          // Low quality to keep base64 string short for QR code
                                          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
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
                            <p className="text-[10px] text-[#c092c9] mt-2 opacity-50 uppercase font-bold">Square recommended</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-[#c092c9] mb-2 uppercase tracking-wider">Social Links</label>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {bioData.links.map((link: BioLink, idx: number) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-[#0a050c]/50 p-4 rounded-2xl border border-white/5 group hover:border-[#ce2bee]/30 transition-all relative">
                              <select
                                value={link.icon}
                                onChange={(e) => {
                                  const newLinks = [...bioData.links];
                                  newLinks[idx].icon = e.target.value as any;
                                  newLinks[idx].label = e.target.options[e.target.selectedIndex].text;
                                  setBioData({ ...bioData, links: newLinks });
                                }}
                                className="bg-[#1f1122] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-[#ce2bee] w-32"
                              >
                                <option value="instagram">Instagram</option>
                                <option value="youtube">YouTube</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="github">GitHub</option>
                                <option value="facebook">Facebook</option>
                                <option value="tiktok">TikTok</option>
                                <option value="website">Website</option>
                                <option value="shop">Shop</option>
                              </select>
                              <div className="flex-1 flex flex-col gap-1 w-full sm:w-auto">
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
                                className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 text-white/20 hover:text-red-400 p-2 transition-colors shrink-0"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setBioData({ ...bioData, links: [...bioData.links, { label: 'My Website', url: 'https://', icon: 'website' }] })}
                          className="w-full mt-4 bg-[#ce2bee]/10 text-[#ce2bee] hover:bg-[#ce2bee] hover:text-white py-3 rounded-xl border border-[#ce2bee]/30 font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                        >
                          <Plus size={16} /> Add Link
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
                      <h2 className="text-xl font-bold">Account</h2>
                    </div>
                    <div className="bg-[#0a050c]/50 p-6 rounded-2xl border border-white/5 text-center truncate">
                      <p className="text-[#c092c9] text-[10px] mb-1 uppercase tracking-widest font-black">Current Email</p>
                      <p className="text-white font-mono text-sm sm:text-base truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => auth.signOut()}
                      className="w-full bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 py-3 rounded-xl border border-white/10 hover:border-red-500/30 font-bold transition-all text-xs tracking-widest uppercase"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}

                {/* Shared Copy/Download Section */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ce2bee]/5 border border-[#ce2bee]/20 p-5 sm:p-6 rounded-[24px] flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Cloud size={16} className="text-[#ce2bee] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[#ce2bee] text-[10px] font-black uppercase tracking-widest truncate">Profile Link</p>
                          <p className="text-white/40 text-[9px] uppercase font-bold tracking-tighter truncate">Updates instantly</p>
                        </div>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="bg-[#ce2bee] text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#ce2bee]/20 shrink-0"
                      >
                        {copying ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>

                    <div className="flex justify-center py-2">
                      <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg">
                        <QRCodeSVG
                          value={shareableUrl}
                          size={100}
                          fgColor={qrColor}
                          bgColor="#ffffff"
                          level="L"
                          marginSize={0}
                        />
                      </div>
                    </div>

                    <div className="bg-[#0a050c]/80 p-3 rounded-xl border border-white/5 truncate font-mono text-[10px] text-[#c092c9]">
                      {shareableUrl}
                    </div>
                  </motion.div>

                  <div className="flex gap-4">
                    <button
                      onClick={downloadQR}
                      className="flex-1 bg-white text-black h-14 sm:h-16 rounded-[20px] sm:rounded-[24px] font-black text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 hover:scale-[1.02] transition-all active:scale-95 shadow-xl"
                    >
                      <Download size={20} /> <span className="uppercase">Download QR</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1f1122]/50 backdrop-blur-xl border border-white/10 rounded-[24px] flex items-center justify-center hover:bg-[#ce2bee]/20 transition-all group shrink-0 relative"
                    >
                      <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Preview Panel */}
              <div className="w-full flex flex-col items-center pt-8 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {activeTab === 'qr' ? (
                    <motion.div
                      key="qr-preview"
                      initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                      className="bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[56px] shadow-[0_0_80px_rgba(206,43,238,0.3)] flex items-center justify-center border-[12px] border-[#1f1122] w-fit"
                    >
                      <QRCodeSVG
                        id="qr-code-svg"
                        value={activeTab === 'qr' ? (url || window.location.origin) : (shareableUrl || window.location.origin)}
                        size={300}
                        fgColor={qrColor}
                        bgColor={qrBgColor}
                        level="L"
                        includeMargin={false}
                        className="w-full h-full max-w-[300px]"
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
                      className="w-full flex justify-center px-4"
                    >
                      <div className="w-full max-w-md bg-[#0a050c] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
                        <div className="bg-[#1f1122]/80 backdrop-blur-md p-6 border-b border-white/5 text-center">
                          <h2 className="text-white text-base font-bold tracking-tight uppercase tracking-widest">Login / Security</h2>
                        </div>
                        <div className="p-4 sm:p-6">
                          <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#ce2bee]/20 border-t-[#ce2bee] rounded-full animate-spin" /></div>}>
                            <LoginPage />
                          </Suspense>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 sm:mt-12 text-center pb-8 lg:pb-0">
                  <div className="flex items-center gap-2 justify-center text-[#ce2bee] mb-2 font-black uppercase tracking-widest text-[9px] sm:text-[10px]">
                    <div className="w-2 h-2 rounded-full bg-[#ce2bee] animate-ping" />
                    Live Branding Active
                  </div>
                  <p className="text-[11px] sm:text-sm font-medium text-white/40 uppercase tracking-wider">
                    {activeTab === 'qr' ? 'Branded QR Code' : activeTab === 'settings' ? 'Account Settings' : 'Profile Preview'}
                  </p>
                </div>
              </div>
            </div>

          )}
        </main>

        <AnimatePresence>
          {showLoginPopup && !user && activeTab !== 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6"
            >
              <button
                onClick={() => setShowLoginPopup(false)}
                className="absolute inset-0 w-full h-full cursor-default"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="relative max-w-md w-full"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ce2bee] to-[#422348] rounded-[36px] blur-xl opacity-25"></div>

                <div className="relative bg-[#0a050c] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
                  <div className="bg-[#1f1122]/80 backdrop-blur-md p-6 sm:p-8 pb-4 sm:pb-6 border-b border-white/5 relative">
                    <button
                      onClick={() => setShowLoginPopup(false)}
                      className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-[#c092c9] hover:text-white transition-all hover:rotate-90 group/close z-10"
                    >
                      <Plus className="rotate-45 group-hover/close:scale-110" size={20} />
                    </button>

                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ce2bee] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ce2bee]/20">
                        <Cloud className="text-white" size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-black text-white leading-none">Get Started</h2>
                        <p className="text-[#ce2bee] text-[9px] font-bold uppercase tracking-[0.1em] mt-1">100% Free</p>
                      </div>
                    </div>
                    <p className="text-[#c092c9] text-xs sm:text-sm leading-relaxed">
                      Create your all in one QR completely for free.
                    </p>
                  </div>

                  <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#ce2bee]/20 border-t-[#ce2bee] rounded-full animate-spin" /></div>}>
                      <LoginPage />
                    </Suspense>
                  </div>

                  <div className="p-4 bg-[#1f1122]/30 border-t border-white/5 text-center">
                    <p className="text-[9px] text-[#c092c9]/50 uppercase tracking-widest font-black">
                      Powered by Rexplore Technologies
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden High-Res QR for Downloading */}
      <div className="absolute top-0 left-[-9999px] invisible">
        <QRCodeSVG
          id="qr-code-downloader"
          value={activeTab === 'qr' ? (url || window.location.origin) : (shareableUrl || window.location.origin)}
          size={1024}
          fgColor={qrColor}
          bgColor={qrBgColor}
          level="H" // High error correction for best print quality
          includeMargin={true}
        />
      </div>

      <footer className="w-full text-center py-6 mt-12 text-white/20 text-[10px] uppercase font-black tracking-widest border-t border-white/5 bg-[#0a050c]/80 backdrop-blur-md">
        <p>Developed by Rexplore Technologies &copy; 2026</p>
      </footer>

      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#ce2bee] text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2"
          >
            <Check size={18} />
            Link Copied to Clipboard!
          </motion.div>
        )}
      </AnimatePresence>

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
    </div >
  );
}

export default App;
