import React, { useEffect } from 'react';

function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-10 md:py-20 px-4 md:px-6">
            <div className="text-center mb-10 md:mb-16 space-y-4">
                <span className="bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">Legal</span>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">Privacy Policy</h1>
                <p className="text-gray-400 text-sm md:text-base font-medium italic">Last updated: December 30, 2025</p>
            </div>

            <div className="prose prose-pink prose-lg max-w-none text-gray-600 space-y-8 md:space-y-12">
                <section className="space-y-3 md:space-y-4 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center text-[10px] md:text-sm shrink-0">01</div>
                        Data Collection
                    </h2>
                    <p className="leading-relaxed text-sm md:text-base">
                        At <strong>SHIV SHAKTI GENERAL STORE</strong>, we value your trust. We collect personal information such as your name, email address, and shipping address solely to process your orders and provide a personalized boutique experience. We never sell your data to third parties.
                    </p>
                </section>

                <section className="space-y-3 md:space-y-4 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center text-[10px] md:text-sm shrink-0">02</div>
                        Secure Payments
                    </h2>
                    <p className="leading-relaxed text-sm md:text-base">
                        Your payment security is our priority. All transactions are processed through <strong>Razorpay</strong>, a world-class encrypted payment gateway. We do not store your credit card or banking details on our servers.
                    </p>
                </section>

                <section className="space-y-3 md:space-y-4 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center text-[10px] md:text-sm shrink-0">03</div>
                        Cookies & Analytics
                    </h2>
                    <p className="leading-relaxed text-sm md:text-base">
                        We use minimal cookies to keep your shopping bag updated and to remember your preferences. This helps us provide you with a seamless and faster shopping experience on our platform.
                    </p>
                </section>

                <div className="p-6 md:p-10 bg-pink-50 rounded-[2rem] md:rounded-[2.5rem] border border-pink-100 mt-12 md:mt-20">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Contact Us</h3>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed italic">
                        If you have any questions regarding our privacy practices, please reach out to us at <strong>hello@shivshakti.com</strong>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
