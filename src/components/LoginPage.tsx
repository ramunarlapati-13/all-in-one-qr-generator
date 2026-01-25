import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleAuth = async () => {
        setError('');
        setLoading(true);

        if (mode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            if (mode === 'signin') {
                await signInWithEmailAndPassword(auth, email, password);
                alert('Signed in successfully!');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Account created successfully!');
            }
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please sign in instead.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative flex h-full min-h-[600px] w-full flex-col bg-[#171118] dark justify-between group/design-root overflow-x-hidden shadow-2xl overflow-hidden rounded-[32px] border border-white/10"
            style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
        >
            <div className="flex-1 flex flex-col">
                <div className="flex items-center bg-[#171118] p-4 pb-2 justify-between border-b border-white/5">
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">Settings</h2>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-[480px] w-full mx-auto">
                    {user ? (
                        <div className="flex flex-col items-center gap-6 p-8">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 shadow-lg shadow-green-500/20">
                                <CheckCircle size={40} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-white text-2xl font-bold">Successfully Logged In</h3>
                                <p className="text-[#c092c9] text-base">You are signed in as:</p>
                                <p className="text-white font-mono bg-[#362839] px-4 py-2 rounded-xl border border-white/5">{user.email}</p>
                            </div>
                            <button
                                onClick={() => auth.signOut()}
                                className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all border border-white/10 hover:border-red-500/30 font-bold"
                            >
                                <span className="truncate">Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-4 pt-4 text-center">
                                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                            </h3>
                            <div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <input
                                        placeholder="Email"
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#ce2bee]/50 border-none bg-[#362839] focus:border-none h-14 placeholder:text-[#b49db9] p-4 text-base font-normal leading-normal transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="flex w-full flex-wrap items-end gap-4 px-4 py-3 relative">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <input
                                        placeholder="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#ce2bee]/50 border-none bg-[#362839] focus:border-none h-14 placeholder:text-[#b49db9] p-4 pr-12 text-base font-normal leading-normal transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </label>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-[#b49db9] hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {mode === 'signup' && (
                                <div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <input
                                            placeholder="Confirm Password"
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#ce2bee]/50 border-none bg-[#362839] focus:border-none h-14 placeholder:text-[#b49db9] p-4 text-base font-normal leading-normal transition-all"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </label>
                                </div>
                            )}
                            {error && <p className="text-red-400 text-sm px-4 text-center">{error}</p>}
                            <div className="flex px-4 py-3 mt-2">
                                <button
                                    onClick={handleAuth}
                                    disabled={loading}
                                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-[#ce2bee] hover:bg-[#b024cc] transition-all hover:scale-[1.02] active:scale-95 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#ce2bee]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="truncate">{loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}</span>
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 mt-4 text-center px-4">
                                <div className="flex justify-center gap-1 text-sm">
                                    <p className="text-[#b49db9] font-normal leading-normal">
                                        {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                                    </p>
                                    <button
                                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                        className="text-[#ce2bee] font-bold leading-normal cursor-pointer hover:underline bg-transparent border-none"
                                    >
                                        {mode === 'signin' ? "Create an Account" : "Sign in here"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
