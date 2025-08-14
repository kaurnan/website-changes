import React from "react";

const SectionHero = () => (
  <section
    className="w-full"
    style={{ background: "linear-gradient(120deg, #000d00 0%, #006600 60%, #00ff66 100%)" }}
  >
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-0 text-center">
      <h1
        className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-8 text-center"
        style={{ textShadow: "0 2px 16px rgba(0,0,0,0.18)" }}
      >
        The future of 0-BS<br />automated investing<br />is here. Simple, clear<br />& effective.
      </h1>
    </div>
  </section>
);

export default SectionHero; 