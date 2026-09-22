/**
 * Extracts a YouTube video ID from various YouTube URL formats or returns the ID if already clean.
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already an 11-char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // If iframe embed snippet was pasted, extract src
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/);
  const target = iframeMatch ? iframeMatch[1] : trimmed;

  // Try standard URL parsing first
  try {
    const urlStr = target.startsWith('http://') || target.startsWith('https://')
      ? target
      : `https://${target}`;
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.includes('youtube.com') || hostname.includes('youtube-nocookie.com')) {
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      }
      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      if (pathSegments.length >= 2 && ['embed', 'v', 'shorts', 'live'].includes(pathSegments[0])) {
        const id = pathSegments[1];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }
    } else if (hostname === 'youtu.be' || hostname.endsWith('.youtu.be')) {
      const id = parsed.pathname.replace(/^\//, '').split('/')[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // Ignore URL parse error and fall back to regex
  }

  // Fallback regex patterns for YouTube variations
  const patterns = [
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?.*v=))([\w-]{11})/,
    /^([\w-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = target.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Returns an embed URL for YouTube.
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
}

/**
 * Returns thumbnail image URL for a YouTube video.
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
