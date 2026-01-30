import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import macbookImg from "../assets/images/homepage_macbook.png";
import iphoneImg from "../assets/images/homepage_iphone.webp";

gsap.registerPlugin(ScrollTrigger);

const Showcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
     
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.fromTo(
        imageRef.current,
        {
          scale: 0.7,
          borderRadius: "40px",
        },
        {
          scale: 1.3,
          borderRadius: "0px",
          duration: 0.4,
        }
      )
      .to(
        imageRef.current,
        {
          scale: 1.3,
          borderRadius: "0px",
          duration: 0.3,
        }
      )
      .to(
        imageRef.current,
        {
          scale: 0.7,
          borderRadius: "40px",
          duration: 0.3,
        }
      );

      tl.fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
        },
        0.3
      )
      .to(
        textRef.current,
        {
          opacity: 0,
          y: -50,
          duration: 0.2,
        },
        0.65
      );

      tl.fromTo(
        overlayRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
        },
        0.3
      )
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.2,
        },
        0.65
      );

      const header = document.querySelector('header');
      if (header) {
        gsap.set(header, { opacity: 1 });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          onEnter: () => gsap.to(header, { opacity: 0, duration: 0.3 }),
          onLeave: () => gsap.to(header, { opacity: 1, duration: 0.3 }),
          onEnterBack: () => gsap.to(header, { opacity: 0, duration: 0.3 }),
          onLeaveBack: () => gsap.to(header, { opacity: 1, duration: 0.3 }),
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-zinc-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-full"
          style={{ transformOrigin: "center center" }}
        >
          <img
            src={isMobile ? iphoneImg : macbookImg}
            alt="Starky Dashboard"
            className="w-full h-full object-cover rounded-2xl md:rounded-4xl scale-110 md:scale-100 md:object-[center_70%]"
          />
          
          <div className="scale-110 md:scale-100 absolute inset-0 bg-gradient-to-br from-zinc-950/60 via-transparent to-transparent" />
          
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/40 pointer-events-none"
            style={{ opacity: 0 }}
          />
        </div>

        <div
          ref={textRef}
          className="absolute top-12 md:top-15 left-0 right-0 md:left-auto md:right-0 flex flex-col items-start text-left lg:text-end md:items-end px-8 pr-12 md:px-16 lg:px-24 z-10 max-w-full md:max-w-[455px] md:ml-auto"
        >
          <p className="text-[.9rem] md:text-sm text-zinc-400 mb-2 md:mb-4 uppercase tracking-wider font-medium leading-[1.1]">
            Flexibilidade Total
          </p>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl xl:text-4xl font-bold text-white mb-3 md:mb-6 leading-[.8] tracking-tight"
          >
            Estude em qualquer lugar, a qualquer hora.
          </h2>
          <p 
            className="text-[1rem] md:text-base lg:text-lg text-zinc-200 leading-[1.1] max-w-full md:max-w-[600px]"
          >
            Com Starky, seu aprendizado não tem limites. Aproveite cada momento para dominar novos assuntos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
