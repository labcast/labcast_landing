import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector<HTMLElement>('.hero');
if (hero) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from(
      hero.querySelectorAll(
        '.hero-copy > .eyebrow, .hero-line, .hero-highlight, .hero-description, .waitlist',
      ),
      {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      },
    );
    gsap.fromTo(
      hero.querySelector('.hero-art img'),
      { scale: 1.035 },
      { scale: 1, duration: 1.6, ease: 'power2.out' },
    );
    gsap.to(hero.querySelector('.hero-art'), {
      y: 65,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  });
}
