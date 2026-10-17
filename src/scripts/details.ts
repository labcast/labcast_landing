import { saveForm } from './forms';
const form = document.querySelector<HTMLFormElement>('[data-form="details"]');
if (form) {
  const email = form.querySelector<HTMLInputElement>('[name="email"]')!;
  const error = document.querySelector<HTMLElement>('#details-error')!;
  const button = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const label = button.querySelector<HTMLElement>('[data-submit-label]')!;
  let busy = false;
  try {
    const raw = sessionStorage.getItem('labcast-signup');
    sessionStorage.removeItem('labcast-signup');
    if (raw) {
      const receipt: unknown = JSON.parse(raw);
      if (
        receipt &&
        typeof receipt === 'object' &&
        'at' in receipt &&
        typeof receipt.at === 'number' &&
        Date.now() - receipt.at < 15 * 60 * 1000 &&
        Date.now() >= receipt.at &&
        'email' in receipt &&
        typeof receipt.email === 'string'
      ) {
        email.value = receipt.email;
        document.querySelector<HTMLElement>(
          '[data-thanks-title]',
        )!.textContent = 'You’re on the list.';
        document.querySelector<HTMLElement>('[data-thanks-note]')!.textContent =
          'We’ll be in touch with Labcast updates and when early access opens. Want to help us understand your next show?';
        if ('audience' in receipt && typeof receipt.audience === 'string') {
          form
            .querySelectorAll<HTMLInputElement>('[name="role[]"]')
            .forEach(
              (input) => (input.checked = input.value === receipt.audience),
            );
        }
      }
    }
  } catch {
    /* Storage is optional. The visitor can supply their email. */
  }
  email.addEventListener('invalid', () => {
    error.textContent = 'Enter the email you used for the waitlist.';
    email.setAttribute('aria-invalid', 'true');
  });
  email.addEventListener('input', () => {
    error.textContent = '';
    email.removeAttribute('aria-invalid');
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    const requestedContact = (
      form.elements.namedItem('access-contact') as HTMLInputElement
    ).checked;
    busy = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = 'Saving…';
    error.textContent = '';
    try {
      const result = await saveForm(form);
      if (result === 'preview') {
        error.textContent =
          'This preview cannot save details yet. Your waitlist signup, if submitted earlier, is unchanged.';
        return;
      }
      form.hidden = true;
      const success = document.querySelector<HTMLElement>(
        '[data-details-success]',
      )!;
      // Early-access invitations only follow explicit permission.
      success.textContent = requestedContact
        ? '✓ Thanks. Your details have been received. We’ll get in touch if a early access is available.'
        : '✓ Thanks. Your details have been received. They’ll help us understand what people want to broadcast.';
      success.hidden = false;
      success.focus({ preventScroll: true });
    } catch {
      error.textContent =
        'We couldn’t confirm these details. Please try again. Your earlier waitlist signup is unchanged.';
    } finally {
      busy = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = 'Save my details';
    }
  });
}
const share = document.querySelector<HTMLButtonElement>('[data-share]');
share?.addEventListener('click', async () => {
  const status = document.querySelector<HTMLElement>('[data-share-status]')!;
  try {
    await navigator.clipboard.writeText('https://labcast.ai');
    status.textContent = 'Copied. Send it to your crew.';
  } catch {
    status.textContent = 'Copy the link below to share Labcast.';
  }
});
export {};
