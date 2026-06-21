import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Signup({ setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/signup', { name, email, password, phone });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            alert('Signup Successful! Welcome to Shiv Shakti 🌸');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-8 md:py-12 px-4 min-h-[70vh] flex flex-col justify-center text-left">
            <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-pink-50 shadow-sm mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 md:mb-2 text-center tracking-tighter">Create Account</h1>
                <p className="text-gray-400 text-center font-medium mb-8 md:mb-10 text-sm md:text-base">Start your glow journey today.</p>

                <form onSubmit={handleSignup} className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl border border-pink-50 bg-pink-50/10 focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-gray-300 text-sm md:text-base"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
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

                    <div className="space-y-2">
                        <label className="block text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl border border-pink-50 bg-pink-50/10 focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-gray-300 text-sm md:text-base"
                            placeholder="+91 12345 67890"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Create Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl border border-pink-50 bg-pink-50/10 focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-gray-300 text-sm md:text-base"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-pink-500/20 hover:bg-pink-600 transition-all active:scale-[0.98] disabled:opacity-50">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 md:mt-10 text-center text-xs md:text-sm font-bold text-gray-400">
                    Already a Customer? <Link to="/login" className="text-pink-500 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
