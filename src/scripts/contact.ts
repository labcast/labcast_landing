import { saveForm } from './forms';
const form = document.querySelector<HTMLFormElement>('[data-form="waitlist"]');
if (form) {
  const email = form.querySelector<HTMLInputElement>('[name="email"]')!;
  const error = document.querySelector<HTMLElement>('#signup-error')!;
  const button = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  )!;
  const label = button.querySelector<HTMLElement>('[data-submit-label]')!;
  let busy = false;
  const params = new URLSearchParams(location.search);
  // Only named campaign identifiers are collected; never store arbitrary URLs.
  const attribution = (key: string) =>
    (params.get(key) ?? '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
  (form.elements.namedItem('source') as HTMLInputElement).value =
    attribution('utm_source') || 'website';
  (form.elements.namedItem('campaign') as HTMLInputElement).value =
    attribution('utm_campaign');
  document
    .querySelectorAll<HTMLAnchorElement>('[data-audience]')
    .forEach((link) =>
      link.addEventListener('click', () => {
        (form.elements.namedItem('audience') as HTMLInputElement).value =
          link.dataset.audience ?? '';
        if (!form.hidden) email.focus({ preventScroll: true });
      }),
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
    const submittedAudience = (
      form.elements.namedItem('audience') as HTMLInputElement
    ).value;
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
      const success = document.querySelector<HTMLElement>(
        '[data-signup-success]',
      )!;
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
}
export {};
