const buttons = document.querySelectorAll<HTMLButtonElement>('[data-camera]');
const views = document.querySelectorAll<HTMLElement>('[data-view]');
const title = document.querySelector<HTMLElement>('[data-camera-title]');
for (const button of buttons) {
  button.addEventListener('click', () => {
    for (const candidate of buttons) {
      const selected = candidate === button;
      candidate.setAttribute('aria-pressed', String(selected));
      const state = candidate.querySelector('.camera-state');
      if (state) state.textContent = selected ? 'Selected' : 'Preview';
    }
    for (const view of views)
      view.hidden = view.dataset.view !== button.dataset.camera;
    if (title) title.textContent = button.dataset.title ?? '';
  });
}

export {};
