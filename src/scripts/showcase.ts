import { gsap } from 'gsap';

const showcase = document.querySelector<HTMLElement>('[data-showcase]');
if (showcase) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const window = showcase.querySelector<HTMLElement>('.showcase-window')!;
    const track = showcase.querySelector<HTMLElement>('.showcase-track')!;
    const groups = [
      ...showcase.querySelectorAll<HTMLElement>('.showcase-group'),
    ];
    const cards = [...showcase.querySelectorAll<HTMLElement>('.event-card')];
    showcase.classList.add('is-moving');
    window.scrollLeft = 0;
    let distance = 0;
    let centers: number[] = [];
    let inView = false;
    let hovered = false;
    let focused = false;
    const position = { x: 0 };
    const setX = gsap.quickSetter(track, 'x', 'px');
    const render = () => {
      setX(position.x);
      const center = window.clientWidth / 2;
      let closest = 0;
      centers.forEach((x, index) => {
        if (
          Math.abs(x + position.x - center) <
          Math.abs(centers[closest] + position.x - center)
        )
          closest = index;
      });
      cards.forEach((card, index) =>
        card.classList.toggle('is-featured', index === closest),
      );
    };
    const loop = gsap.fromTo(
      position,
      { x: 0 },
      {
        x: () => -distance,
        duration: 35,
        repeat: -1,
        ease: 'none',
        paused: true,
        onUpdate: render,
      },
    );
    const measure = () => {
      const progress = loop.progress();
      distance = groups[1].offsetLeft - groups[0].offsetLeft;
      centers = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
      loop.invalidate().progress(progress);
      render();
    };
    const sync = () =>
      loop.paused(hovered || focused || !inView || document.hidden);
    const enter = () => {
      hovered = true;
      sync();
    };
    const leave = () => {
      hovered = false;
      sync();
    };
    const focus = () => {
      focused = true;
      sync();
    };
    const blur = () => {
      focused = false;
      sync();
    };
    window.addEventListener('pointerenter', enter);
    window.addEventListener('pointerleave', leave);
    window.addEventListener('focus', focus);
    window.addEventListener('blur', blur);
    document.addEventListener('visibilitychange', sync);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    visibility.observe(showcase);
    const resize = new ResizeObserver(measure);
    resize.observe(window);
    measure();
    return () => {
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener('pointerenter', enter);
      window.removeEventListener('pointerleave', leave);
      window.removeEventListener('focus', focus);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', sync);
      showcase.classList.remove('is-moving');
      cards.forEach((card) => card.classList.remove('is-featured'));
      gsap.set(track, { clearProps: 'transform' });
    };
  });
}
