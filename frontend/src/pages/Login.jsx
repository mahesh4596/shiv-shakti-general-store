import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // 🚀 Pre-warm the server to avoid cold starts
    useEffect(() => {
        api.get('/').catch(() => { }); // Simple ping to wake up the server
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            alert('Login Successful!');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto py-8 md:py-12 px-4 min-h-[70vh] flex flex-col justify-center">
            <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-pink-50 shadow-sm mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 md:mb-2 text-center tracking-tighter">Welcome Back</h1>
                <p className="text-gray-400 text-center font-medium mb-8 md:mb-10 text-sm md:text-base">Continue your glow journey.</p>

                <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2 text-left">
                            <label className="block text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl border border-pink-50 bg-pink-50/10 focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-gray-300 text-sm md:text-base"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="block text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl border border-pink-50 bg-pink-50/10 focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-gray-300 text-sm md:text-base"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-pink-500 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-pink-500/20 hover:bg-pink-600 transition-all active:scale-[0.98]">
                        Sign In
                    </button>
                </form>

                <p className="mt-8 md:mt-10 text-center text-xs md:text-sm font-bold text-gray-400">
                    New to the store? <Link to="/signup" className="text-pink-500 hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
