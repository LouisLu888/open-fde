// Runs before the static assets: one canonical origin (https://open-fde.ai), permanent
// trailing-slash redirects, security headers, and long caching for fingerprinted files.
const ORIGIN_HOST='open-fde.ai';
const securityHeaders={
 'Strict-Transport-Security':'max-age=31536000; includeSubDomains',
 'X-Content-Type-Options':'nosniff',
 'Referrer-Policy':'strict-origin-when-cross-origin',
 'X-Frame-Options':'SAMEORIGIN',
 'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()',
};

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.protocol==='http:'||url.hostname==='www.'+ORIGIN_HOST){
   url.protocol='https:';url.hostname=ORIGIN_HOST;url.port='';
   return Response.redirect(url.toString(),301);
  }
  // /learn -> /learn/ with a permanent redirect (the asset server would answer 307).
  if(!url.pathname.endsWith('/')&&!/\.[a-z0-9]+$/i.test(url.pathname)){
   const directory=new URL(url);directory.pathname+='/';
   const probe=await env.ASSETS.fetch(new Request(directory,{method:'HEAD'}));
   if(probe.status===200)return Response.redirect(directory.toString(),301);
  }
  const response=await env.ASSETS.fetch(request);
  const headers=new Headers(response.headers);
  for(const [name,value] of Object.entries(securityHeaders))headers.set(name,value);
  if(url.pathname.startsWith('/assets/')||url.pathname.startsWith('/og/'))headers.set('Cache-Control','public, max-age=31536000, immutable');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
 },
};
