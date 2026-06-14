"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Tiny base64 placeholder generator for smooth blur-up loading
const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='rgb(${r},${g},${b})'/%3E%3C/svg%3E`;

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("architecture");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1 = form, 2 = success
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2 Guests",
    suite: "A-Frame Master Suite",
  });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isGateActive, setIsGateActive] = useState(false);
  const [shouldRenderGate, setShouldRenderGate] = useState(false);
  const [isGateDismissed, setIsGateDismissed] = useState(false);
  const [isMiniCardVisible, setIsMiniCardVisible] = useState(false);
  const [isMiniCardActive, setIsMiniCardActive] = useState(false);

  // Monitor scroll for sticky header blurring and content gating (paywall)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isGateDismissed) return;

      // Show marketing block overlay once they scroll down past 1200px
      if (window.scrollY > 1200) {
        setIsGateActive(true);
      } else {
        setIsGateActive(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isGateDismissed]);

  // Handle gate mount/unmount animation timing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isGateActive) {
      setShouldRenderGate(true);
    } else if (shouldRenderGate) {
      timeoutId = setTimeout(() => {
        setShouldRenderGate(false);
      }, 800); // matches transition duration of 0.8s
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isGateActive, shouldRenderGate]);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep(2);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    // Reset steps after slide-out completes
    setTimeout(() => {
      setBookingStep(1);
    }, 400);
  };

  const closeGate = () => {
    setIsGateActive(false);
    setIsGateDismissed(true);
    // Smoothly transition into bottom floating card
    setIsMiniCardVisible(true);
    setTimeout(() => {
      setIsMiniCardActive(true);
    }, 100);
  };

  const tabs = {
    architecture: {
      title: "Sustainable A-Frame Design",
      subtitle: "Dark Steel & Warm Teak",
      description: "A striking geometric frame of matte obsidian steel contrasted with warm golden teak. Sloped roof lines create dramatic, cathedral-like spaces engineered for the tropics.",
      bullets: [
        "9-meter cathedral ceilings",
        "Sustainably sourced local hardwoods",
        "Passive cooling ventilation"
      ]
    },
    garden: {
      title: "Lush Tropical Sanctuary",
      subtitle: "Unspoiled Exotic Flora",
      description: "Nestled in a private jungle clearing surrounded by wild palms, bamboo, and exotic monstera, maintaining complete privacy and panoramic green views.",
      bullets: [
        "1,200 sqm private gardens",
        "Natural stone pathways",
        "Native bird & butterfly habitat"
      ]
    },
    deck: {
      title: "Sun-Drenched Deck & Pool",
      subtitle: "Infinity Forest Views",
      description: "An expansive outdoor living space built from weathered ironwood, featuring a saltwater infinity plunge pool that disappears into the jungle canopy.",
      bullets: [
        "Saltwater infinity plunge pool",
        "Recessed fireplace lounge",
        "Sun-drenched ironwood deck"
      ]
    }
  };

  return (
    <div className="relative min-h-screen font-sans antialiased text-[#1d1d1f] bg-[#fbfbfd] selection:bg-[#2d5a3e]/20">

      {/* Sticky Header Nav - Transparent at rest, glassmorphism on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${isScrolled
          ? "py-4 glass-header shadow-sm"
          : "py-6 bg-transparent border-b border-transparent"
          }`}
      >
        <div className="max-w-8xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo / Title */}
          <a
            href="#"
            className="flex items-center gap-2 group focus:outline-none"
          >
            {/* Elegant luxury icon */}
            <svg className={`w-6 h-6 transition-colors duration-300 ${isScrolled ? "text-[#2d5a3e]" : "text-[#b8d2c2]"
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`font-sans text-xl font-light tracking-widest transition-colors duration-300 ${isScrolled ? "text-[#1d1d1f]" : "text-white"
              }`}>
              VILLA NELITH
            </span>
          </a>

          {/* Navigation & Action Area (Right Side) */}
          <div className="flex items-center gap-8 md:gap-10">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-10">
              <a
                href=""
                className={`text-xs font-light uppercase tracking-[0.25em] transition-colors duration-300 ${isScrolled
                  ? "text-[#515154] hover:text-[#1d1d1f]"
                  : "text-zinc-200 hover:text-white lg:text-[#515154] lg:hover:text-[#1d1d1f]"
                  }`}
              >
                The Villa
              </a>
              <a
                href=""
                className={`text-xs font-light uppercase tracking-[0.25em] transition-colors duration-300 ${isScrolled
                  ? "text-[#515154] hover:text-[#1d1d1f]"
                  : "text-zinc-200 hover:text-white lg:text-[#515154] lg:hover:text-[#1d1d1f]"
                  }`}
              >
                Design & Space
              </a>
              <a
                href=""
                className={`text-xs font-light uppercase tracking-[0.25em] transition-colors duration-300 ${isScrolled
                  ? "text-[#515154] hover:text-[#1d1d1f]"
                  : "text-zinc-200 hover:text-white lg:text-[#515154] lg:hover:text-[#1d1d1f]"
                  }`}
              >
                Details
              </a>
            </nav>

            {/* Reserve CTA Button (Apple Pill Shape) */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className={`px-7 py-2.5 rounded-full text-xs font-light uppercase tracking-widest active:scale-95 transition-all duration-300 ease-in-out cursor-pointer ${isScrolled
                ? "text-white bg-[#1d1d1f] hover:bg-[#2d5a3e]"
                : "text-[#1d1d1f] bg-white hover:bg-zinc-100 lg:text-white lg:bg-[#1d1d1f] lg:hover:bg-[#2d5a3e]"
                }`}
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>

        {/* Hero Section - Split Screen layout */}
        <section className="relative min-h-screen lg:h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white">

          {/* Left Side: Hero Image */}
          <div className="relative h-[50vh] lg:h-full w-full overflow-hidden bg-stone-900">
            <Image
              src="/hero2.png"
              alt="Villa Nelith Luxury A-Frame Resort Background"
              fill
              placeholder="blur"
              blurDataURL={rgbDataURL(20, 35, 25)}
              className="object-cover object-center scale-[1.02] filter brightness-[0.85] contrast-[1.02]"
              priority
            />
            {/* Elegant vignette overlay */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>

          {/* Right Side: Content with White Theme */}
          <div className="relative flex flex-col justify-center px-6 py-20 md:px-12 lg:px-20 xl:px-24 bg-white text-[#1d1d1f] h-full z-10">
            {/* Top spacer to push content down slightly on mobile/tablet */}
            <div className="h-12 lg:hidden"></div>

            {/* Ambient Forest Glow inside the white section, very subtle */}
            <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#2d5a3e]/10 to-[#b8d2c2]/5 blur-[90px] pointer-events-none animate-pulse-slow" />

            <div className="max-w-xl space-y-6 md:space-y-8 relative z-10">
              {/* Category / Sub-tag */}
              <p className="text-xs md:text-sm font-light uppercase tracking-[0.3em] text-[#2d5a3e] animate-fade-in">
                AN ARCHITECTURAL RETREAT
              </p>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] text-[#1d1d1f] animate-fade-in-up">
                Villa Nelith
              </h1>

              {/* Tagline */}
              <p className="text-sm md:text-base font-light text-[#515154] leading-relaxed tracking-wide animate-fade-in-up [animation-delay:200ms]">
                Nestled in the heart of Sri Lanka’s verdant wilderness, Villa Nelith is a sanctuary of raw, modern luxury. Our striking A-frame structure—a symphony of matte black steel and warm teak wood—rises dramatically from the landscape, offering a retreat where design meets untouched nature.
              </p>

              {/* CTA button (White theme variant: Dark background, light text) */}
              <div className="pt-4 animate-fade-in-up [animation-delay:400ms]">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-10 py-4 text-xs font-light uppercase tracking-widest text-white bg-[#1d1d1f] rounded-full hover:bg-[#2d5a3e] hover:scale-105 active:scale-98 transition-all duration-400 ease-out cursor-pointer shadow-lg hover:shadow-xl"
                >
                  Experience Villa Nelith
                </button>
              </div>
            </div>
          </div>

        </section>

        {/* Section: Architectural Masterpiece - Split Screen Layout */}
        <section id="villa" className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white border-b border-stone-200">

          {/* Left Side: Content with Box Theme / White Theme */}
          <div className="relative flex flex-col justify-between p-8 md:p-16 lg:p-20 xl:p-24 bg-[#fbfbfd] text-[#1d1d1f] h-full z-10 space-y-12">

            {/* Ambient forest glow behind text */}
            <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#2d5a3e]/5 blur-[80px] pointer-events-none" />

            <div className="space-y-12 relative z-10 my-auto">
              {/* Editorial Heading */}
              <div className="space-y-4 reveal-on-scroll">
                <p className="text-xs font-light uppercase tracking-[0.2em] text-[#2d5a3e]">The Aesthetic Philosophy</p>
                <h2 className="font-sans text-3xl md:text-5xl font-light text-[#1d1d1f] tracking-tight leading-tight">
                  Designed to immerse you <br />
                  <span className="font-normal text-[#2d5a3e]">in the poetry of forest light.</span>
                </h2>
                <div className="w-16 h-[1px] bg-[#2d5a3e] mt-6" />
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex flex-col gap-3 reveal-on-scroll reveal-delay-100">
                <button
                  onClick={() => setActiveTab("architecture")}
                  className={`flex items-center gap-6 text-left py-4 px-6 transition-all duration-300 cursor-pointer ${activeTab === "architecture"
                    ? "bg-[#e5ede7]/40 border-l-2 border-[#2d5a3e]"
                    : "border-l-2 border-transparent opacity-50 hover:opacity-85 text-[#515154]"
                    }`}
                >
                  <span className="font-sans text-2xl font-light text-[#2d5a3e]">01</span>
                  <div>
                    <h3 className="text-xs font-normal tracking-wider uppercase text-[#1d1d1f]">The A-Frame Architecture</h3>
                    <p className="text-[11px] font-light text-[#86868b] mt-0.5">Teak & steel composition</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("garden")}
                  className={`flex items-center gap-6 text-left py-4 px-6 transition-all duration-300 cursor-pointer ${activeTab === "garden"
                    ? "bg-[#e5ede7]/40 border-l-2 border-[#2d5a3e]"
                    : "border-l-2 border-transparent opacity-50 hover:opacity-85 text-[#515154]"
                    }`}
                >
                  <span className="font-sans text-2xl font-light text-[#2d5a3e]">02</span>
                  <div>
                    <h3 className="text-xs font-normal tracking-wider uppercase text-[#1d1d1f]">The Tropical Garden</h3>
                    <p className="text-[11px] font-light text-[#86868b] mt-0.5">Lush exotic landscaping</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("deck")}
                  className={`flex items-center gap-6 text-left py-4 px-6 transition-all duration-300 cursor-pointer ${activeTab === "deck"
                    ? "bg-[#e5ede7]/40 border-l-2 border-[#2d5a3e]"
                    : "border-l-2 border-transparent opacity-50 hover:opacity-85 text-[#515154]"
                    }`}
                >
                  <span className="font-sans text-2xl font-light text-[#2d5a3e]">03</span>
                  <div>
                    <h3 className="text-xs font-normal tracking-wider uppercase text-[#1d1d1f]">The Golden Hour Deck</h3>
                    <p className="text-[11px] font-light text-[#86868b] mt-0.5">Infinity-edge sanctuary</p>
                  </div>
                </button>
              </div>

              {/* Tab description text */}
              <div key={activeTab} className="space-y-4 animate-fade-in border-t border-stone-200/60 pt-6 reveal-on-scroll reveal-delay-200">
                <h4 className="font-sans text-2xl font-light text-[#1d1d1f] tracking-wide">
                  {tabs[activeTab as keyof typeof tabs].title}
                </h4>
                <p className="text-xs font-light uppercase tracking-widest text-[#2d5a3e]">
                  {tabs[activeTab as keyof typeof tabs].subtitle}
                </p>
                <p className="text-xs md:text-sm font-light text-[#515154] leading-relaxed">
                  {tabs[activeTab as keyof typeof tabs].description}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {tabs[activeTab as keyof typeof tabs].bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-light text-[#515154]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2d5a3e] mt-1.5 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* Right Side: Full Height Image with Box Theme (No rounded corners, edge-to-edge) */}
          <div className="relative h-[60vh] lg:h-full min-h-[500px] w-full bg-stone-900 group overflow-hidden reveal-on-scroll scale-up">

            {/* Showroom Photo representing active tab */}
            <Image
              src="/view.png"
              alt="Villa Nelith Luxury Architectural Showcase"
              fill
              placeholder="blur"
              blurDataURL={rgbDataURL(60, 45, 30)}
              className="object-cover object-center transition-transform duration-[2500ms] ease-out group-hover:scale-105"
              priority
            />

            {/* Gradient shadow overlay for text readability, sharp edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Sharp Box Info Overlay */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-10">
              <div className="space-y-2 max-w-md">
                <p className="text-[10px] font-light uppercase tracking-widest text-[#b8d2c2]">EXQUISITE SPACIOUSNESS</p>
                <h4 className="font-sans text-3xl font-light text-white tracking-wide">The Living Pavilion</h4>
                <p className="text-xs font-light text-zinc-300 leading-relaxed">
                  Warm ambient glow accentuating raw, structural black steel and golden Indonesian teak details.
                </p>
              </div>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="glass-button w-14 h-14 flex items-center justify-center text-white bg-white/10 border-white/20 cursor-pointer hover:bg-[#2d5a3e] hover:border-[#2d5a3e] active:scale-95 transition-all duration-300"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Subtle forest glow flare overlay */}
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#2d5a3e]/10 blur-[100px] pointer-events-none" />
          </div>

        </section>

        {/* Section: Architectural Digest Stats / Detail Grid */}
        <section id="details" className="relative py-20 bg-[#f5f5f7] border-y border-stone-200/50">
          <div className="max-w-8xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="glass-card p-8 rounded-3xl space-y-4 reveal-on-scroll">
                <div className="text-xs font-light uppercase tracking-[0.2em] text-[#2d5a3e]">01 / ARCHITECTURE</div>
                <h3 className="text-lg font-light text-[#1d1d1f] tracking-wide">Obsidian A-Frame</h3>
                <p className="text-xs font-light text-[#515154] leading-relaxed">
                  A synthesis of geometric form and luxury minimalism. Matte black structural steel frames house vast planes of architectural glass, framing views of towering palms.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl space-y-4 reveal-on-scroll reveal-delay-100">
                <div className="text-xs font-light uppercase tracking-[0.2em] text-[#2d5a3e]">02 / FINISHES</div>
                <h3 className="text-lg font-light text-[#1d1d1f] tracking-wide">Weathered Ironwood</h3>
                <p className="text-xs font-light text-[#515154] leading-relaxed">
                  The sun-drenched deck utilizes premium ironwood panels, designed to mature gracefully over seasons. Indoor surfaces are dressed in warm Indonesian gold-teak.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl space-y-4 reveal-on-scroll reveal-delay-200">
                <div className="text-xs font-light uppercase tracking-[0.2em] text-[#2d5a3e]">03 / EXPERIENCE</div>
                <h3 className="text-lg font-light text-[#1d1d1f] tracking-wide">Golden Hour Flare</h3>
                <p className="text-xs font-light text-[#515154] leading-relaxed">
                  Carefully oriented to catch sunset rays. As light filters through the tropical canopy, dramatic shadows dance across the open wooden deck, evoking serene exclusivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Resort FAQ details */}
        <section id="faq" className="relative py-24 bg-[#fbfbfd]">
          <div className="max-w-4xl mx-auto px-6">

            <div className="text-center mb-16 space-y-3 reveal-on-scroll">
              <p className="text-xs font-light uppercase tracking-[0.2em] text-[#2d5a3e]">QUESTIONS & RESERVATION DETAILS</p>
              <h2 className="font-sans text-3xl md:text-5xl font-light text-[#1d1d1f]">The Sanctuary FAQ</h2>
              <div className="w-12 h-[1px] bg-[#2d5a3e] mx-auto mt-6" />
            </div>

            <div className="space-y-4 text-[#1d1d1f]">

              {[
                {
                  q: "What makes Villa Nelith distinct from standard luxury retreats?",
                  a: "Villa Nelith is a custom-commissioned masterpiece combining mid-century A-frame geometry with high-grade modern construction. By blending raw black steel and high-end natural hardwoods, we achieve an industrial-organic visual harmony featured regularly in premium architectural magazines."
                },
                {
                  q: "Can the property be rented for editorial photography or private events?",
                  a: "Yes. Our sun-drenched teak decks, dramatic glass reflections, and golden hour lighting make the villa an ideal canvas for luxury editorial shoots. Private bookings require prior consultation to preserve the delicate forest biosphere."
                },
                {
                  q: "What exclusive amenities are included in a resident booking?",
                  a: "Reservations include a private estate manager, an on-site wellness specialist, a state-of-the-art saltwater infinity pool, custom organic linen, and fully-tailored dining prepared by our private culinary staff using forest-to-table ingredients."
                }
              ].map((item, idx) => (
                <div key={idx} className={`border-b border-stone-200 pb-4 reveal-on-scroll reveal-delay-${(idx + 1) * 100}`}>
                  <button
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left py-4 focus:outline-none cursor-pointer group"
                  >
                    <span className="text-sm font-light tracking-wide text-[#1d1d1f] transition-colors duration-300">
                      {item.q}
                    </span>
                    <span className="text-[#2d5a3e] ml-4 flex-shrink-0">
                      {faqOpen === idx ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      )}
                    </span>
                  </button>
                  {faqOpen === idx && (
                    <div className="pt-2 pb-4 animate-fade-in">
                      <p className="text-xs font-light text-[#515154] leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}

            </div>

          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="bg-[#f5f5f7] py-16 border-t border-stone-200/50 text-center space-y-6">
        <p className="font-sans text-xl font-light text-[#1d1d1f]">Villa Nelith</p>
        <p className="text-[10px] font-light uppercase tracking-widest text-[#86868b]">
          © {new Date().getFullYear()} VILLA NELITH RESORT. ALL RIGHTS RESERVED.
        </p>
      </footer>

      {/* Interactive Slide-over Reservation Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">

          {/* Backdrop Overlay */}
          <div
            onClick={closeBooking}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-500 animate-fade-in"
          />

          {/* Sliding Panel */}
          <div className="relative w-full max-w-md h-full bg-white border-l border-stone-200 shadow-2xl p-8 flex flex-col justify-between z-10 animate-fade-in-right">

            {/* Header info */}
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-stone-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-light tracking-widest uppercase text-[#2d5a3e]">SECURE RESERVATION</p>
                  <h3 className="font-sans text-xl font-light text-[#1d1d1f]">Select Availability</h3>
                </div>
                <button
                  onClick={closeBooking}
                  className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer text-[#1d1d1f]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {bookingStep === 1 ? (
                /* Booking Form */
                <form onSubmit={handleBookingSubmit} className="space-y-6 pt-8">

                  <div className="space-y-2">
                    <label className="text-[10px] font-light uppercase tracking-widest text-[#86868b]">Suite Style</label>
                    <select
                      value={bookingDetails.suite}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, suite: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#2d5a3e] transition-colors"
                    >
                      <option value="A-Frame Master Suite">A-Frame Master Suite (Teak Deck Access)</option>
                      <option value="Tropical Garden Canopy Suite">Tropical Garden Canopy Suite</option>
                      <option value="Obsidian Glass Ocean View Studio">Obsidian Glass Ocean View Studio</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-light uppercase tracking-widest text-[#86868b]">Check In</label>
                      <input
                        type="date"
                        required
                        value={bookingDetails.checkIn}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, checkIn: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#2d5a3e] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-light uppercase tracking-widest text-[#86868b]">Check Out</label>
                      <input
                        type="date"
                        required
                        value={bookingDetails.checkOut}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, checkOut: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#2d5a3e] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-light uppercase tracking-widest text-[#86868b]">Guests Count</label>
                    <select
                      value={bookingDetails.guests}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, guests: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#2d5a3e] transition-colors"
                    >
                      <option value="1 Guest">1 Resident</option>
                      <option value="2 Guests">2 Residents</option>
                      <option value="3 Guests">3 Residents</option>
                      <option value="4 Guests">4 Residents (Max occupancy)</option>
                    </select>
                  </div>

                  <div className="bg-stone-50 border border-stone-150 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-light text-[#515154]">
                      <span>Daily Reservation Rate</span>
                      <span>$1,450 / night</span>
                    </div>
                    <div className="flex justify-between text-xs font-light text-[#515154]">
                      <span>Forest Biosphere Levy</span>
                      <span>Included</span>
                    </div>
                    <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-light text-[#1d1d1f]">
                      <span>Resident Estimate</span>
                      <span className="text-[#2d5a3e]">$1,450 USD</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl text-xs font-normal uppercase tracking-widest text-white bg-black hover:bg-[#2d5a3e] transition-colors duration-300 cursor-pointer shadow-md active:scale-98"
                  >
                    Confirm & Hold Dates
                  </button>

                </form>
              ) : (
                /* Reservation Success State */
                <div className="pt-12 text-center space-y-6 animate-fade-in">

                  {/* Big Checkmark */}
                  <div className="w-16 h-16 rounded-full bg-[#2d5a3e]/10 border border-[#2d5a3e]/30 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-[#2d5a3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-sans text-2xl font-light text-[#1d1d1f]">Dates Reserved</h4>
                    <p className="text-xs font-light text-[#515154] leading-relaxed">
                      Your requested reservation for <span className="text-[#1d1d1f] font-light">{bookingDetails.suite}</span> is currently held for 20 minutes while we finalize processing.
                    </p>
                  </div>

                  <div className="bg-stone-50 border border-stone-150 p-4 rounded-2xl text-left text-xs font-light space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#86868b]">Residents</span>
                      <span className="text-[#1d1d1f] font-light">{bookingDetails.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#86868b]">Check-In Date</span>
                      <span className="text-[#1d1d1f] font-light">{bookingDetails.checkIn || "To be configured"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#86868b]">Check-Out Date</span>
                      <span className="text-[#1d1d1f] font-light">{bookingDetails.checkOut || "To be configured"}</span>
                    </div>
                  </div>

                  <button
                    onClick={closeBooking}
                    className="w-full py-4 rounded-xl text-xs font-normal uppercase tracking-widest text-[#1d1d1f] border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>

                </div>
              )}
            </div>

            {/* Slide-over Footer */}
            <div className="text-[10px] font-light text-[#86868b] text-center pt-6 border-t border-stone-100">
              Secure payments handled by Apple Pay.
            </div>

          </div>

        </div>
      )}

      {/* Full Page Content Gate Overlay (Faded lock screen - Half Height content with fading top) */}
      {shouldRenderGate && (
        <div className={`fixed inset-0 z-50 flex flex-col justify-end bg-gradient-to-b from-transparent via-[#fbfbfd]/95 to-[#fbfbfd] gate-overlay ${isGateActive ? "active" : ""} pointer-events-auto`}>
          
          {/* Close button in top-right of screen */}
          <button
            onClick={closeGate}
            className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 rounded-full border border-stone-200/80 bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white hover:border-stone-400 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer text-[#1d1d1f] shadow-xs z-50"
            aria-label="Close preview"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Centered Pitch Card */}
          <div className={`max-w-md w-full mx-auto mb-[8vh] px-6 text-center space-y-5 gate-card ${isGateActive ? "active" : ""}`}>

            {/* Profile Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#2d5a3e] shadow-md bg-stone-50">
              <Image
                src="/profile.jpeg"
                alt="Deneth Kavindu - Professional Web Designer"
                fill
                placeholder="blur"
                blurDataURL={rgbDataURL(220, 225, 220)}
                className="object-cover"
              />
            </div>

            {/* Typography */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#2d5a3e]">DEMO SITE PREVIEW</span>
              <h3 className="font-sans text-3xl font-light text-[#1d1d1f] tracking-tight leading-tight">
                Unlock the Full Web Experience
              </h3>
              <p className="text-xs font-light text-[#515154] leading-relaxed max-w-sm mx-auto">
                This premium luxury resort interface was custom designed and developed by <strong className="font-normal text-[#1d1d1f]">Deneth Kavindu</strong>.
              </p>
              <p className="text-xs font-light text-[#515154] leading-relaxed max-w-sm mx-auto">
                Contact me to build a professional, high-end web presence for your own brand.
              </p>
            </div>

            {/* Dynamic Buttons */}
            <div className="space-y-3.5 max-w-xs mx-auto pt-2">
              <a
                href="tel:0768250161"
                className="flex items-center justify-center gap-2.5 w-full py-3 bg-[#2d5a3e] hover:bg-[#244832] text-white text-xs font-medium uppercase tracking-widest rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call Deneth Kavindu: 076 825 0161</span>
              </a>

              <a
                href="https://deneth.site"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-stone-300 hover:border-stone-850 text-stone-600 hover:text-stone-900 text-xs font-medium uppercase tracking-widest rounded-full transition-all duration-300 bg-white/80 shadow-xs cursor-pointer"
              >
                <span>Explore deneth.site</span>
                <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <button
                onClick={closeGate}
                className="text-xs font-light text-stone-400 hover:text-stone-700 underline underline-offset-4 transition-colors cursor-pointer pt-2 block mx-auto"
              >
                Skip and continue reading
              </button>
            </div>

          </div>
        </div>
      )}
      {/* Sticky Floating Bottom Mini-Card (shown after main gate is dismissed) */}
      {isMiniCardVisible && (
        <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-40 w-auto md:w-full md:max-w-sm bg-white/90 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-xl p-4 flex items-center justify-between gap-4 transition-all duration-700 ease-out ${isMiniCardActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}>
          
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#2d5a3e]/30 bg-stone-50 flex-shrink-0">
              <Image
                src="/profile.jpeg"
                alt="Deneth Kavindu"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold tracking-wider text-[#2d5a3e] uppercase">PREVIEW DESIGNER</p>
              <h4 className="text-xs font-medium text-[#1d1d1f]">Deneth Kavindu</h4>
              <p className="text-[9px] text-[#515154] font-light">Custom High-End Web Development</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:0768250161"
              className="w-8 h-8 rounded-full bg-[#2d5a3e] hover:bg-[#244832] flex items-center justify-center text-white transition-all active:scale-90 shadow-xs cursor-pointer"
              title="Call Deneth"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <a
              href="https://deneth.site"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-stone-200 hover:border-stone-500 bg-white flex items-center justify-center text-stone-600 hover:text-stone-900 transition-all active:scale-90 shadow-2xs cursor-pointer"
              title="Visit Website"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={() => {
                setIsMiniCardActive(false);
                setTimeout(() => setIsMiniCardVisible(false), 700);
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-700 cursor-pointer"
              title="Close"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
