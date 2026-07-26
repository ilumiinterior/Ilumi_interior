import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_STORIES = [
  {
    id: "zaciatok",
    index: "01",
    sources: {
      mobile: "/media/ilumi-mobile.mp4",
      desktop: "/media/ilumi-1440.mp4",
    },
    poster: "/media/poster.jpg",
    title: "Váš interiér...",
    outro: "navrhnutý do posledného detailu",
    ariaLabel: "Animovaná prezentácia návrhu kuchyne ILUMI INTERIOR",
    showHeader: true,
    priority: true,
  },
  {
    id: "obyvacia-izba",
    index: "02",
    sources: {
      mobile: "/media/ilumi-v2-mobile.mp4",
      desktop: "/media/ilumi-v2-1440.mp4",
    },
    poster: "/media/poster-v2.jpg",
    title: "Priestor, ktorý žije s vami.",
    outro: "premyslený v každom pohľade",
    ariaLabel: "Animovaná prezentácia obývacieho priestoru ILUMI INTERIOR",
    priority: false,
  },
];

const DRAWINGS_STORY = {
  sources: {
    mobile: "/media/ilumi-drawings-mobile.mp4",
    desktop: "/media/ilumi-drawings-1080.mp4",
  },
  poster: "/media/poster-drawings.jpg",
  ariaLabel: "Projektová dokumentácia interiéru ILUMI INTERIOR",
};

const SERVICES = [
  {
    title: "Interiérový dizajn",
    description:
      "Premyslený návrh priestoru, dispozície, materiálov, svetla a nábytku. Nie dekoratívna náhoda oblečená do béžovej.",
    icon: "compass",
  },
  {
    title: "Fotorealistické vizualizácie",
    description:
      "Silné statické výstupy pre klientov, prezentácie, predaj a rozhodovanie ešte pred realizáciou.",
    icon: "camera",
  },
  {
    title: "Interaktívne prehliadky",
    description:
      "Priestor, ktorý sa dá prejsť cez mobil, tablet alebo PC. Ideálne pre developerov, showroomy a realitný predaj.",
    icon: "cursor",
  },
];

const PRICING = [
  {
    tier: "Štandard",
    title: "Návrh interiéru s vizualizáciami",
    price: "40 € / m²",
    note: "s DPH · pri ploche do 120 m²",
    features: [
      "digitalizácia dodaných podkladov",
      "úvodné osobné alebo online stretnutie",
      "2D pôdorysné riešenie návrhu",
      "materiálový koncept a výber prvkov",
      "fotorealistické vizualizácie interiéru",
      "zoznam použitých prvkov a materiálov",
      "jedno kolo korekcií k vizualizáciám",
    ],
  },
  {
    tier: "Premium",
    title: "Návrh interiéru s dokumentáciou",
    price: "60 € / m²",
    note: "s DPH · pri ploche do 100 m²",
    featured: true,
    badge: "Najžiadanejšie",
    features: [
      "všetko zo služby Štandard",
      "detailná projektová dokumentácia návrhu",
      "výkresy stavebných úprav, podláh, dverí a svetiel",
      "podklady pre profesistov: voda, elektro, SDK, kladačské plány",
      "výkresy nábytku na mieru: pôdorysy, pohľady, rezy a detaily",
      "podklady pre klientské zmeny u developera",
    ],
  },
  {
    tier: "Turbo",
    title: "Rýchly návrh v zrýchlenom režime",
    price: "na dopyt",
    note: "pre projekty, ktoré horia viac než rozpočet po prvej návšteve showroomu",
    features: [
      "zrýchlený harmonogram podľa kapacity",
      "prioritizácia najdôležitejších miestností",
      "rozsah a cena podľa konkrétneho zadania",
      "vhodné pri termínoch developera alebo rýchlej rekonštrukcii",
    ],
  },
];

const PROJECT_TYPES = [
  "Byt",
  "Rodinný dom",
  "Komerčný priestor",
  "Developerský projekt",
  "Iný projekt",
];

const INSTAGRAM_URL = "https://www.instagram.com/ilumi.interior/";

