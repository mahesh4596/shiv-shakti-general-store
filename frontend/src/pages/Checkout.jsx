import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { MapPin, ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';

function Checkout({ cart, user, clearCart }) {
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [paymentMethod, setPaymentMethod] = useState('COD'); // COD or ONLINE
    const [loading, setLoading] = useState(false);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to checkout');
        if (!address) return alert('Please enter your shipping address');
        if (!phone) return alert('Please enter your phone number');

        setLoading(true);

        try {
            if (paymentMethod === 'COD') {
                const orderPayload = {
                    user: user._id,
                    items: cart,
                    totalAmount: total,
                    address: address,
                    phone: phone,
                    paymentStatus: 'Pending (COD)',
                    status: 'Confirmed'
                };

                await api.post('/orders', orderPayload);
                clearCart();
                alert('🎉 Order Placed Successfully! We will collect payment on delivery.');
                navigate('/orders');
            } else {
                const keyRes = await api.get('/payment/key');
                // --- DEMO MODE BYPASS ---
                const isDemoMode = !keyRes?.data?.key || keyRes.data.key.includes('your_key_here');
                if (isDemoMode) {
                    // alert('💎 DEMO MODE: Simulating Online Payment...');
                    setTimeout(async () => {
                        const orderPayload = {
                            user: user._id,
                            items: cart,
                            totalAmount: total,
                            address: address,
                            phone: phone,
                            paymentStatus: 'Paid (Demo Online)',
                            status: 'Confirmed'
                        };
                        await api.post('/orders', orderPayload);
                        clearCart();
                        // alert('🌟 Demo Payment Successful! Your masterpieces are on the way.');
                        navigate('/orders');
                    }, 1500);
                    return;
                }

                // ONLINE PAYMENT LOGIC (Real Razorpay)
                const orderRes = await api.post('/payment/create-order', { amount: total });
                const orderData = orderRes.data;

                const options = {
                    key: keyRes.data.key,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "SHIV SHAKTI STORE",
                    description: "Premium Boutique Purchase",
                    order_id: orderData.id,
                    handler: async (response) => {
                        try {
                            // Verify payment on backend
                            await api.post('/payment/verify', response);

                            // If verified, create order
                            const orderPayload = {
                                user: user._id,
                                items: cart,
                                totalAmount: total,
                                address: address,
                                phone: phone,
                                paymentStatus: 'Paid (Online)',
                                status: 'Confirmed'
                            };

                            await api.post('/orders', orderPayload);
                            clearCart();
                            // alert('🌟 Payment Successful! Your masterpieces are on the way.');
                            navigate('/orders');
                        } catch (err) {
                            alert('Payment verification failed!');
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: phone
                    },
                    theme: {
                        color: "#ff0080"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) return (
        <div className="text-center py-40 bg-pink-50/30 rounded-[3rem] border border-pink-50 max-w-2xl mx-auto px-10">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShoppingBag className="text-pink-300" size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Your Bag is Empty</h1>
            <p className="text-gray-400 font-medium mb-10">Add some masterpieces to your collection before checking out.</p>
            <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-10 py-4 rounded-full font-black shadow-xl hover:bg-black transition-all">
                Shop Now
            </button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto py-6 md:py-12 px-4 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 md:mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Checkout</h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-500" /> Secure Boutique Checkout
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 text-left">
                {/* Left Side: Form */}
                <div className="lg:col-span-7 space-y-6 md:space-y-8">
                    <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] border border-pink-50 shadow-sm space-y-6 md:space-y-8">
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3">
                            <MapPin className="text-pink-500" /> Shipping Destination
                        </h2>

                        <form onSubmit={handlePlaceOrder} className="space-y-4 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Recipient Name</label>
                                <input
                                    type="text"
                                    value={user?.name || ''}
                                    disabled
                                    className="w-full p-4 rounded-xl md:rounded-2xl border border-pink-50 bg-pink-50/20 text-gray-500 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 12345 67890"
                                    className="w-full p-4 rounded-xl md:rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-gray-300 text-gray-700 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Full Shipping Address</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="House No, Street Name, City, Pincode..."
                                    className="w-full p-4 rounded-xl md:rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-gray-300 text-gray-700 font-medium"
                                ></textarea>
                            </div>

                            {/* Payment Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Payment Method</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`cursor-pointer p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 transition-all ${paymentMethod === 'COD' ? 'border-pink-500 bg-pink-50' : 'border-pink-50 bg-white'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-pink-500' : 'border-gray-200'}`}>
                                                {paymentMethod === 'COD' && <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-none text-sm md:text-base">COD</p>
                                                <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase mt-1">Cash on Delivery</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod('ONLINE')}
                                        className={`cursor-pointer p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 transition-all ${paymentMethod === 'ONLINE' ? 'border-pink-500 bg-pink-50' : 'border-pink-50 bg-white'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-pink-500' : 'border-gray-200'}`}>
                                                {paymentMethod === 'ONLINE' && <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-none text-sm md:text-base">Online</p>
                                                <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase mt-1">UPI / Cards</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-pink-500 text-white py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl shadow-2xl shadow-pink-500/20 hover:bg-pink-600 transition-all active:scale-[0.98] disabled:bg-gray-200"
                            >
                                {loading ? 'Processing...' : paymentMethod === 'COD' ? 'Confirm Order' : 'Pay Online Now'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-5 order-first lg:order-last mb-8 lg:mb-0">
                    <div className="bg-pink-50/50 p-6 md:p-10 rounded-3xl md:rounded-[3rem] border border-pink-100 sticky top-10 space-y-6 md:space-y-8">
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3">
                            <Heart className="text-pink-500" /> Order Summary
                        </h2>

                        <div className="space-y-3 md:space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-pink-100/50">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                        <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/400'} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-black text-gray-800 text-xs md:text-sm leading-tight truncate">{item.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-gray-900 text-sm md:text-base">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 md:pt-8 border-t border-pink-200 space-y-3 md:space-y-4">
                            <div className="flex justify-between font-bold text-gray-400 uppercase text-[8px] md:text-[10px] tracking-widest">
                                <span>Subtotal</span>
                                <span className="font-mono">₹{total}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-400 uppercase text-[8px] md:text-[10px] tracking-widest">
                                <span>Delivery Cost</span>
                                <span className="text-green-500">FREE</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 md:pt-4 border-t border-pink-100">
                                <span className="text-lg md:text-xl font-black text-gray-900 tracking-tighter">Grand Total</span>
                                <span className="text-2xl md:text-3xl font-black text-pink-500 tracking-tighter leading-none font-mono">₹{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
