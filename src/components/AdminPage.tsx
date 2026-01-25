import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Shield, Users, Globe, Clock, MapPin, Activity, Mail, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserStatus {
    uid: string;
    email: string;
    username: string;
    lastActive: any;
    createdAt?: any;
    ip: string;
    location: string;
    isOnline: boolean;
}

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<UserStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('lastActive', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                ...doc.data()
            })) as UserStatus[];
            setUsers(usersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'Just now...';
        // Handle Firestore Timestamp objects
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-[#ce2bee]/20 border-t-[#ce2bee] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1f1122]/40 backdrop-blur-2xl border border-white/5 rounded-[24px] lg:rounded-[32px] shadow-2xl p-4 sm:p-6 lg:p-8"
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500 shrink-0">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-white">Security Command</h2>
                        <p className="text-[#c092c9] text-[10px] uppercase tracking-widest font-bold">Admin Panel Access Card</p>
                    </div>
                </div>
                <div className="bg-white/5 w-full sm:w-auto px-4 py-2 rounded-xl flex items-center justify-center sm:justify-start gap-3 border border-white/5">
                    <Users className="text-[#ce2bee]" size={20} />
                    <span className="text-white font-bold">{users.length} Nodes</span>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[#c092c9] text-[10px] uppercase tracking-widest font-black border-b border-white/5">
                            <th className="pb-4 pt-2 px-4">User Details</th>
                            <th className="pb-4 pt-2 px-4">Network Info</th>
                            <th className="pb-4 pt-2 px-4">Geolocation</th>
                            <th className="pb-4 pt-2 px-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-white/20 uppercase font-black tracking-widest text-xs">
                                    No Active Nodes Detected
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.uid} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm tracking-tight">{user.username}</span>
                                            <span className="text-[#c092c9] text-[10px] font-medium">{user.email}</span>
                                            <div className="flex items-center gap-1 mt-1 text-[9px] text-white/30 uppercase font-black">
                                                <Clock size={10} />
                                                Joined: {formatTime(user.createdAt)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 bg-[#0a050c] w-fit px-2 py-1 rounded-md border border-white/5">
                                                <Globe size={12} className="text-[#ce2bee]" />
                                                <span className="text-white font-mono text-[10px]">{user.ip}</span>
                                            </div>
                                            <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">Public IP Node</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-white/80 text-[11px] font-semibold">
                                                <MapPin size={12} className="text-[#ce2bee]" />
                                                {user.location}
                                            </div>
                                            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">via IPAPI</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isOnline ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-white/30 border border-white/10'}`}>
                                                <Activity size={10} className={user.isOnline ? 'animate-pulse' : ''} />
                                                {user.isOnline ? 'Active' : 'Offline'}
                                            </div>
                                            <span className="text-[9px] text-[#c092c9]/60 font-medium tracking-tight mt-1">
                                                {formatTime(user.lastActive)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {users.map((user) => (
                    <div key={user.uid} className="bg-[#0a050c]/60 border border-white/5 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ce2bee]/10 flex items-center justify-center text-[#ce2bee] border border-[#ce2bee]/20">
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">{user.username}</h3>
                                    <div className="flex items-center gap-1 text-[#c092c9] text-[10px]">
                                        <Mail size={10} />
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${user.isOnline ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-white/30 border border-white/10'}`}>
                                <Activity size={8} className={user.isOnline ? 'animate-pulse' : ''} />
                                {user.isOnline ? 'Live' : 'Off'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                            <div className="space-y-1">
                                <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Network</span>
                                <div className="flex items-center gap-1.5 text-white text-[10px] font-mono">
                                    <Globe size={10} className="text-[#ce2bee]" />
                                    {user.ip}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Location</span>
                                <div className="flex items-center gap-1.5 text-white text-[10px] font-medium truncate">
                                    <MapPin size={10} className="text-[#ce2bee] shrink-0" />
                                    {user.location}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 text-[8px] text-white/20 uppercase font-black">
                                <Clock size={10} />
                                Join: {formatTime(user.createdAt)}
                            </div>
                            <div className="text-[8px] text-[#ce2bee]/70 font-bold uppercase tracking-tighter">
                                Last: {formatTime(user.lastActive)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center border-t border-white/5 pt-6">
                <p className="text-[9px] lg:text-[10px] text-white/20 uppercase tracking-[0.2em] font-black text-center">
                    Security Protocol Alpha-9 • Monitoring Shield Active
                </p>
            </div>
        </motion.div>
    );
};

export default AdminPage;
