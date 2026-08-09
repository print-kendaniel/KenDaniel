"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import "./staggered-menu.css";

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  href: string | null;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (item: StaggeredMenuItem) => void;
  position?: "left" | "right";
  colors?: string[];
  items: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  accentColor?: string;
}

export function StaggeredMenu({
  open,
  onClose,
  onNavigate,
  position = "right",
  colors = ["#80011f", "#f7e7ce"],
  items,
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  accentColor = "#80011f",
}: StaggeredMenuProps) {
  const panelRef = useRef<HTMLElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLDivElement[]>([]);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      const layers = preContainer ? Array.from(preContainer.querySelectorAll<HTMLDivElement>(".sm-prelayer")) : [];
      preLayerElsRef.current = layers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...layers], { xPercent: offscreen });
    });
    return () => ctx.revert();
  }, [position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"));
    const numberEls = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-list[data-numbering] .sm-panel-item"));
    const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>(".sm-socials-link"));

    const offscreen = position === "left" ? -100 : 100;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 } as gsap.TweenVars);
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07);
    });
    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDuration, ease: "power4.out" }, panelInsertTime);

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: { each: 0.1, from: "start" } },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: "power2.out", "--sm-num-opacity": 1, stagger: { each: 0.08, from: "start" } } as gsap.TweenVars,
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: "power2.out" }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-list[data-numbering] .sm-panel-item"));
        if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 } as gsap.TweenVars);
        const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
        const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>(".sm-socials-link"));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      },
    });
  }, [position]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (open) playOpen();
    else playClose();
  }, [open, playOpen, playClose]);

  const prelayerColors = colors.length >= 3 ? [...colors.slice(0, colors.length - 1)] : colors;

  return (
    <>
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {prelayerColors.map((color, i) => (
          <div key={i} className="sm-prelayer" style={{ background: color }} />
        ))}
      </div>

      <aside
        ref={panelRef}
        id="staggered-menu-panel"
        className="staggered-menu-panel"
        data-position={position}
        aria-hidden={!open}
        style={accentColor ? ({ "--sm-accent": accentColor } as React.CSSProperties) : undefined}
      >
        <button type="button" onClick={onClose} className="sm-close" aria-label="Close menu">
          Close
        </button>

        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items.map((item, idx) => (
              <li className="sm-panel-itemWrap" key={item.label}>
                {item.href ? (
                  <Link
                    className="sm-panel-item"
                    href={item.href}
                    aria-label={item.ariaLabel}
                    data-index={idx + 1}
                    onClick={() => onNavigate(item)}
                  >
                    <span className="sm-panel-itemLabel">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="sm-panel-item"
                    aria-label={item.ariaLabel}
                    data-index={idx + 1}
                    onClick={() => onNavigate(item)}
                  >
                    <span className="sm-panel-itemLabel">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>

          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Elsewhere</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s) => (
                  <li key={s.label} className="sm-socials-item">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
