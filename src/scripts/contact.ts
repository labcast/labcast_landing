if (new URLSearchParams(window.location.search).get('submitted') === 'true') {
  const success = document.querySelector<HTMLElement>('#form-success');
  const form = document.querySelector<HTMLFormElement>('#pilot-form');
  if (success && form) {
    success.hidden = false;
    form.hidden = true;
  }
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete('submitted');
  window.history.replaceState(null, '', cleanUrl);
}

export {};
