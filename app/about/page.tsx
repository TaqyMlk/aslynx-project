import React from 'react';
import { Metadata } from 'next';
import AboutSection from '@/src/components/home/AboutSection';
import FieldsSection from '@/src/components/home/FieldsSection';
import SkillsSection from '@/src/components/home/SkillsSection';
import ExperienceSection from '@/src/components/home/ExperienceSection';
import ContactSection from '@/src/components/home/ContactSection';

export const metadata: Metadata = {
  title: 'About — Muhammad Abdulhadi Taqy (AsLynx)',
  description: 'Profile, engineering philosophy, technical proficiencies, and milestone history of AsLynx.'
};

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-8 pt-16">
      <AboutSection />
      <FieldsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  );
}
