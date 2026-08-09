import type { Metadata, Viewport } from "next";
import { Onest, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { profile } from "@/lib/content/profile";
import { publicConfig } from "@/lib/config/public";
import { ScrollProvider } from "@/components/effects/scroll-provider";
import { IntroReadyProvider } from "@/components/effects/intro-ready-context";
import { ContactModalProvider } from "@/components/contact/contact-modal-context";
import { AdaptiveGrid } from "@/components/effects/adaptive-grid";
import { PageLoader } from "@/components/effects/page-loader";
import { ContactModal } from "@/components/contact/contact-modal";
import { PageTransition } from "@/components/effects/page-transition";
import { MagneticCursorProvider } from "@/components/effects/magnetic-cursor-provider";
import { UiSoundProvider } from "@/components/effects/ui-sound-provider";
import { GrainOverlay } from "@/components/effects/grain-overlay";
import { SvgFilters } from "@/components/effects/svg-filters";
import { SoundToggle } from "@/components/ui/sound-toggle";
import { SiteDock } from "@/components/layout/site-dock";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicConfig.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${profile.name} – ${profile.title}`,
    template: `%s – ${profile.name}`,
  },
  description: profile.summary,
  openGraph: {
    type: "website",
    title: `${profile.name} – ${profile.title}`,
    description: profile.summary,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} – ${profile.title}`,
    description: profile.summary,
  },
};

export const viewport: Viewport = {
  themeColor: "#80011f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable} ${jetbrainsMono.variable} antialiased`}>
        <a
          href="#main"
          className="fixed top-4 left-4 z-60 -translate-y-20 rounded-control bg-ink px-4 py-2 text-sm text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <IntroReadyProvider>
          <ScrollProvider>
            <ContactModalProvider>
              <UiSoundProvider>
                <MagneticCursorProvider>
                  <SvgFilters />
                  <GrainOverlay />
                  <AdaptiveGrid />
                  <PageLoader />
                  <div className="flex min-h-screen flex-col">
                    <Header />
                    <div id="main" className="flex-1">
                      <PageTransition>{children}</PageTransition>
                    </div>
                    <Footer />
                  </div>
                  <ContactModal />
                  <SoundToggle />
                  <SiteDock />
                </MagneticCursorProvider>
              </UiSoundProvider>
            </ContactModalProvider>
          </ScrollProvider>
        </IntroReadyProvider>
      </body>
    </html>
  );
}
