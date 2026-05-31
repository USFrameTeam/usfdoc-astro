import { defineMiddleware } from 'astro:middleware';

const siteUrl = 'https://usfdoctest.zuyst.top';

const versionConfig: Record<string, { prefix: string; image: string }> = {
  v2: { prefix: 'USF V2 - ', image: '/V2bg.png' },
  v1: { prefix: 'USF V1 - ', image: '' },
  neo: { prefix: 'NeoUSF - ', image: '' },
};

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  const { pathname } = context.url;
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) return response;

  let version = '';
  if (pathname.startsWith('/v2/')) version = 'v2';
  else if (pathname.startsWith('/v1/')) version = 'v1';
  else if (pathname.startsWith('/neo/')) version = 'neo';

  if (!version) return response;

  const config = versionConfig[version];
  if (!config) return response;

  const html = await response.text();

  let modified = html.replace(
    /<meta property="og:title" content="([^"]*)"/,
    `<meta property="og:title" content="${config.prefix}$1"`
  );

  if (config.image) {
    const imageUrl = siteUrl + config.image;
    modified = modified.replace(
      /<meta name="twitter:card" content="summary_large_image"/,
      `<meta name="twitter:card" content="summary_large_image"><meta property="og:image" content="${imageUrl}"><meta name="twitter:image" content="${imageUrl}"`
    );

    if (!modified.includes('og:image')) {
      modified = modified.replace(
        '</head>',
        `<meta property="og:image" content="${imageUrl}"><meta name="twitter:image" content="${imageUrl}"><meta name="twitter:card" content="summary_large_image"></head>`
      );
    }
  }

  return new Response(modified, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
