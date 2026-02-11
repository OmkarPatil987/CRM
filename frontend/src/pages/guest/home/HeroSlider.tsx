import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HERO_SLIDES = [
    "/images/home/b5.webp",
    "/images/home/b4.webp",
];

export const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full bg-white">

            {/* --- MOBILE VIEW: Text Only --- */}
            {/* hidden lg:block hides this on large screens */}
            <div className="block lg:hidden px-6 py-12 bg-gradient-to-b from-emerald-50 to-white">
                <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100 rounded-full">
                    Government Compliant
                </div>

                <h1 className="text-3xl font-extrabold text-stone-900 leading-tight mb-4">
                    apnaQR – QR Code Platform for <span className="text-emerald-600">Agri Products</span>
                </h1>

                <p className="text-lg font-semibold text-stone-700 mb-1">
                    Static & Dynamic QR codes for Biostimulants.
                </p>
                <p className="text-sm text-stone-500 italic mb-6">
                    (As per FCO 1985 & Ministry of Agriculture Guidelines)
                </p>

                <div className="space-y-4 mb-8">
                    {[
                        "Government compliance",
                        "Product authenticity",
                        "Clear & verified information for farmers"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-stone-700">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span className="text-base font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate('/auth/login')}
 className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200">
                    Get Started Now
                </button>
            </div>

            {/* --- DESKTOP VIEW: Images Only --- */}
            {/* hidden lg:block shows this ONLY on large screens */}
            <div className="hidden lg:relative lg:block w-full h-[60vh] lg:h-[80vh] max-h-[750px] overflow-hidden bg-gray-100">
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <img
                            src={slide}
                            alt={`Agri Banner ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                {/* Desktop Navigation Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
                    {HERO_SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-3 rounded-full transition-all ${index === current ? "bg-white w-10" : "bg-white/40 w-3 hover:bg-white/60"
                                }`}
                        />
                    ))}
                </div>
            </div>

        </section>
    );
};