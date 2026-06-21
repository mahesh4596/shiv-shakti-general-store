import React, { useState, useEffect } from 'react';
import api from '../api';
import { Package, Calendar, MapPin } from 'lucide-react';

function OrderHistory({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get(`/orders/user/${user._id}`)
                .then(res => {
                    setOrders(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user) return <div className="text-center py-20">Please login to see your orders.</div>;
    if (loading) return <div className="text-center py-20 text-pink-500">Loading your orders...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-10 md:mb-12">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-pink-50 rounded-[2.5rem] border-2 border-dashed border-pink-200">
                    <Package size={48} className="text-pink-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium italic">Your order history is a blank canvas...</p>
                </div>
            ) : (
                <div className="space-y-6 md:space-y-10">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-pink-50 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="bg-pink-50/50 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-pink-100 gap-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full sm:w-auto">
                                    <div className="space-y-1">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Placed</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-700 flex items-center"><Calendar size={12} className="mr-1" /> {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Total</p>
                                        <p className="text-xs md:text-sm font-black text-pink-600">₹{order.totalAmount}</p>
                                    </div>
                                    <div className="space-y-1 hidden md:block">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Identity</p>
                                        <p className="text-xs font-bold text-gray-500 truncate">#{order._id.substring(0, 8)}</p>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto text-left sm:text-right">
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-tight ${order.paymentStatus?.includes('Paid') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {order.paymentStatus?.includes('Paid') ? 'Payment Confirmed' : 'COD Payment Pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-start bg-pink-50/20 p-4 rounded-2xl border border-pink-50/50">
                                    <MapPin size={16} className="text-pink-400 mr-3 mt-1 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Shipping To</p>
                                        <p className="text-xs md:text-sm font-medium text-gray-600 leading-relaxed truncate md:whitespace-normal">{order.address}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.items.map((item, idx) => {
                                        // Robust image calculation
                                        const displayImage = item.images?.[0] || item.image || 'https://via.placeholder.com/400';
                                        // If it's a broken local upload path from before Cloudinary
                                        const safeImage = (displayImage.includes('uploads/') && !displayImage.startsWith('http'))
                                            ? 'https://via.placeholder.com/400'
                                            : displayImage;

                                        return (
                                            <div key={idx} className="flex items-center gap-4 group">
                                                <div className="w-14 h-14 md:w-20 md:h-20 bg-pink-50 rounded-xl overflow-hidden shadow-sm shrink-0">
                                                    <img src={safeImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="font-black text-gray-800 text-sm md:text-lg tracking-tight truncate">{item.name}</h4>
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="font-black text-gray-900 text-sm md:text-lg font-mono">₹{item.price * item.quantity}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistory;
