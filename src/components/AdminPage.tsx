import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Shield, Users, Clock, Mail, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserStatus {
    uid: string;
    email: string;
    username: string;
    createdAt?: any;
}

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<UserStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We use a listener without orderBy first to ensure we get ALL users
        // even those without a createdAt field yet. We will sort them in memory.
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                ...doc.data()
            })) as UserStatus[];

            // In-memory sort: newest first
            const sortedUsers = usersData.sort((a, b) => {
                const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                return timeB - timeA;
            });

            setUsers(sortedUsers);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'No record';
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
                    <div className="p-3 bg-[#ce2bee]/10 rounded-xl text-[#ce2bee] shrink-0">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-white px-1">User Registry</h2>
                        <p className="text-[#c092c9] text-[10px] uppercase tracking-widest font-bold px-1">Authorized Access Records</p>
                    </div>
                </div>
                <div className="bg-white/5 w-full sm:w-auto px-5 py-2.5 rounded-xl flex items-center justify-center sm:justify-start gap-3 border border-white/5 text-[#ce2bee]">
                    <Users size={20} />
                    <span className="text-white font-bold">{users.length} Total Accounts</span>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[#c092c9] text-[10px] uppercase tracking-widest font-black border-b border-white/5">
                            <th className="pb-4 pt-2 px-4 italic">User Identity</th>
                            <th className="pb-4 pt-2 px-4 text-right italic">Registration Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="py-20 text-center text-white/20 uppercase font-black tracking-widest text-xs">
                                    No User Records Found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.uid} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-base tracking-tight">{user.username}</span>
                                            <span className="text-[#c092c9] text-xs font-medium opacity-70 mt-0.5">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                                                <Clock size={12} />
                                                Joined On
                                            </div>
                                            <span className="text-sm text-[#ce2bee] font-bold tracking-tight">
                                                {formatTime(user.createdAt)}
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
                    <div key={user.uid} className="bg-[#0a050c]/60 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#ce2bee]/10 flex items-center justify-center text-[#ce2bee] border border-[#ce2bee]/20 shadow-inner">
                                <UserIcon size={24} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-white font-bold text-base truncate">{user.username}</h3>
                                <div className="flex items-center gap-1.5 text-[#c092c9] text-[11px] truncate opacity-80 mt-1">
                                    <Mail size={12} />
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[9px] text-white/30 uppercase font-black tracking-widest italic">Member Since</span>
                            <div className="flex items-center gap-1.5 text-[#ce2bee] text-[10px] font-bold uppercase tracking-tight">
                                <Clock size={10} />
                                {formatTime(user.createdAt)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center border-t border-white/5 pt-6">
                <p className="text-[9px] lg:text-[10px] text-white/10 uppercase tracking-[0.3em] font-black text-center">
                    Authorized Access Peak • Monitoring Active
                </p>
            </div>
        </motion.div>
    );
};

export default AdminPage;
