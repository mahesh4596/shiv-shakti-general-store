import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

function ProductDetail({ addToCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
    );
    if (!product) return <div className="text-center py-40 text-red-500 font-bold text-2xl">Oops! Product vanished.</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-16">
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center text-gray-400 hover:text-pink-500 font-bold transition-colors mb-6 md:mb-0"
            >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:bg-pink-50 transition-all">
                    <ArrowLeft size={18} />
                </div>
                Back to Gallery
            </button>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Image Section */}
                <div className="lg:w-1/2 space-y-6">
                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-pink-50 shadow-2xl">
                        <img
                            src={product.images?.[activeImg] || product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-700"
                        />
                        <button className="absolute top-6 right-6 p-4 rounded-full bg-white/50 backdrop-blur-md text-pink-500 shadow-xl hover:scale-110 transition-transform">
                            <Heart size={24} fill="white" />
                        </button>
                    </div>
                    <div className="grid grid-cols-5 gap-4 mb-8 lg:mb-0">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${activeImg === i ? 'border-pink-500 scale-95 shadow-lg' : 'border-transparent hover:border-pink-200'}`}
                                    onClick={() => setActiveImg(i)}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </div>
                            ))
                        ) : (
                            <div className="aspect-square rounded-2xl overflow-hidden border-4 border-pink-500 scale-95 shadow-lg">
                                <img src={product.image} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 space-y-6 md:space-y-10 py-4">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <span className="w-fit bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                            <div className="flex items-center text-yellow-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                <span className="ml-2 text-gray-400 font-bold text-xs md:text-sm">(120 Reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">{product.name}</h1>
                        <div className="flex items-baseline space-x-4">
                            <span className="text-3xl md:text-5xl font-black text-pink-500 font-mono">₹{product.price}</span>
                            <span className="text-lg md:text-xl text-gray-400 line-through">₹{Math.round(product.price * 1.5)}</span>
                            <span className="text-green-500 font-bold px-2 md:px-3 py-1 bg-green-50 rounded-lg text-[10px] md:text-sm">Save 33%</span>
                        </div>
                    </div>

                    <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-xl font-medium">
                        {product.description}. Luxury care crafted for your masterpiece.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-0">
                        <div className="flex items-center space-x-3 p-4 bg-pink-50/50 rounded-2xl border border-pink-50">
                            <Truck className="text-pink-500 shrink-0" size={20} />
                            <span className="text-xs md:text-sm font-bold text-gray-600">Free Shipping Pan-India</span>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-pink-50/50 rounded-2xl border border-pink-50">
                            <ShieldCheck className="text-pink-500 shrink-0" size={20} />
                            <span className="text-xs md:text-sm font-bold text-gray-600">100% Authentic Product</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
                        <button
                            onClick={() => addToCart(product)}
                            className="flex-grow bg-pink-500 text-white py-5 rounded-[2rem] text-lg md:text-xl font-black shadow-2xl shadow-pink-200 flex items-center justify-center gap-3 hover:bg-pink-600 transition-all active:scale-95"
                        >
                            <ShoppingCart size={24} />
                            Add to Bag
                        </button>
                        <button className="px-10 py-5 rounded-[2rem] bg-gray-900 text-white font-black hover:bg-black transition-all active:scale-95">
                            Buy Now
                        </button>
                    </div>

                    <div className="border-t border-pink-100 pt-10 space-y-6">
                        <h3 className="font-black text-2xl text-gray-800">The Glow Standard</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-500 font-medium">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Dermatologically Tested</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Paraben & Sulfate Free</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> 100% Vegan Ingredients</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Certified Sustainable</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
