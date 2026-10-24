const VERSION='lpcs-v1';
const CORE=['./','index.html','story-data.js','manifest.json','icon-192.png','icon-512.png','maskable-512.png','apple-touch-icon.png','favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==='opaque')){const copy=r.clone();caches.open(VERSION).then(c=>c.put(e.request,copy))}
      return r}).catch(()=>hit||caches.match('index.html'));
    return hit||net;
  }));
});
