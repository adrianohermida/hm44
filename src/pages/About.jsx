import React from "react";
import SEOAboutEnhanced from "@/components/seo/SEOAboutEnhanced";
import SchemaLawyer from "@/components/seo/SchemaLawyer";
import Breadcrumb from "@/components/seo/Breadcrumb";
import HeroSection from "@/components/about/HeroSection";
import TimelineSection from "@/components/about/TimelineSection";
import ValuesSection from "@/components/about/ValuesSection";
import PodcastSection from "@/components/about/PodcastSection";
import EventsSection from "@/components/about/EventsSection";
import PublicationsSection from "@/components/about/PublicationsSection";
import CTASection from "@/components/about/CTASection";

export default function About() {
  const breadcrumbItems = [
    { label: "Sobre o Escritório" }
  ];

  return (
    <>
      <SEOAboutEnhanced />
      <SchemaLawyer />
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <HeroSection />
        <TimelineSection />
        <ValuesSection />
        <PodcastSection />
        <EventsSection />
        <PublicationsSection />
        <CTASection />
      </div>
    </>
  );
}