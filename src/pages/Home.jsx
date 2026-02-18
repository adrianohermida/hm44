import React from "react";
import PublicChatWidget from "@/components/PublicChatWidget";

// Critical Components (Above fold)
import SEOHome from "@/components/seo/SEOHome";
import PreloadCritical from "@/components/seo/PreloadCritical";
import HeroPremium from "@/components/home/HeroPremium";
import BenefitsSection from "@/components/home/BenefitsSection";
import CalculatorSection from "@/components/home/CalculatorSection";
import TestimonialSectionEnhanced from "@/components/testimonials/TestimonialSectionEnhanced";
import ServicesOptimizedSEO from "@/components/home/ServicesOptimizedSEO";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import MediaSection from "@/components/home/MediaSection";
import YouTubeShortsSection from "@/components/home/YouTubeShortsSection";
import LeadMagnetSection from "@/components/home/LeadMagnetSection";
import BlogSectionNavy from "@/components/home/BlogSectionNavy";
import CtaSectionOptimized from "@/components/home/CtaSectionOptimized";
import ExitPopup from "@/components/popup/ExitPopup";

// Schema (No render blocking)
import SchemaLocalBusiness from "@/components/seo/SchemaLocalBusiness";
import SchemaLegalService from "@/components/seo/SchemaLegalService";
import SchemaPerson from "@/components/seo/SchemaPerson";

export default function Home() {
  const handleScrollToCalculator = () => {
    document.getElementById('calculadora-section')?.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEOHome />
      <PreloadCritical />
      <SchemaLocalBusiness />
      <SchemaLegalService />
      <SchemaPerson />
      
      <HeroPremium onScrollToCalc={handleScrollToCalculator} />
      <BenefitsSection />
      <CalculatorSection />
      <HowItWorksSection />
      <TestimonialSectionEnhanced />
      <ServicesOptimizedSEO />
      <MediaSection />
      <YouTubeShortsSection key="shorts-section" />
      <LeadMagnetSection />
      <BlogSectionNavy />
      <CtaSectionOptimized onScrollToCalc={handleScrollToCalculator} />
      <PublicChatWidget />
    </div>
  );
}