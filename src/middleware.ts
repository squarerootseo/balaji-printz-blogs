import { defineMiddleware } from 'astro:middleware';

/**
 * Middleware to strip the /blog prefix from incoming requests.
 * 
 * When deployed behind a Cloudflare Worker Route (balajiprintz.com/blog/*),
 * the Astro app receives paths like /blog/, /blog/future-of-ai-in-web-development, etc.
 * This middleware strips the /blog prefix so Astro's router can match the correct page.
 */
export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  if (url.pathname.startsWith('/blog')) {
    // Strip /blog prefix: /blog/something → /something, /blog → /
    const newPath = url.pathname.replace(/^\/blog/, '') || '/';
    const newUrl = new URL(newPath + url.search, url.origin);

    return context.rewrite(newUrl.pathname + newUrl.search);
  }

  return next();
});
