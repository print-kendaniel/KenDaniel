import { listProjects } from "@/lib/firebase/firestore";
import { Hero } from "@/components/home/hero";
import { CreateBand } from "@/components/home/create-band";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { ServicesSection } from "@/components/home/services-section";
import { StatsSection } from "@/components/home/stats-section";
import { ScrollExpand } from "@/components/effects/scroll-expand";
import { ParallaxGallery } from "@/components/effects/parallax-gallery";
import { profile } from "@/lib/content/profile";

export default async function HomePage() {
  const allProjects = await listProjects();

  return (
    <>
      <Hero projectsCount={allProjects.length} latestProject={allProjects[0] ?? null} />
      <ScrollExpand
        src="/about/portrait.jpg"
        alt={profile.name}
        title={profile.name}
        scrollHint="Scroll"
        useWindowScroll
      >
        <h2>{profile.title}</h2>
        <p>{profile.location}</p>
      </ScrollExpand>
      <CreateBand />
      <ParallaxGallery />
      <PortfolioSection projects={allProjects} />
      <ServicesSection />
      <StatsSection projectsCount={allProjects.length} />
    </>
  );
}
