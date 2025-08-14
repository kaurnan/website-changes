import React from "react";
import SectionHero from "../components/organisms/SectionHero";
import SectionFeatures from "../components/organisms/SectionFeatures";

const Home = () => {
  // Button classes
  const baseBtn =
    "w-full max-w-xs md:w-auto px-10 py-2 font-semibold rounded-full transition-all duration-200 shadow-md tracking-wide text-lg focus:outline-none focus:ring-2 focus:ring-[#19d94b] focus:ring-offset-2 active:scale-95";
  const outlineBtn =
    baseBtn +
    " border border-white text-white bg-transparent hover:bg-white/10 hover:shadow-lg hover:scale-105 hover:-translate-y-1";
  const filledBtn =
    baseBtn +
    " bg-[#19d94b] text-black border border-[#19d94b] hover:bg-[#13b53e] hover:text-white hover:shadow-lg hover:scale-105 hover:-translate-y-1";

  return (
    <div className="min-h-screen w-full bg-black font-sans flex flex-col items-center justify-center">
      <SectionHero />
      <SectionFeatures
        onSignUpClick={() => {}}
        outlineBtn={outlineBtn}
        filledBtn={filledBtn}
      />
    </div>
  );
};

export default Home; 