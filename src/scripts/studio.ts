import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './scroll';
const story = document.querySelector<HTMLElement>('[data-story]');
if (story) {
  const preload = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    story.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
      image.loading = 'eager';
    });
    preload.disconnect();
  });
  preload.observe(story);
  const media = gsap.matchMedia();
  const scenes = [...story.querySelectorAll<HTMLElement>('[data-scene]')];
  media.add(
    '(prefers-reduced-motion: no-preference) and (min-height: 700px), (prefers-reduced-motion: no-preference) and (max-width: 700px) and (orientation: portrait)',
    () => {
      story.classList.add('is-enhanced');
      const sticky = story.querySelector<HTMLElement>('.story-sticky')!;
      const colors = [
        '#f4e8d5',
        '#edf1d8',
        '#e9eafa',
        '#f6dfd3',
        '#edf1d8',
        '#f4e8d5',
        '#e9eafa',
      ];
      // Solid backdrops keep the page from showing through the crossfade.
      // These initial sets also restore cleanly on revert.
      gsap.set(scenes, {
        opacity: 1,
        visibility: 'hidden',
        clipPath: 'none',
        zIndex: 0,
        backgroundColor: 'transparent',
      });
      gsap.set(sticky, { backgroundColor: colors[0] });
      const copies = scenes.map((scene) => scene.querySelector('.scene-copy')!);
      const artwork = scenes.map((scene) => scene.querySelector('.scene-art')!);
      const broadcasts = [
        ...story.querySelectorAll<HTMLElement>('[data-broadcast]'),
      ];
      const broadcastForScene = [0, 1, 1, 1, 1, 2, 3];
      let broadcast = -1;
      let broadcastFade: gsap.core.Tween | undefined;
      gsap.set(broadcasts, { autoAlpha: 0 });
      const showBroadcast = (next: number) => {
        if (next === broadcast) return;
        broadcastFade?.kill();
        // Keep the outgoing picture completely opaque under the incoming one.
        // The action image is the same DOM node across four feature chapters.
        const previous = broadcast;
        gsap.set(broadcasts, { autoAlpha: 0, zIndex: 0 });
        if (previous >= 0) gsap.set(broadcasts[previous], { autoAlpha: 1 });
        broadcast = next;
        gsap.set(broadcasts[next], { visibility: 'visible', zIndex: 1 });
        broadcastFade = gsap.to(broadcasts[next], {
          opacity: 1,
          duration: previous < 0 ? 0 : 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            if (previous >= 0) gsap.set(broadcasts[previous], { autoAlpha: 0 });
          },
        });
      };
      const features = scenes.map((scene, index) => {
        const timeline = gsap.timeline({
          paused: true,
          defaults: { ease: 'power2.out' },
        });
        const find = (selector: string) => scene.querySelector(selector);
        // Feature actions finish on their own clock once a chapter is entered.
        // A stopped wheel or touch gesture cannot leave labels half faded.
        switch (index) {
          case 0:
            timeline.fromTo(
              find('.crew-tag'),
              { y: 18, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.4 },
              0.15,
            );
            break;
          case 1:
            timeline
              .fromTo(
                find('.production-card'),
                { x: 30, y: 20, autoAlpha: 0 },
                { x: 0, y: 0, autoAlpha: 1, duration: 0.45 },
                0.2,
              )
              .fromTo(
                find('.shot-guide'),
                { scale: 0.75 },
                { scale: 1, duration: 0.5 },
                0.15,
              );
            break;
          case 2:
            timeline.fromTo(
              find('.angle-views'),
              { y: 30, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.4 },
              0.15,
            );
            break;
          case 3:
            timeline
              .fromTo(
                find('.sheet-back'),
                { rotation: 0 },
                { rotation: 7, duration: 0.5 },
                0.15,
              )
              .fromTo(
                find('.sheet-front'),
                { rotation: 0 },
                { rotation: -7, duration: 0.5 },
                0.15,
              )
              .fromTo(
                find('.replay-loop'),
                { rotation: 45, autoAlpha: 0 },
                { rotation: -20, autoAlpha: 1, duration: 0.5 },
                0.15,
              );
            break;
          case 4:
            timeline
              .fromTo(
                find('.score'),
                { y: -15, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.35 },
                0.1,
              )
              .fromTo(
                find('.show-title'),
                { xPercent: -25, autoAlpha: 0 },
                { xPercent: 0, autoAlpha: 1, duration: 0.45 },
                0.2,
              )
              .fromTo(
                find('.commentary'),
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.4 },
                0.3,
              )
              .fromTo(
                scene.querySelectorAll('.voice-wave i'),
                { scaleY: 0.35 },
                { scaleY: 1, stagger: 0.008, duration: 0.25 },
                0.3,
              );
            break;
          case 5:
            timeline
              .fromTo(
                find('.choice-cursor'),
                { xPercent: -160, yPercent: 40 },
                { xPercent: 0, yPercent: 0, duration: 0.55 },
                0.1,
              )
              .fromTo(
                find('.director-choice'),
                { y: -15, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.4 },
                0.2,
              );
            break;
        }
        return timeline;
      });
      let active = -1;
      let transition: gsap.core.Timeline | undefined;
      const showScene = (next: number) => {
        if (next === active) return;
        const previous = active;
        transition?.kill();
        if (previous >= 0) features[previous].progress(1).pause();
        // Settle an interrupted fade before beginning another, including rapid
        // reversals and jumps past several chapters.
        gsap.set(scenes, {
          opacity: 1,
          visibility: 'hidden',
          clipPath: 'none',
          zIndex: 0,
        });
        gsap.set([...copies, ...artwork], { opacity: 1 });
        showBroadcast(broadcastForScene[next]);
        active = next;
        story.dataset.activeScene = String(next);
        scenes.forEach((scene, index) => {
          scene.setAttribute('aria-hidden', String(index !== next));
          scene.inert = index !== next;
        });
        gsap.set(scenes[next], { visibility: 'visible', zIndex: 2 });
        features[next].restart();
        if (previous < 0) {
          gsap.set(sticky, { backgroundColor: colors[next] });
          return;
        }
        gsap.set(scenes[previous], { visibility: 'visible', zIndex: 1 });
        transition = gsap.timeline({
          onComplete: () => {
            gsap.set(scenes[previous], { visibility: 'hidden' });
            gsap.set([...copies, ...artwork], { opacity: 1 });
          },
        });
        // Copy fades out before its replacement arrives, so headlines never
        // ghost over one another. The independent broadcast layer stays put.
        transition
          .to(copies[previous], { opacity: 0, duration: 0.14 }, 0)
          .fromTo(
            copies[next],
            { opacity: 0 },
            { opacity: 1, duration: 0.24, ease: 'power2.out' },
            0.14,
          )
          .to(artwork[previous], { opacity: 0, duration: 0.28 }, 0)
          .fromTo(
            artwork[next],
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: 'power2.inOut' },
            0,
          )
          .to(
            sticky,
            { backgroundColor: colors[next], duration: 0.4, ease: 'none' },
            0,
          );
      };
      showScene(0);
      const trigger = ScrollTrigger.create({
        trigger: sticky,
        start: () =>
          `top ${document.querySelector('.header')!.getBoundingClientRect().height}px`,
        end: () => `+=${Math.round(innerHeight * scenes.length)}`,
        pin: sticky,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) =>
          showScene(
            Math.min(
              scenes.length - 1,
              Math.floor(self.progress * scenes.length),
            ),
          ),
      });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return () => {
        broadcastFade?.kill();
        transition?.kill();
        trigger.kill();
        story.classList.remove('is-enhanced');
        delete story.dataset.activeScene;
        scenes.forEach((scene) => {
          scene.removeAttribute('aria-hidden');
          scene.inert = false;
        });
      };
    },
  );
}
