import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = async () => {
        setError('');
        setMessage('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            console.error("Google Sign In Error:", err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign in cancelled.');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Google Sign In is not enabled in Firebase Console.');
            } else if (err.code === 'auth/unauthorized-domain') {
                setError('This domain is not authorized in Firebase Console.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async () => {
        setError('');
        setMessage('');
        setLoading(true);

        if (mode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            if (mode === 'signin') {
                await signInWithEmailAndPassword(auth, email, password);
            } else if (mode === 'signup') {
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Account created successfully!');
            } else if (mode === 'forgot') {
                if (!email) {
                    setError('Please enter your email address first.');
                    setLoading(false);
                    return;
                }
                await sendPasswordResetEmail(auth, email);
                setMessage('Password reset email sent! Check your inbox.');
            }
        } catch (err: any) {
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid credentials, please check Email or Password');
            } else if (err.code === 'auth/email-already-in-use') {
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
            className="relative flex h-full w-full flex-col bg-transparent dark justify-between group/design-root overflow-x-hidden"
            style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
        >
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-center max-w-[480px] w-full mx-auto">
                    {user ? (
                        <div className="flex flex-col items-center gap-6 p-8">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 shadow-lg shadow-green-500/20">
                                <CheckCircle size={40} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-white text-2xl font-bold">Successfully Logged In</h3>
                                <p className="text-[#c092c9] text-base">You are signed in as:</p>
                                <p className="text-white font-mono bg-[#362839] px-4 py-2 rounded-xl border border-white/5 truncate max-w-full">{user.email}</p>
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
                                {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                            </h3>

                            {mode !== 'forgot' && (
                                <div className="px-4 py-2">
                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="flex w-full items-center justify-center gap-3 bg-white hover:bg-white/90 text-black font-bold h-12 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 48 48">
                                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.308,44,32.44,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                        </svg>
                                        Continue with Google
                                    </button>

                                    <div className="flex items-center gap-4 my-6">
                                        <div className="h-[1px] bg-white/10 flex-1"></div>
                                        <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">OR</span>
                                        <div className="h-[1px] bg-white/10 flex-1"></div>
                                    </div>
                                </div>
                            )}
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
                            {mode !== 'forgot' && (
                                <>
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
                                    {mode === 'signin' && (
                                        <div className="flex justify-end px-4 -mt-2">
                                            <button
                                                onClick={() => setMode('forgot')}
                                                className="text-[#b49db9] hover:text-[#ce2bee] text-xs font-semibold"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {error && <p className="text-red-400 text-sm px-4 text-center mt-2">{error}</p>}
                            {message && (
                                <div className="flex flex-col items-center gap-2 px-4 mt-2">
                                    <p className="text-green-400 text-sm text-center">{message}</p>
                                    <button
                                        onClick={() => setMode('signin')}
                                        className="text-[#ce2bee] text-xs font-bold uppercase tracking-widest hover:underline mt-1"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            )}

                            <div className="flex px-4 py-3 mt-2">
                                <button
                                    onClick={handleAuth}
                                    disabled={loading}
                                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-[#ce2bee] hover:bg-[#b024cc] transition-all hover:scale-[1.02] active:scale-95 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#ce2bee]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="truncate">
                                        {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link')}
                                    </span>
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 mt-4 text-center px-4">
                                <div className="flex justify-center gap-1 text-sm">
                                    <p className="text-[#b49db9] font-normal leading-normal">
                                        {mode === 'signin' ? "Don't have an account?" : mode === 'signup' ? "Already have an account?" : "Remembered it?"}
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
