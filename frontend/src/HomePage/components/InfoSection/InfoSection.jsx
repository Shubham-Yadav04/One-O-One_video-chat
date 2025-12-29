import React from "react";
import HeroSection from "./components/HeroSection";
import FeaturesGrid from "./components/FeaturesGrid";
import StatsSection from "./components/StatsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CallToActionSection from "./components/CallToActionSection";

function InfoSection() {
  return (
    <div className="w-screen overflow-x-hidden">
      <HeroSection />
      <FeaturesGrid />
      <StatsSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
}

export default InfoSection;
