const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#navigation');
function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
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

export {};
