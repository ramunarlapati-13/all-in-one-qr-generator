import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                alert('Signed in successfully!');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Account created successfully!');
            }
        } catch (err: any) {
            setError(err.message);
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
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
                            <div className="text-white" data-icon="Gear" data-size="24px" data-weight="regular">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                    <path
                                        d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"
                                    ></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-[480px] w-full mx-auto">
                    <h3 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-4 pt-4 text-center">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
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
                    <div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                            <input
                                placeholder="Password"
                                type="password"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#ce2bee]/50 border-none bg-[#362839] focus:border-none h-14 placeholder:text-[#b49db9] p-4 text-base font-normal leading-normal transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                    </div>
                    {error && <p className="text-red-400 text-sm px-4 text-center">{error}</p>}
                    <div className="flex px-4 py-3 mt-2">
                        <button
                            onClick={handleAuth}
                            disabled={loading}
                            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-[#ce2bee] hover:bg-[#b024cc] transition-all hover:scale-[1.02] active:scale-95 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#ce2bee]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-1 mt-4">
                        <p className="text-[#b49db9] text-sm font-normal leading-normal px-4 text-center">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#ce2bee] text-sm font-bold leading-normal px-4 text-center cursor-pointer hover:underline bg-transparent border-none"
                        >
                            {isLogin ? "Create an Account" : "Sign in here"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
