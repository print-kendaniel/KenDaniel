import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { DecryptText } from "@/components/effects/decrypt-text";
import { RevealFade } from "@/components/effects/reveal-fade";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Ken Daniel Llamanzares.",
};

export default function ContactPage() {
  return (
    <main className="shell flex max-w-xl flex-col gap-8 px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <DecryptText lines={["Contact"]} className="text-4xl font-semibold tracking-tight sm:text-5xl" />
      <RevealFade delay={100} translateY={16}>
        <ContactForm />
      </RevealFade>
    </main>
  );
}
