/** Netlify must register the form before a successful HTTP response is meaningful. */
export async function saveForm(
  form: HTMLFormElement,
): Promise<'preview' | 'accepted'> {
  if (form.hasAttribute('data-netlify')) return 'preview';
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => body.append(key, String(value)));
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Submission rejected');
    return 'accepted';
  } finally {
    clearTimeout(timeout);
  }
}
