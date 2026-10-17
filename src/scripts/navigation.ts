const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#navigation');
function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Open menu');
  navigation?.classList.remove('is-open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navigation?.classList.toggle('is-open', open);
});
navigation
  ?.querySelectorAll('a')
  .forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    toggle?.getAttribute('aria-expanded') === 'true'
  ) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (
    event.target instanceof Node &&
    !toggle?.contains(event.target) &&
    !navigation?.contains(event.target)
  )
    closeMenu();
});
document.addEventListener('focusin', (event) => {
  if (
    event.target instanceof Node &&
    !toggle?.contains(event.target) &&
    !navigation?.contains(event.target)
  )
    closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
export {};
