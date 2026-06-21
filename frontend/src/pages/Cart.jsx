import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

function Cart({ cart, removeFromCart }) {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="text-center py-40 bg-pink-50 rounded-[3rem] border-2 border-dashed border-pink-200">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <ShoppingBag size={48} className="text-pink-500" />
                </div>
                <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Your Bag is Empty</h2>
                <p className="text-gray-500 mb-12 text-xl font-medium">Don't let your style wait. Fill it with beauty.</p>
                <Link to="/" className="btn-primary text-xl px-12 py-5 inline-flex items-center gap-2">
                    Start Shopping <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-pink-100 pb-6 md:pb-8 gap-4 mb-6 md:mb-0">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase">Your Bag</h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px] md:text-sm">{cart.length} Elegant Items Selected</p>
                </div>
                <Link to="/" className="text-pink-500 font-black hover:underline text-sm md:text-base">Keep Exploring</Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
                <div className="lg:w-2/3 space-y-4 md:space-y-8 mb-10 md:mb-0">
                    {cart.map(item => (
                        <div key={item._id} className="group relative flex items-center bg-white p-4 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-pink-50 hover:shadow-[0_30px_60px_-20px_rgba(255,133,162,0.15)] transition-all">
                            <div className="relative w-20 h-28 md:w-32 md:h-40 bg-pink-50 rounded-xl md:rounded-2xl overflow-hidden shadow-md shrink-0">
                                <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/400'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="ml-4 md:ml-8 flex-grow space-y-1 md:space-y-2">
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-pink-400">{item.category}</p>
                                <h3 className="text-lg md:text-2xl font-black text-gray-800 tracking-tight line-clamp-1">{item.name}</h3>
                                <div className="flex items-center text-gray-400 gap-2 md:gap-4 font-bold text-[10px] md:text-sm">
                                    <span>QTY: {item.quantity}</span>
                                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                                    <span>STANDARD</span>
                                </div>
                                <div className="pt-1 md:pt-2">
                                    <p className="text-xl md:text-2xl font-black text-gray-900 font-mono">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="absolute top-2 right-2 md:top-8 md:right-8 text-gray-300 hover:text-red-500 transition-colors p-2 md:p-3 hover:bg-red-50 rounded-full"
                            >
                                <Trash2 size={20} className="md:w-6 md:h-6" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-white sticky top-24 shadow-2xl">
                        <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-10 tracking-tight">Order Summary</h2>
                        <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                            <div className="flex justify-between text-gray-400 font-bold text-sm md:text-base">
                                <span>Bag Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 font-bold text-sm md:text-base">
                                <span>Shipping</span>
                                <span className="text-pink-400">FREE</span>
                            </div>
                            <div className="flex justify-between text-gray-400 font-bold text-sm md:text-base">
                                <span>GST (Included)</span>
                                <span>18%</span>
                            </div>
                            <div className="pt-4 md:pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className="text-lg md:text-xl font-bold">Total Amount</span>
                                <span className="text-3xl md:text-4xl font-black text-pink-400 font-mono">₹{total}</span>
                            </div>
                        </div>
                        <Link
                            to="/checkout"
                            className="w-full bg-pink-500 py-5 md:py-6 rounded-2xl text-lg md:text-xl font-black flex items-center justify-center gap-3 hover:bg-pink-600 transition-all active:scale-[0.98]"
                        >
                            Checkout Now <ArrowRight size={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
