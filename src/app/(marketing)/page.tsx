import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Benefits, Experience, FinalCTA, Footer, HowItWorks, ProgressAndMethod, Trust } from "@/components/marketing/sections";
import { LanguageExperience } from "@/components/marketing/language-experience";
import { FAQ } from "@/components/marketing/faq";

export default function HomePage() {
  return <div className="marketing-site"><Header /><main><Hero /><Benefits /><Experience /><LanguageExperience /><HowItWorks /><ProgressAndMethod /><Trust /><FAQ /><FinalCTA /></main><Footer /></div>;
}
