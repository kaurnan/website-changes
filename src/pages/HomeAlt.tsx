import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const heroContent = [
  {
    topLabel: null,
    heading: (
      <>
        <h1 className="text-white text-2xl md:text-3xl font-medium leading-relaxed mb-4 text-center">
          Create bots that trade & invest<br />
          confidently without complications<br />
          on our 0-BS platform!
        </h1>
        <h2 className="text-white text-lg md:text-xl font-normal leading-relaxed mb-4 text-center">
          Welcome to simplifying trading &<br />investing for everyone.
        </h2>
      </>
    ),
  },
  {
    topLabel: (
      <span className="inline-block bg-[#19d94b] text-black font-normal px-2 py-1 rounded text-base mb-3" style={{lineHeight:1}}>Be confident,</span>
    ),
    heading: (
      <h1 className="text-white text-2xl md:text-3xl font-medium leading-relaxed mb-4 text-left">
        with our new age 0-BS platform<br />
        allows to automate<br />
        your trading & investing strategies<br />
        to overcome high emotional<br />
        stress & bad risk management!
      </h1>
    ),
  },
];

const greenText = (
  <div className="text-[#19d94b] text-base font-normal mb-6 text-center">
    Build strategies, test signals, deploy bots &<br />benchmark performances, all in one single space.
  </div>
);

const HomeAlt = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroContent.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full font-sans bg-white flex flex-col items-center justify-start">
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        {/* Hero Box - full width, max-w-xl, shadow, polished spacing */}
        <div className="relative w-full bg-black flex flex-col items-center justify-center py-12 shadow-xl min-h-[480px]">
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center px-4 sm:px-8">
            <div className="w-full flex flex-col items-center justify-start" style={{ height: 240 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="w-full flex flex-col items-center justify-center"
                >
                  {active === 1 ? (
                    <div className="w-full flex flex-col items-start mb-2">
                      {heroContent[active].topLabel}
                    </div>
                  ) : null}
                  {heroContent[active].heading}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="w-full flex flex-col items-center justify-end mt-2">
              {greenText}
              <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center mt-2">
                {active === 1 ? (
                  <>
                    <button className="w-full max-w-md md:w-auto md:flex-1 py-2 px-6 font-semibold rounded-full border border-white text-white bg-transparent transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#19d94b] focus:ring-offset-2 active:scale-95 text-lg" style={{outline: 'none'}}>
                      Sign up now!
                    </button>
                    <button className="w-full max-w-md md:w-auto md:flex-1 py-2 px-6 font-semibold rounded-full bg-[#19d94b] text-black border border-[#19d94b] transition-all duration-200 hover:bg-[#13b53e] hover:text-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#19d94b] focus:ring-offset-2 active:scale-95 text-lg">
                      Check our bots
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full max-w-md md:w-auto md:flex-1 py-2 px-6 font-semibold rounded-full border border-white text-white bg-transparent transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#19d94b] focus:ring-offset-2 active:scale-95 text-lg" style={{outline: 'none'}}>
                      Sign up now
                    </button>
                    <button className="w-full max-w-md md:w-auto md:flex-1 py-2 px-6 font-semibold rounded-full bg-[#19d94b] text-black border border-[#19d94b] transition-all duration-200 hover:bg-[#13b53e] hover:text-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#19d94b] focus:ring-offset-2 active:scale-95 text-lg">
                      Start creating bots
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Dots for manual control, below the box */}
        <div className="w-full flex justify-center items-center mb-8">
          {heroContent.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 border-[#19d94b] mx-1 transition-all duration-200 ${active === idx ? 'bg-[#19d94b]' : 'bg-transparent'}`}
              onClick={() => setActive(idx)}
              aria-label={`Show hero section ${idx + 1}`}
            />
          ))}
        </div>
        {/* White gap between sections */}
        <div className="w-full h-8 bg-white" />
        {/* Intuitive Section */}
        <section className="w-full flex flex-col items-center justify-center" style={{background:'#0d2a4a'}}>
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-16 md:py-20 px-6 md:px-12 rounded-xl shadow-lg">
            <div className="w-full text-left">
              <span className="text-[#00ffd0] text-lg font-normal">Our</span>
              <div className="text-[#00ffd0] text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-2">intuitive & user-friendly</div>
              <div className="text-[#00ffd0] text-base font-normal mb-8">platform lets you mindfully choose the best strategies that work for you.</div>
            </div>
            <button className="w-full max-w-xs md:w-auto px-10 py-2 rounded-full bg-[#00ffd0] text-black font-semibold text-lg mx-auto block mt-4 md:mt-8 shadow-md border border-[#00ffd0] tracking-wide transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#00ffd0] focus:ring-offset-2 active:scale-95">
              Explore strategies
            </button>
          </div>
        </section>
        {/* White gap between sections */}
        <div className="w-full h-8 bg-white" />
        {/* Clean & Clear Section */}
        <section className="w-full flex flex-col items-center justify-center" style={{background:'#19d94b'}}>
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-16 md:py-20 px-6 md:px-12 rounded-xl shadow-lg">
            <div className="w-full text-left">
              <span className="text-white text-lg font-normal">With our</span>
              <div className="text-white text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-2">clean & clear</div>
              <div className="text-white text-base font-normal mb-8">user-experience,<br />you won’t miss out on any risk management for all your investments.</div>
            </div>
            <button className="w-full max-w-xs md:w-auto px-10 py-2 rounded-full bg-black text-white font-semibold text-lg mx-auto block mt-4 md:mt-8 shadow-md border border-black tracking-wide transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 active:scale-95">
              Explore strategies
            </button>
          </div>
        </section>
      </main>
      {/* Footer */}
      {/* <footer className="w-full flex flex-col items-center justify-center py-8 bg-white border-t border-gray-100 mt-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-gray-500 text-sm w-full items-center justify-center">
          <a href="#" className="hover:underline">Pricing & subscriptions</a>
          <a href="#" className="hover:underline">For investors</a>
          <a href="#" className="hover:underline">Support</a>
        </div>
      </footer> */}
    </div>
  );
};

export default HomeAlt; 