import { saveForm } from './forms';
import { bindShare } from './share';

const params = new URLSearchParams(location.search);
// Only named campaign identifiers are collected; never store arbitrary URLs.
const attribution = (key: string) =>
  (params.get(key) ?? '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
const instances = [
  ...document.querySelectorAll<HTMLElement>('[data-waitlist]'),
].flatMap((root) => {
  const form = root.querySelector<HTMLFormElement>('[data-form="waitlist"]');
  return form ? [{ root, form }] : [];
});
const field = (form: HTMLFormElement, name: string) =>
  form.elements.namedItem(name) as HTMLInputElement;

instances.forEach(({ root, form }) => {
  const email = field(form, 'email');
  const error = form.querySelector<HTMLElement>('[data-error]')!;
  const button = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  )!;
  const label = button.querySelector<HTMLElement>('[data-submit-label]')!;
  const success = root.querySelector<HTMLElement>('[data-signup-success]')!;
  let busy = false;
  const source = field(form, 'source');
  source.value = attribution('utm_source') || source.value;
  field(form, 'campaign').value = attribution('utm_campaign');
  bindShare(
    success.querySelector<HTMLButtonElement>('[data-share]')!,
    success.querySelector<HTMLElement>('[data-share-status]')!,
  );
  email.addEventListener('invalid', () => {
    error.textContent = 'Enter a valid email address so we can keep in touch.';
    email.setAttribute('aria-invalid', 'true');
  });
  email.addEventListener('input', () => {
    email.removeAttribute('aria-invalid');
    error.textContent = '';
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!form.reportValidity()) return;
    const submittedEmail = email.value.trim();
    const submittedAudience = field(form, 'audience').value;
    busy = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = 'Joining…';
    error.textContent = '';
    try {
      const result = await saveForm(form);
      if (result === 'preview') {
        error.textContent =
          'This preview cannot save signups yet. Please join at labcast.ai once the waitlist opens.';
        return;
      }
      // A short-lived handoff only. Never send the address through a URL.
      try {
        sessionStorage.setItem(
          'labcast-signup',
          JSON.stringify({
            email: submittedEmail,
            audience: submittedAudience,
            at: Date.now(),
          }),
        );
      } catch {
        /* Optional details can ask for the email again. */
      }
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
    } catch {
      error.textContent =
        'We couldn’t confirm your signup. Your email is still here—please try again, or contact hello@labcast.ai.';
    } finally {
      busy = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = 'Join the waitlist';
    }
  });
});

// Audience and join links lead to the hero form and put the cursor in it.
const hero = instances.find(({ root }) => root.closest('#waitlist'))?.form;
if (hero) {
  const email = field(hero, 'email');
  document
    .querySelectorAll<HTMLAnchorElement>('a[href$="#waitlist"]')
    .forEach((link) =>
      link.addEventListener('click', () => {
        if (link.dataset.audience)
          field(hero, 'audience').value = link.dataset.audience;
        if (!hero.hidden) email.focus({ preventScroll: true });
      }),
    );
}
export {};
