import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Touch layouts keep the document stationary to prevent artwork bleeding
// into Safari's status bar. Its page container still uses native touch/momentum scrolling.
const page = document.querySelector<HTMLElement>('[data-scroll-root]');
const scroller =
  page && getComputedStyle(page).overflowY === 'auto' ? page : undefined;
if (scroller) ScrollTrigger.defaults({ scroller });
