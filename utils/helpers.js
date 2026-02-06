export function isValidURL(string) {
  const trimmed = string.trim();
  const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
  return pattern.test(trimmed);
}

export function formatURL(url) {
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return 'https://' + trimmed;
  }
  return trimmed;
}

export function getSearchURL(query, engine = 'google') {
  const engines = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
  };
  const baseURL = engines[engine] || engines.google;
  return baseURL + encodeURIComponent(query.trim());
}

export function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