const INSTAGRAM_POSTS = [
  {
    url: "https://www.instagram.com/p/DbAdeqVBapM/",
    src: "/media/instagram-post-01.jpg",
    alt: "Interaktívna prezentácia návrhu obývacieho priestoru",
  },
  {
    url: "https://www.instagram.com/p/DYeVN0rAW8y/",
    src: "/media/instagram-post-02.jpg",
    alt: "Pohľad z galérie do svetlého obývacieho priestoru",
  },
  {
    url: "https://www.instagram.com/p/DYaRo_tkvWU/",
    src: "/media/instagram-post-03.jpg",
    alt: "Vizualizácia obývacej izby so zelenou sedačkou",
  },
  {
    url: "https://www.instagram.com/p/DYRftnSDy6N/",
    src: "/media/instagram-post-04.jpg",
    alt: "Interaktívny výber materiálu sedačky v návrhu interiéru",
  },
];

function selectVideoSource(sources) {
  if (typeof window === "undefined") return sources.desktop;

  const saveData = Boolean(navigator.connection?.saveData);
  const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  return saveData || compact ? sources.mobile : sources.desktop;
}

function ServiceIcon({ name }) {
  if (name === "camera") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7.5h3l1.5-2h7l1.5 2h3v11H4z" />
        <circle cx="12" cy="13" r="3.2" />
      </svg>
    );
  }

  if (name === "cursor") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 4 13.8 6.1-6.2 1.8-2.5 5.8z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="m14.7 8.3-1.8 4.6-4.6 1.8 1.8-4.6z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="check-icon" aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <path d="m4 8.2 2.4 2.4L12.2 5" />
      </svg>
    </span>
  );
}

