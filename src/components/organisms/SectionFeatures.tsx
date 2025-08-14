import React from "react";

interface SectionFeaturesProps {
  onSignUpClick: () => void;
  outlineBtn: string;
  filledBtn: string;
}

const SectionFeatures: React.FC<SectionFeaturesProps> = ({ onSignUpClick, outlineBtn, filledBtn }) => (
  <>
    {/* Black/Green Gradient Section */}
    <section
      className="w-full"
      style={{ background: "linear-gradient(120deg, #000000 60%, #006600 100%)" }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-8 md:py-12 px-4 md:px-0 text-center">
        <p className="text-white text-base md:text-xl font-medium mb-6">
          Build strategies, test signals, deploy bots & benchmark performances, all in one single
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <button onClick={onSignUpClick} className={outlineBtn}>
            Sign up now
          </button>
          <button className={filledBtn}>Start creating bots</button>
        </div>
      </div>
    </section>

    {/* Placeholder Media Section 1 */}
    <section className="w-full bg-white flex items-center justify-center py-10 md:py-16">
      <span className="text-gray-500 text-base md:text-lg">Placeholder media of our system</span>
    </section>

    {/* Blue/Black Gradient Section */}
    <section
      className="w-full"
      style={{ background: "linear-gradient(120deg, #001033 0%, #003366 40%, #000000 100%)" }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-start justify-center py-10 md:py-16 px-4 md:px-0 text-left">
        <h2 className="text-white text-4xl sm:text-5xl font-light mb-2 leading-tight text-left">Intuitive & user-friendly</h2>
        <p className="text-white text-lg font-normal mb-8 text-left">
          platform lets you mindfully choose the best strategies that work for you.
        </p>
        <button className={outlineBtn + " w-full max-w-xs mx-auto"}>Explore strategies</button>
      </div>
    </section>

    {/* Placeholder Media Section 2 */}
    <section className="w-full bg-white flex items-center justify-center py-10 md:py-16">
      <span className="text-gray-500 text-base md:text-lg">Placeholder media of our system</span>
    </section>

    {/* Black/Green Gradient Section */}
    <section
      className="w-full"
      style={{ background: "linear-gradient(120deg, #000000 60%, #006600 100%)" }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-start justify-center py-10 md:py-16 px-4 md:px-0 text-left">
        <h2 className="text-white text-4xl sm:text-5xl font-light mb-2 leading-tight text-left">Clean & clear</h2>
        <p className="text-white text-lg font-normal mb-8 text-left">
          user-experience, don't miss out on risk management for all your investments.
        </p>
        <button className={outlineBtn + " w-full max-w-xs mx-auto"}>Explore strategies</button>
      </div>
    </section>
  </>
);

export default SectionFeatures; 