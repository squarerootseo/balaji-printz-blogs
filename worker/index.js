/**
 * Cloudflare Worker — Route Proxy
 * 
 * Deploy this as a separate Cloudflare Worker on your main domain.
 * Add a Worker Route: balajiprintz.com/blog/* → this worker
 * 
 * It proxies /blog/* requests to your Astro Cloudflare Pages deployment
 * while letting everything else pass through to Shopify.
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/blog')) {
      // Replace with your actual Cloudflare Pages deployment URL
      const blogUrl = new URL(request.url);
      blogUrl.hostname = 'balaji-printz-blogs.pages.dev';

      const response = await fetch(blogUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      // Return response with appropriate headers
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('X-Proxied-By', 'cloudflare-worker');
      return newResponse;
    }

    // Everything else passes through to origin (Shopify)
    return fetch(request);
  },
};
