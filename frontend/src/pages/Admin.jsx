import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Plus, Trash2, Package, ShoppingBag, Users, TrendingUp, Upload, ShieldCheck, MapPin } from 'lucide-react';

function Admin({ user }) {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', description: '', category: '' });
    const [imageFiles, setImageFiles] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.isAdmin) {
            fetchProducts();
            fetchOrders();
        }
    }, [user]);

    const fetchProducts = () => {
        api.get('/products').then(res => setProducts(res.data));
    };

    const fetchOrders = () => {
        api.get('/orders').then(res => setOrders(res.data));
    };

    const categories = ['Lipstick', 'Jewellery', 'Facewash', 'Soap', 'Skincare', 'Blush', 'Eyeliner', 'Eyeshadow'];

    const handleAddProduct = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('description', newProduct.description);
        formData.append('category', newProduct.category);

        // Append all selected files
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => {
                formData.append('imageFiles', file);
            });
        }

        // Append URL if provided
        if (newProduct.image) {
            formData.append('image', newProduct.image);
        }

        api.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            alert('Product Created with Gallery! ✨');
            setNewProduct({ name: '', price: '', image: '', description: '', category: '' });
            setImageFiles([]);
            fetchProducts();
        }).catch(err => {
            alert(err.response?.data?.message || 'Error: ' + err.message);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Remove this product permanently?')) {
            api.delete(`/products/${id}`).then(() => {
                alert('Product Removed.');
                fetchProducts();
            });
        }
    };

    if (!user?.isAdmin) return (
        <div className="text-center py-40 bg-red-50 rounded-[3rem] border border-red-100 max-w-2xl mx-auto px-10">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShieldCheck className="text-red-500" size={40} />
            </div>
            <h1 className="text-4xl font-black text-red-900 mb-4 tracking-tighter uppercase">Vault Locked</h1>
            <p className="text-red-600 font-medium text-lg leading-relaxed">
                This area is reserved for the elite management team.
            </p>
            <div className="mt-8 p-6 bg-white/50 rounded-2xl border border-red-100 text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Current Authentication</p>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase">Email:</span>
                    <span className="text-sm font-black text-gray-800">{user ? user.email : "Guest/Null"}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mt-3">
                    <span className="text-xs font-bold text-gray-400 uppercase">Admin Status:</span>
                    <span className="text-xs font-black text-red-500 uppercase">Access Denied</span>
                </div>
                <p className="text-[10px] text-red-400 font-bold mt-6 text-center leading-relaxed">
                    Verify this email exactly matches ADMIN_EMAIL in your backend .env file. <br />
                    If you just changed it, you MUST logout and login again.
                </p>
            </div>
            <Link to="/login" className="mt-8 inline-block bg-red-500 text-white px-10 py-4 rounded-full font-black shadow-xl hover:bg-red-600 transition-all active:scale-95">
                Switch Account
            </Link>
        </div>
    );

    const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return (
        <div className="space-y-8 md:space-y-12 pb-20 px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-0">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Boutique Console</h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px] md:text-xs">Curating the finest cosmetics</p>
                </div>
                <div className="flex w-full lg:w-auto bg-pink-50 p-1.5 rounded-2xl border border-pink-100">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 lg:px-8 py-3 rounded-xl font-black transition-all text-sm md:text-base ${activeTab === 'products' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400 hover:text-pink-300'}`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 lg:px-8 py-3 rounded-xl font-black transition-all text-sm md:text-base ${activeTab === 'orders' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400 hover:text-pink-300'}`}
                    >
                        Sales Feed
                    </button>
                </div>
            </div>

            {/* Stats Board */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 text-left mb-10 md:mb-0">
                {[
                    { icon: ShoppingBag, label: "Total Revenue", val: `₹${totalRevenue}`, color: "bg-pink-500" },
                    { icon: Package, label: "Active Designs", val: products.length, color: "bg-gray-800" },
                    { icon: TrendingUp, label: "Total Sales", val: orders.length, color: "bg-green-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-pink-50 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-all">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                            <stat.icon size={24} className="md:w-7 md:h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {activeTab === 'products' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 text-left">
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 text-white sticky top-24 shadow-2xl">
                            <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-10 flex items-center gap-3">
                                <Plus className="text-pink-400" /> New Design
                            </h2>
                            <form onSubmit={handleAddProduct} className="space-y-4 md:space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-4">Product Name</label>
                                    <input required placeholder="E.g. Velvet Rose" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-white/5 px-6 py-4 rounded-xl md:rounded-2xl border border-white/10 focus:border-pink-500 outline-none transition-all placeholder:text-gray-700 text-sm md:text-base" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 ml-4">Price (₹)</label>
                                        <input required type="number" placeholder="999" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full bg-white/5 px-6 py-4 rounded-xl md:rounded-2xl border border-white/10 focus:border-pink-500 outline-none transition-all placeholder:text-gray-700 text-sm md:text-base" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 ml-4">Category</label>
                                        <select
                                            required
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                            className="w-full bg-white/5 px-6 py-4 rounded-xl md:rounded-2xl border border-white/10 focus:border-pink-500 outline-none transition-all text-gray-400 appearance-none cursor-pointer text-sm md:text-base"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat} className="bg-gray-900 text-white">{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-4">Description</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Describe the masterpiece..."
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className="w-full bg-white/5 px-6 py-4 rounded-xl md:rounded-2xl border border-white/10 focus:border-pink-500 outline-none transition-all placeholder:text-gray-700 text-sm md:text-base resize-none"
                                    ></textarea>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 ml-4">Gallery Upload (Top 5)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={e => setImageFiles(Array.from(e.target.files))}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="w-full bg-white/5 px-6 py-6 md:py-8 rounded-xl md:rounded-2xl border border-white/10 border-dashed hover:border-pink-500 hover:bg-pink-500/5 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all group"
                                            >
                                                <Upload className={`w-6 h-6 md:w-8 md:h-8 ${imageFiles.length > 0 ? "text-green-400" : "text-gray-600 group-hover:text-pink-400"}`} />
                                                <span className={`text-[10px] md:text-xs font-bold leading-none ${imageFiles.length > 0 ? "text-green-400" : "text-gray-500"}`}>
                                                    {imageFiles.length > 0 ? `${imageFiles.length} Photos Selected` : "Select Masterpieces"}
                                                </span>
                                            </label>
                                        </div>

                                        {/* Multi-Preview */}
                                        {imageFiles.length > 0 && (
                                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                                {imageFiles.map((file, idx) => (
                                                    <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0">
                                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex items-center gap-4">
                                        <div className="h-[1px] bg-white/10 flex-grow"></div>
                                        <span className="text-[8px] md:text-[10px] font-black text-gray-700 uppercase">OR PASTE URLS</span>
                                        <div className="h-[1px] bg-white/10 flex-grow"></div>
                                    </div>

                                    <input
                                        disabled={imageFiles.length > 0}
                                        placeholder="URL 1, URL 2..."
                                        value={newProduct.image}
                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                        className="w-full bg-white/5 px-6 py-4 rounded-xl md:rounded-2xl border border-white/10 focus:border-pink-500 outline-none transition-all placeholder:text-gray-700 disabled:opacity-30 text-xs md:text-sm"
                                    />
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-pink-500 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-pink-500/20 hover:bg-pink-600 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? "Adding Artpiece..." : "Add to Boutique"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        <h2 className="text-xl md:text-2xl font-black text-gray-800 ml-4">Current Masterpieces</h2>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                            {products.map(p => (
                                <div key={p._id} className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-pink-50 flex items-center group relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-50 rounded-xl md:rounded-2xl overflow-hidden shadow-sm shrink-0">
                                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="ml-4 md:ml-6 pr-10 min-w-0">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase text-pink-400 tracking-widest">{p.category}</p>
                                        <h3 className="text-sm md:text-lg font-black text-gray-800 tracking-tight truncate">{p.name}</h3>
                                        <p className="text-base md:text-xl font-bold text-gray-900 mt-1 font-mono">₹{p.price}</p>
                                    </div>
                                    <button onClick={() => handleDeleteProduct(p._id)} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2.5 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                                        <Trash2 size={20} className="md:w-6 md:h-6" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 md:space-y-8 max-w-5xl text-left">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-[2rem] md:rounded-[3rem] border border-pink-50 overflow-hidden shadow-sm hover:shadow-lg transition-all">
                            <div className="bg-pink-50/50 p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-pink-100 gap-6">
                                <div className="space-y-1 w-full sm:w-auto">
                                    <p className="text-[10px] font-black uppercase text-pink-400 tracking-widest">Order Receipt</p>
                                    <p className="text-xs md:text-sm font-bold text-gray-800 truncate">#{order._id}</p>
                                    <p className="text-[10px] md:text-xs text-gray-400 font-medium">{new Date(order.date).toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between sm:justify-end gap-6 md:gap-12 w-full sm:w-auto items-end sm:items-center">
                                    <div>
                                        <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest sm:text-right">Payment</p>
                                        <p className={`text-[10px] md:text-xs font-black uppercase sm:text-right ${order.paymentStatus?.includes('Paid') ? 'text-green-500' : 'text-orange-500'}`}>
                                            {order.paymentStatus || 'Pending'}
                                        </p>
                                        {(!order.paymentStatus || !order.paymentStatus.includes('Paid')) && (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await api.patch(`/orders/${order._id}/payment-status`, { paymentStatus: 'Paid (Received)' });
                                                        alert('Order marked as Paid!');
                                                        fetchOrders();
                                                    } catch (err) {
                                                        alert('Failed to update status');
                                                    }
                                                }}
                                                className="mt-1 md:mt-2 text-[8px] md:text-[10px] bg-green-500 text-white px-3 py-1 rounded-full font-black hover:bg-green-600 transition-all uppercase tracking-tighter"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Total</p>
                                        <p className="text-xl md:text-2xl font-black text-pink-500 leading-none font-mono">₹{order.totalAmount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                <div className="space-y-6">
                                    <div className="space-y-1.5 md:space-y-2">
                                        <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Users size={12} /> Customer</p>
                                        <p className="text-lg md:text-xl font-black text-gray-800 tracking-tight">{order.user?.name}</p>
                                        <p className="text-xs md:text-sm font-medium text-gray-500 italic shrink-1 truncate">{order.user?.email}</p>
                                        <p className="text-xs md:text-sm font-bold text-pink-500 tracking-widest">{order.phone}</p>
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><MapPin size={12} /> Address</p>
                                        <p className="text-xs md:text-sm font-medium text-gray-600 leading-relaxed bg-pink-50/30 p-3 rounded-xl border border-pink-50/50">{order.address}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-2xl md:rounded-[2rem] p-4 md:p-6 space-y-4 border border-gray-100">
                                    <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Order Content</p>
                                    <div className="space-y-2 md:space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 md:gap-4 bg-white p-2.5 md:p-3 rounded-xl shadow-sm border border-pink-50/50 group">
                                                <img src={item.image} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm group-hover:scale-110 transition-transform" />
                                                <div className="flex-grow min-w-0">
                                                    <p className="text-[10px] md:text-xs font-black text-gray-800 truncate">{item.name}</p>
                                                    <p className="text-[8px] md:text-[10px] font-bold text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-xs md:text-sm font-black text-gray-900 font-mono">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Admin;
