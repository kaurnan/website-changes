import React from "react";

const Footer = () => (
  <footer className="w-full flex flex-col items-center justify-center py-8 bg-white border-t border-gray-100 mt-4">
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-gray-500 text-sm w-full items-center justify-center">
      <a href="#" className="hover:underline">Pricing & subscriptions</a>
      <a href="#" className="hover:underline">For investors</a>
      <a href="#" className="hover:underline">Support</a>
    </div>
  </footer>
);

export default Footer; 