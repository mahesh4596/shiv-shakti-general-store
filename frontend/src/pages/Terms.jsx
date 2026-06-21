import React, { useEffect } from 'react';

function Terms() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-10 md:py-20 px-4 md:px-6">
            <div className="text-center mb-10 md:mb-16 space-y-4">
                <span className="bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">Agreement</span>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">Terms of Service</h1>
                <p className="text-gray-400 text-sm md:text-base font-medium italic">Last updated: December 30, 2025</p>
            </div>

            <div className="prose prose-pink prose-lg max-w-none text-gray-600 space-y-8 md:space-y-12">
                <section className="space-y-3 md:space-y-4 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px] md:text-sm shrink-0">01</div>
                        General Terms
                    </h2>
                    <p className="leading-relaxed text-sm md:text-base">
                        By using the <strong>SHIV SHAKTI GENERAL STORE</strong> website, you agree to comply with our policies. We reserve the right to update our services, pricing, and products at any time without prior notice.
                    </p>
                </section>

                <section className="space-y-3 md:space-y-4 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px] md:text-sm shrink-0">02</div>
                        Product Accuracy
                    </h2>
                    <p className="leading-relaxed text-sm md:text-base">
                        We strive for perfection in our product descriptions and photos. However, actual colors and textures may vary slightly due to screen settings and the artisanal nature of our cosmetic products.
                    </p>
                </section>

                <section className="space-y-3 md:space-y-4 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px] md:text-sm shrink-0">03</div>
                        Shipping & Returns
                    </h2>
                    <p className="leading-relaxed text-sm md:text-base">
                        Orders are typically processed within 24-48 hours. For hygiene reasons, cosmetic products cannot be returned once the seal is broken. If you receive a damaged product, please contact us within 24 hours of delivery.
                    </p>
                </section>

                <div className="p-6 md:p-10 bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] mt-12 md:mt-20 text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Acceptance</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed italic">
                        By continuing to use our store, you confirm that you have read and understood these Terms of Service in their entirety.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Terms;
