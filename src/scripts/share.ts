// A plain campaign label lets the signup export count shared visits.
// There are no per-person referral identifiers.
export const shareUrl = 'https://labcast.ai/?utm_source=share';

export function bindShare(button: HTMLButtonElement, status: HTMLElement) {
  button.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Labcast',
          text: 'Your phones. One big show. Join the Labcast waitlist.',
          url: shareUrl,
        });
        status.textContent = 'Thanks for sharing Labcast.';
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      status.textContent = 'Link copied. Send it to your crew.';
    } catch {
      status.textContent = `Copy this link to share Labcast: ${shareUrl}`;
    }
  });
}
