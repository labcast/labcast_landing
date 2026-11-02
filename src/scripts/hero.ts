import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector<HTMLElement>('.hero');
if (hero) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    // Copy and the signup form render on first paint; only the artwork moves.
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
