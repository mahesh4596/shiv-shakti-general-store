import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Eye, Star, Heart, Sparkles, ShieldCheck, Truck } from 'lucide-react';

function Home({ addToCart }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { category } = useParams();

    useEffect(() => {
        // 🚀 Instant Load: Try to load from cache first
        const cachedProducts = localStorage.getItem('cached_products');
        if (cachedProducts) {
            setProducts(JSON.parse(cachedProducts));
            setLoading(false);
        }

        api.get('/products')
            .then(res => {
                setProducts(res.data);
                localStorage.setItem('cached_products', JSON.stringify(res.data)); // Update cache
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                if (!cachedProducts) setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (category) {
            setFilteredProducts(products.filter(p => p.category.toLowerCase() === category.toLowerCase()));
        } else {
            setFilteredProducts(products);
        }
    }, [category, products]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-pink-500 font-medium animate-pulse text-lg">Preparing your glow...</p>
        </div>
    );

    return (
        <div className="space-y-12 md:space-y-20">
            {/* Hero Section */}
            {!category && (
                <section className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-6 md:p-20 shadow-inner mb-12 md:mb-0">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="lg:w-1/2 space-y-6 md:space-y-10 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/50">
                                <Sparkles size={16} className="text-pink-500" />
                                <span className="text-pink-700 text-[10px] md:text-xs font-black uppercase tracking-widest">New Arrival 2026</span>
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black text-gray-900 leading-tight md:leading-[0.9] tracking-tighter">
                                SHIV SHAKTI <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 font-serif italic font-normal text-3xl md:text-6xl px-1">General Store.</span>
                            </h1>
                            <p className="text-gray-600 text-lg md:text-2xl max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
                                Experience the luxury of premium skincare and artisanal jewellery.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                                <button className="w-full sm:w-auto bg-pink-500 text-white px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-bold hover:bg-pink-600 transition-all shadow-2xl shadow-pink-200 active:scale-95">
                                    Shop Collection
                                </button>
                                <div className="flex -space-x-4 items-center">
                                    {[1, 2, 3, 4].map(i => (
                                        <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="User" />
                                    ))}
                                    <div className="pl-6">
                                        <p className="text-sm font-bold text-gray-800">10k+ Happy Customers</p>
                                        <div className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative group">
                            <div className="absolute top-0 right-0 w-full h-full bg-pink-300/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
                                alt="Product Showcase"
                                className="rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(255,133,162,0.3)] transform lg:rotate-3 group-hover:rotate-0 transition-all duration-700 w-full max-w-lg mx-auto"
                            />
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-pink-50 animate-bounce group-hover:animate-none">
                                <p className="text-pink-500 font-black text-4xl">4.9</p>
                                <p className="text-xs text-gray-400 font-bold uppercase">Average Rating</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Trust Badges */}
            {!category && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 mb-16 md:mb-0">
                    {[
                        { icon: ShieldCheck, title: "100% Secure", desc: "Razorpay Protected" },
                        { icon: Truck, title: "Fast Delivery", desc: "2-3 Days Shipping" },
                        { icon: Sparkles, title: "Premium Quality", desc: "Handpicked Brands" },
                        { icon: Heart, title: "Cruelty Free", desc: "No Animal Testing" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center space-y-3 group">
                            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                                <item.icon size={28} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">{item.title}</h4>
                                <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Categories Horizontal Scroll */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-pink-100 pb-8 mb-4 md:mb-0">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        {category ? `${category} Designs` : "Shop Beauty & Beyond"}
                    </h2>
                    <p className="text-gray-400 mt-3 text-lg">Curated with love for your daily routine.</p>
                </div>
                <div className="flex overflow-x-auto pb-4 md:pb-0 gap-3 no-scrollbar">
                    {['Lipstick', 'Jewellery', 'Facewash', 'Soap', 'Skincare', 'Blush', 'Eyeliner', 'Eyeshadow'].map(cat => (
                        <Link
                            key={cat}
                            to={`/category/${cat.toLowerCase()}`}
                            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border ${category?.toLowerCase() === cat.toLowerCase()
                                ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200'
                                : 'bg-white text-gray-500 border-pink-100 hover:border-pink-300 hover:text-pink-500'
                                }`}
                        >
                            {cat}
                        </Link>
                    ))}
                    {category && (
                        <Link to="/" className="px-6 py-3 rounded-full font-bold bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 transition-all">
                            Clear All
                        </Link>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-12 md:mb-0">
                {filteredProducts.map(product => (
                    <div key={product._id} className="group relative bg-white rounded-[2.5rem] p-5 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(255,133,162,0.2)] border border-transparent hover:border-pink-50">
                        <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] mb-6 bg-pink-50">
                            <img
                                src={product.images?.[0] || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-700"
                            />
                            <div className="absolute inset-x-4 bottom-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-white/90 backdrop-blur-md text-pink-500 py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 hover:bg-pink-500 hover:text-white transition-all active:scale-95"
                                >
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                            </div>
                        </div>

                        <div className="px-2 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 px-3 py-1 bg-pink-50 rounded-lg">{product.category}</span>
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                                    <span className="text-xs font-black text-gray-700">4.9</span>
                                </div>
                            </div>
                            <Link to={`/product/${product._id}`} className="block">
                                <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-pink-500 transition-colors tracking-tight">{product.name}</h3>
                            </Link>
                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                            <div className="flex items-center justify-between pt-3">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 line-through">₹{Math.round(product.price * 1.5)}</span>
                                    <span className="text-2xl font-black text-gray-900 leading-none">₹{product.price}</span>
                                </div>
                                <Link to={`/product/${product._id}`} className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all">
                                    <Eye size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-40 bg-pink-50 rounded-[3rem] border-2 border-dashed border-pink-200">
                    <p className="text-pink-300 text-6xl mb-6 font-serif underline decoration-pink-100">Coming Soon</p>
                    <p className="text-gray-500 text-xl font-medium">Our master artisans are crafting new pieces for this collection.</p>
                    <Link to="/" className="btn-primary mt-8 inline-block px-10">Back to Shop</Link>
                </div>
            )}

            {/* Premium Boutique Newsletter Section */}
            <section className="relative py-12 md:py-28 px-4 overflow-hidden">
                {/* Background Art */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(255,133,162,0.1),_transparent_50%)] -z-10"></div>

                <div className="max-w-5xl mx-auto">
                    <div className="relative bg-white rounded-[2rem] md:rounded-[4rem] p-6 sm:p-12 md:p-24 shadow-[0_50px_100px_-30px_rgba(255,133,162,0.2)] border border-pink-50 text-center overflow-hidden">

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-50 rounded-full animate-pulse blur-3xl opacity-60"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-50 rounded-full animate-pulse blur-3xl opacity-60"></div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-8 md:space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1] md:leading-none">
                                    Join the <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">Glow Community.</span>
                                </h2>
                                <p className="text-gray-400 text-sm md:text-xl font-medium leading-relaxed">
                                    Subscribe to receive curated beauty secrets and early access to new drops.
                                </p>
                            </div>

                            <form
                                className="relative group w-full"
                                onSubmit={e => { e.preventDefault(); alert('Welcome to the Inner Circle! 🌸'); }}
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-pink-50/30 rounded-2xl sm:rounded-[3rem] border-2 border-transparent focus-within:border-pink-200 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-pink-500/5 transition-all duration-500 backdrop-blur-sm w-full">
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        className="flex-grow w-full bg-transparent border-none outline-none focus:ring-0 px-4 sm:px-8 py-3 sm:py-4 text-gray-700 font-bold text-base sm:text-lg placeholder:text-gray-300"
                                    />
                                    <button className="w-full sm:w-auto bg-gray-900 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-full font-black text-base sm:text-lg hover:bg-black transition-all shadow-xl active:scale-95 whitespace-nowrap">
                                        Subscribe Now
                                    </button>
                                </div>

                                <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 opacity-40">
                                    {['No Spam', 'Private Sales'].map(item => (
                                        <span key={item} className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div> {item}
                                        </span>
                                    ))}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
