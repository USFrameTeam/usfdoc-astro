import { defineMiddleware } from 'astro:middleware';

const versionConfig: Record<string, { prefix: string; image: string }> = {
  'v2/': { prefix: 'USF V2 - ', image: '/V2bg.png' },
  'v1/': { prefix: 'USF V1 - ', image: '' },
  'neo/': { prefix: 'NeoUSF - ', image: '' },
};

const siteUrl = 'https://docsdev.usframeteam.top';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  const { pathname } = context.url;
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) return response;

  let config = null;
  for (const [prefix, cfg] of Object.entries(versionConfig)) {
    if (pathname.startsWith('/' + prefix)) {
      config = cfg;
      break;
    }
  }
  if (!config) return response;

  const html = await response.text();
  let modified = html;

  modified = modified.replace(
    /<title>([^|]*)\|([^<]*)<\/title>/,
    `<title>${config.prefix}$1|$2</title>`
  );

  modified = modified.replace(
    /<meta\s+content="([^"]*)"\s+property=og:title\s*\/>/,
    `<meta content="${config.prefix}$1" property=og:title />`
  );

  if (config.image) {
    const imageUrl = siteUrl + config.image;
    modified = modified.replace(
      '</head>',
      `<meta property="og:image" content="${imageUrl}"><meta name="twitter:image" content="${imageUrl}"></head>`
    );
  }

  return new Response(modified, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
