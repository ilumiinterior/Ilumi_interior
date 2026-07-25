import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SOURCES = {
  mobile: "/media/ilumi-mobile.mp4",
  desktop: "/media/ilumi-1440.mp4",
};

function selectVideoSource() {
  if (typeof window === "undefined") return VIDEO_SOURCES.desktop;

  const connection = navigator.connection;
  const saveData = Boolean(connection?.saveData);
  const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;

  if (saveData || compact) return VIDEO_SOURCES.mobile;
  return VIDEO_SOURCES.desktop;
}

function App() {
  const rootRef = useRef(null);
  const storyRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const progressTextRef = useRef(null);
  const introRef = useRef(null);
  const outroRef = useRef(null);
  const hasInitializedVideoRef = useRef(false);
  const [videoState, setVideoState] = useState("loading");
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const videoSource = useMemo(selectVideoSource, []);

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
    }, rootRef);

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
    <main ref={rootRef} className={isReducedMotion ? "reduced-motion" : ""}>
      <section ref={storyRef} className="story" aria-label="Animovaná prezentácia interiéru">
        <div className="scene">
          <video
            ref={videoRef}
            className="scene__video"
            src={videoSource}
            poster="/media/poster.jpg"
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            onLoadedMetadata={handleMetadata}
            onLoadedData={handleMetadata}
            onError={() => setVideoState("error")}
            aria-label="Vizualizácia návrhu kuchyne ILUMI INTERIOR"
          />

          <div className="scene__shade" aria-hidden="true" />

          <header className="topbar">
            <a className="brand" href="#zaciatok" aria-label="ILUMI INTERIOR — začiatok">
              <img src="/brand/ilumi-logo-white.png" alt="" />
            </a>
            <div className="topbar__descriptor">
              <span>Interiérový dizajn</span>
              <span>Slovensko</span>
            </div>
          </header>

          <div id="zaciatok" ref={introRef} className="intro">
            <p className="eyebrow">ILUMI INTERIOR / 01</p>
            <h1>Váš interiér...</h1>
            <div className="scroll-cue" aria-hidden="true">
              <span>Posúvajte</span>
              <svg viewBox="0 0 16 22" role="img">
                <path d="M8 1v18m0 0 6-6m-6 6-6-6" />
              </svg>
            </div>
          </div>

          <div ref={outroRef} className="outro">
            <p className="outro__title">navrhnutý do posledného detailu</p>
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

      <section className="afterword" aria-label="Koniec ukážky">
        <p>ILUMI INTERIOR</p>
        <span>Pokračovanie stránky doplníme v ďalšom kroku.</span>
      </section>
    </main>
  );
}

export default App;