function ScrollStory({ story, isReducedMotion }) {
  const storyRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const progressTextRef = useRef(null);
  const introRef = useRef(null);
  const outroRef = useRef(null);
  const hasInitializedVideoRef = useRef(false);
  const [videoState, setVideoState] = useState("loading");
  const [shouldPreload, setShouldPreload] = useState(story.priority);
  const videoSource = useMemo(() => selectVideoSource(story.sources), [story.sources]);
  const StoryTitle = story.index === "01" ? "h1" : "h2";

  useEffect(() => {
    if (story.priority || !storyRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPreload(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(storyRef.current);
    return () => observer.disconnect();
  }, [story.priority]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const unlockVideo = () => {
      if (video.readyState < 1) {
        video.load();
        return;
      }

      const currentTime = video.currentTime;
      video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = currentTime;
          window.removeEventListener("touchstart", unlockVideo);
        })
        .catch(() => {});
    };

    window.addEventListener("touchstart", unlockVideo, { passive: true });
    return () => window.removeEventListener("touchstart", unlockVideo);
  }, []);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video || videoState !== "ready") return undefined;

    if (isReducedMotion) {
      video.currentTime = Math.min(video.duration * 0.72, video.duration - 0.05);
      return undefined;
    }

    let cleanupSeek = () => {};
    const context = gsap.context(() => {
      const duration = Math.max(0, video.duration - 0.05);
      const frameThreshold = 1 / 60;
      let targetTime = 0;
      let seekInProgress = false;
      let seekFrame = 0;

      gsap.set(outroRef.current, { autoAlpha: 0, y: 24 });

      const applyLatestFrame = () => {
        seekFrame = 0;
        if (seekInProgress || Math.abs(video.currentTime - targetTime) < frameThreshold) {
          return;
        }

        seekInProgress = true;
        video.currentTime = targetTime;
      };

      const requestLatestFrame = () => {
        if (!seekFrame) {
          seekFrame = window.requestAnimationFrame(applyLatestFrame);
        }
      };

      const handleSeeked = () => {
        seekInProgress = false;
        if (Math.abs(video.currentTime - targetTime) >= frameThreshold) {
          requestLatestFrame();
        }
      };

      video.addEventListener("seeked", handleSeeked);

      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          targetTime = progress * duration;
          requestLatestFrame();

          const percent = Math.round(progress * 100);
          progressRef.current?.style.setProperty("--progress", progress);
          if (progressTextRef.current) {
            progressTextRef.current.textContent = String(percent).padStart(2, "0");
          }

          gsap.set(introRef.current, {
            autoAlpha: gsap.utils.clamp(0, 1, 1 - progress / 0.12),
            y: -12 * gsap.utils.clamp(0, 1, progress / 0.12),
          });

          const outroProgress = gsap.utils.clamp(0, 1, (progress - 0.86) / 0.1);
          gsap.set(outroRef.current, {
            autoAlpha: outroProgress,
            y: 24 * (1 - outroProgress),
          });
        },
      });

      cleanupSeek = () => {
        video.removeEventListener("seeked", handleSeeked);
        window.cancelAnimationFrame(seekFrame);
      };
    }, storyRef);

    ScrollTrigger.refresh();
    return () => {
      cleanupSeek();
      context.revert();
    };
  }, [videoState, isReducedMotion]);

  const handleMetadata = () => {
    const video = videoRef.current;
    if (
      !video ||
      hasInitializedVideoRef.current ||
      !Number.isFinite(video.duration) ||
      video.duration <= 0
    ) {
      return;
    }

    hasInitializedVideoRef.current = true;
    video.pause();
    video.currentTime = 0;
    setVideoState("ready");
  };

  return (
    <section
      id={story.id}
      ref={storyRef}
      className="story"
      aria-label={story.ariaLabel}
    >
      <div className="scene">
        <video
          ref={videoRef}
          className="scene__video"
          src={videoSource}
          poster={story.poster}
          preload={shouldPreload ? "auto" : "metadata"}
          muted
          playsInline
          disablePictureInPicture
          onLoadedMetadata={handleMetadata}
          onLoadedData={handleMetadata}
          onError={() => setVideoState("error")}
          aria-label={story.ariaLabel}
        />

        <div className="scene__shade" aria-hidden="true" />

        {story.showHeader && (
          <header className="topbar">
            <a className="brand" href="#zaciatok" aria-label="ILUMI INTERIOR — začiatok">
              <img src="/brand/ilumi-logo-white.png" alt="" />
            </a>
            <div className="topbar__descriptor">
              <span>Interiérový dizajn</span>
              <span>Slovensko</span>
            </div>
          </header>
        )}

        <div ref={introRef} className="intro">
          <p className="eyebrow">ILUMI INTERIOR / {story.index}</p>
          <StoryTitle className="story-title">{story.title}</StoryTitle>
          <div className="scroll-cue" aria-hidden="true">
            <span>Posúvajte</span>
            <svg viewBox="0 0 16 22">
              <path d="M8 1v18m0 0 6-6m-6 6-6-6" />
            </svg>
          </div>
        </div>

        <div ref={outroRef} className="outro">
          <p className="outro__title">{story.outro}</p>
        </div>

        <div ref={progressRef} className="progress" aria-hidden="true">
          <span ref={progressTextRef}>00</span>
          <div className="progress__track">
            <i />
          </div>
          <span>100</span>
        </div>

        {videoState === "loading" && (
          <div className="status" role="status">
            <span className="status__line" />
            <span>Pripravujem vizualizáciu</span>
          </div>
        )}

        {videoState === "error" && (
          <div className="status status--error" role="alert">
            <strong>Video sa nepodarilo načítať.</strong>
            <span>Skontrolujte pripojenie a obnovte stránku.</span>
          </div>
        )}
      </div>
    </section>
  );
}

function DrawingsStory({ isReducedMotion }) {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const progressTextRef = useRef(null);
  const hasInitializedVideoRef = useRef(false);
  const [videoState, setVideoState] = useState("loading");
  const [shouldPreload, setShouldPreload] = useState(false);
  const videoSource = useMemo(
    () => selectVideoSource(DRAWINGS_STORY.sources),
    [],
  );

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPreload(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const unlockVideo = () => {
      if (video.readyState < 1) {
        video.load();
        return;
      }

      const currentTime = video.currentTime;
      video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = currentTime;
          window.removeEventListener("touchstart", unlockVideo);
        })
        .catch(() => {});
    };

    window.addEventListener("touchstart", unlockVideo, { passive: true });
    return () => window.removeEventListener("touchstart", unlockVideo);
  }, []);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video || videoState !== "ready") return undefined;

    if (isReducedMotion) {
      video.currentTime = Math.min(video.duration * 0.58, video.duration - 0.05);
      return undefined;
    }

    let cleanupSeek = () => {};
    const context = gsap.context(() => {
      const duration = Math.max(0, video.duration - 0.05);
      const frameThreshold = 1 / 60;
      let targetTime = 0;
      let seekInProgress = false;
      let seekFrame = 0;

      const applyLatestFrame = () => {
        seekFrame = 0;
        if (seekInProgress || Math.abs(video.currentTime - targetTime) < frameThreshold) {
          return;
        }

        seekInProgress = true;
        video.currentTime = targetTime;
      };

      const requestLatestFrame = () => {
        if (!seekFrame) {
          seekFrame = window.requestAnimationFrame(applyLatestFrame);
        }
      };

      const handleSeeked = () => {
        seekInProgress = false;
        if (Math.abs(video.currentTime - targetTime) >= frameThreshold) {
          requestLatestFrame();
        }
      };

      video.addEventListener("seeked", handleSeeked);

      ScrollTrigger.create({
        trigger: scrollRef.current,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          targetTime = progress * duration;
          requestLatestFrame();

          const percent = Math.round(progress * 100);
          progressRef.current?.style.setProperty("--progress", progress);
          if (progressTextRef.current) {
            progressTextRef.current.textContent = String(percent).padStart(2, "0");
          }
        },
      });

      cleanupSeek = () => {
        video.removeEventListener("seeked", handleSeeked);
        window.cancelAnimationFrame(seekFrame);
      };
    }, scrollRef);

    ScrollTrigger.refresh();
    return () => {
      cleanupSeek();
      context.revert();
    };
  }, [videoState, isReducedMotion]);

  const handleMetadata = () => {
    const video = videoRef.current;
    if (
      !video ||
      hasInitializedVideoRef.current ||
      !Number.isFinite(video.duration) ||
      video.duration <= 0
    ) {
      return;
    }

    hasInitializedVideoRef.current = true;
    video.pause();
    video.currentTime = 0;
    setVideoState("ready");
  };

  return (
    <section
      id="vykresy"
      ref={sectionRef}
      className="drawings"
      aria-label="Projektová dokumentácia"
    >
      <header className="drawings__mobile-copy">
        <p className="section-kicker">Projektová dokumentácia / 03</p>
        <h2>Každý detail presne zakreslený a vysvetlený.</h2>
      </header>

      <div ref={scrollRef} className="drawings__scroll">
        <div className="drawings__scene">
          <div className="drawings__video-pane">
            <video
              ref={videoRef}
              className="drawings__video"
              src={videoSource}
              poster={DRAWINGS_STORY.poster}
              preload={shouldPreload ? "auto" : "metadata"}
              muted
              playsInline
              disablePictureInPicture
              onLoadedMetadata={handleMetadata}
              onLoadedData={handleMetadata}
              onError={() => setVideoState("error")}
              aria-label={DRAWINGS_STORY.ariaLabel}
            />

            <div ref={progressRef} className="progress drawings__progress" aria-hidden="true">
              <span ref={progressTextRef}>00</span>
              <div className="progress__track">
                <i />
              </div>
              <span>100</span>
            </div>

            {videoState === "loading" && (
              <div className="status" role="status">
                <span className="status__line" />
                <span>Pripravujem výkresy</span>
              </div>
            )}

            {videoState === "error" && (
              <div className="status status--error" role="alert">
                <strong>Video sa nepodarilo načítať.</strong>
                <span>Skontrolujte pripojenie a obnovte stránku.</span>
              </div>
            )}
          </div>

          <div className="drawings__desktop-copy">
            <p className="section-kicker">Projektová dokumentácia / 03</p>
            <h2>Každý detail presne zakreslený a vysvetlený.</h2>
            <div className="scroll-cue" aria-hidden="true">
              <span>Posúvajte</span>
              <svg viewBox="0 0 16 22">
                <path d="M8 1v18m0 0 6-6m-6 6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="content-section services" aria-labelledby="services-title">
      <div className="section-shell">
        <header className="section-heading">
          <p className="section-kicker">Služby</p>
          <h2 id="services-title">Od návrhu po interaktívny zážitok.</h2>
        </header>

        <div className="service-grid">
          {SERVICES.map((service, index) => (
            <article className="service-card" key={service.title}>
              <div className="service-card__top">
                <span className="service-icon">
                  <ServiceIcon name={service.icon} />
                </span>
                <span className="service-number">0{index + 1}</span>
              </div>
              <div className="service-card__copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="content-section pricing" aria-labelledby="pricing-title">
      <div className="section-shell">
        <header className="pricing-heading">
          <div>
            <p className="section-kicker">Služby a cenník</p>
            <h2 id="pricing-title">
              Jasný rozsah.
              <br />
              Jasná cena.
              <br />
              Menej hádania.
            </h2>
          </div>
          <p className="pricing-intro">
            Základ je jednoduchý: najprv sa nastaví rozsah, potom návrh, potom korekcie
            a výstup. Varianty riešime iba vtedy, keď majú dôvod. Nie preto, že
            rozhodovanie je novodobá forma sebapoškodzovania.
          </p>
        </header>

        <div className="pricing-grid">
          {PRICING.map((plan) => (
            <article
              className={`price-card${plan.featured ? " price-card--featured" : ""}`}
              key={plan.tier}
            >
              <div className="price-card__heading">
                <div className="price-card__meta">
                  <p>{plan.tier}</p>
                  {plan.badge && <span>{plan.badge}</span>}
                </div>
                <h3>{plan.title}</h3>
                <p className="price-card__price">{plan.price}</p>
                <p className="price-card__note">{plan.note}</p>
              </div>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.7" r="0.8" className="instagram-icon__dot" />
    </svg>
  );
}

function InstagramSection() {
  return (
    <section className="instagram-section" aria-labelledby="instagram-title">
      <div className="instagram-shell">
        <header className="instagram-heading">
          <div>
            <p className="section-kicker">Zo štúdia / Instagram</p>
            <h2 id="instagram-title">Aktuálne na Instagrame.</h2>
          </div>
          <a
            className="instagram-profile-link"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon />
            <span>@ilumi.interior</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 16 16 4m0 0H7m9 0v9" />
            </svg>
          </a>
        </header>

        <div className="instagram-post-grid" aria-label="Posledné príspevky ILUMI INTERIOR">
          {INSTAGRAM_POSTS.map((post, index) => (
            <a
              className="instagram-post"
              href={post.url}
              target="_blank"
              rel="noreferrer"
              key={post.url}
              aria-label={`Otvoriť príspevok ${index + 1} na Instagrame`}
            >
              <img
                src={post.src}
                alt={post.alt}
                loading="lazy"
                decoding="async"
              />
              <span className="instagram-post__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="instagram-post__action" aria-hidden="true">
                Pozrieť príspevok
                <svg viewBox="0 0 20 20">
                  <path d="M4 16 16 4m0 0H7m9 0v9" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formState, setFormState] = useState("idle");
  const [formMessage, setFormMessage] = useState("");
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity() || formState === "sending") return;

    if (!accessKey) {
      setFormState("error");
      setFormMessage("Formulár ešte nie je pripojený k cieľovému e-mailu.");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    const formData = new FormData(form);

    formData.append("access_key", accessKey);
    formData.append("subject", "Nový dopyt z webu ILUMI INTERIOR");
    formData.append("from_name", "ILUMI INTERIOR");

    setFormState("sending");
    setFormMessage("Odosielam váš projekt…");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(response.status === 429 ? "rate-limit" : "submission-failed");
      }

      form.reset();
      setFormState("success");
      setFormMessage("Ďakujeme. Váš projekt bol odoslaný. Ozveme sa s ďalším postupom.");
    } catch (error) {
      const isRateLimit = error.message === "rate-limit";
      const isOffline = !navigator.onLine || error.name === "AbortError";

      setFormState("error");
      setFormMessage(
        isRateLimit
          ? "Formulár prijal priveľa požiadaviek. Skúste to, prosím, o chvíľu."
          : isOffline
            ? "Odoslanie sa nepodarilo. Skontrolujte pripojenie a skúste to znova."
            : "Správu sa nepodarilo odoslať. Vaše údaje zostali vo formulári — skúste to znova.",
      );
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <section id="kontakt" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-shell">
        <header className="contact-heading">
          <p className="section-kicker">Kontakt / 05</p>
          <h2 id="contact-title">Poďme navrhnúť váš priestor.</h2>
          <p>
            Stačí základ. Typ priestoru, približná plocha a pár viet o tom, čo
            potrebujete vyriešiť.
          </p>
        </header>

        <div className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              className="contact-form__botcheck"
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="contact-form__grid">
              <label className="form-field">
                <span>Meno <small>nepovinné</small></span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength="80"
                  placeholder="Vaše meno"
                />
              </label>

              <label className="form-field">
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength="160"
                  placeholder="vas@email.sk"
                  required
                />
              </label>

              <label className="form-field">
                <span>Telefón <small>nepovinné</small></span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength="40"
                  placeholder="+421"
                />
              </label>

              <label className="form-field">
                <span>Typ projektu</span>
                <select name="project_type" defaultValue="" required>
                  <option value="" disabled>
                    Vyberte typ priestoru
                  </option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field form-field--area">
                <span>Približná plocha <small>nepovinné</small></span>
                <span className="form-field__unit">
                  <input
                    type="number"
                    name="area"
                    inputMode="decimal"
                    min="1"
                    max="10000"
                    step="1"
                    placeholder="85"
                  />
                  <i aria-hidden="true">m²</i>
                </span>
              </label>

              <label className="form-field form-field--message">
                <span>Čo potrebujete vyriešiť?</span>
                <textarea
                  name="message"
                  minLength="10"
                  maxLength="2000"
                  rows="5"
                  placeholder="Napíšte nám stručne o priestore, stave projektu a vašej predstave."
                  required
                />
              </label>
            </div>

            <div className="contact-form__footer">
              <p className="contact-form__privacy">
                Odoslaním formulára beriete na vedomie, že údaje použijeme iba
                na vybavenie vášho dopytu.{" "}
                <a href="#ochrana-osobnych-udajov">Ako chránime vaše údaje</a>
              </p>

              <button
                className="contact-submit"
                type="submit"
                disabled={formState === "sending"}
              >
                <span>
                  {formState === "sending" ? "Odosielam projekt" : "Odoslať projekt"}
                </span>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M3 10h13m0 0-5-5m5 5-5 5" />
                </svg>
              </button>
            </div>

            <p
              className={`contact-form__status contact-form__status--${formState}`}
              role={formState === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {formMessage}
            </p>
          </form>

          <details id="ochrana-osobnych-udajov" className="privacy-details">
            <summary>Ochrana osobných údajov</summary>
            <div>
              <p>
                ILUMI INTERIOR použije údaje z formulára iba na vybavenie vášho
                dopytu a prípravu ponuky. Právnym základom sú kroky pred
                uzatvorením zmluvy.
              </p>
              <p>
                Ak spolupráca nevznikne, údaje vymažeme najneskôr do 6 mesiacov,
                pokiaľ ich nemusíme uchovať dlhšie podľa zákona. Technické
                odoslanie formulára zabezpečuje Web3Forms.
              </p>
              <p>
                Môžete požiadať o prístup, opravu alebo vymazanie svojich údajov
                a máte právo podať sťažnosť Úradu na ochranu osobných údajov SR.
                Do správy, prosím, neuvádzajte citlivé osobné údaje.
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

function App() {
  const rootRef = useRef(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setIsReducedMotion(reducedMotion.matches);

    updatePreference();
    reducedMotion.addEventListener("change", updatePreference);
    return () => reducedMotion.removeEventListener("change", updatePreference);
  }, []);

  useLayoutEffect(() => {
    if (isReducedMotion || !window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.85,
    });
    const updateScroll = (time) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(updateScroll);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateScroll);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [isReducedMotion]);

  return (
    <main ref={rootRef} className={isReducedMotion ? "reduced-motion" : ""}>
      <ScrollStory story={VIDEO_STORIES[0]} isReducedMotion={isReducedMotion} />
      <ServicesSection />
      <ScrollStory story={VIDEO_STORIES[1]} isReducedMotion={isReducedMotion} />
      <DrawingsStory isReducedMotion={isReducedMotion} />
      <PricingSection />
      <InstagramSection />
      <ContactSection />

      <footer className="site-footer">
        <img src="/brand/ilumi-logo-white.png" alt="ILUMI INTERIOR" />
        <div className="site-footer__copy">
          <a href="#kontakt">Kontakt</a>
          <p>Interiérový dizajn · vizualizácie · interaktívne prehliadky</p>
        </div>
      </footer>
    </main>
  );
}

export default App;
