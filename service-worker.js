const VERSION='4.1.0-nocturne-scenes-v2';
const STATIC_CACHE=`magic-rpg-static-${VERSION}`;
const RUNTIME_CACHE=`magic-rpg-runtime-${VERSION}`;

const CORE_ASSETS=[
  './','./index.html',
  './css/app.css','./css/design-system-v1.css','./css/mobile-layout-v1.1.css','./css/core-screens-v1.css',
  './css/investigation-ui-v1.css','./css/battle-ui-v1.css','./css/alchemy-ui-v1.css',
  './css/narrative-choice-ui-v1.css','./css/rooms-exploration-ui-v1.css',
  './css/rc-qa-fixes-v1.css','./css/ui-ux-stability-v1.css','./css/nocturne-ritual-v1.css','./css/nocturne-scenes-v2.css',
  './js/app.js','./js/hotfix-v2.1.js','./js/mobile-layout-v1.1.js','./js/core-screens-v1.js',
  './js/investigation-ui-v1.js','./js/battle-ui-v1.js','./js/alchemy-ui-v1.js',
  './js/narrative-choice-ui-v1.js','./js/rooms-exploration-ui-v1.js',
  './js/rc-qa-fixes-v1.js','./js/nocturne-ritual-v1.js','./js/nocturne-scenes-v2.js',
  './tests/ui-audit-bootstrap.js','./tests/ui-ux-audit.js',
  './manifest.webmanifest','./assets/icons/icon-512.png','./assets/icons/icon-192.png',
  './assets/art-v3/intro-hero.webp','./assets/art-v3/ritual-battle.webp','./assets/art-v3/alchemy-lab.webp',
  './assets/art-v3/neighbor-yard.webp','./assets/art-v3/morven.webp','./assets/art-v3/liora.webp',
  './assets/art-v3/celeste.webp','./assets/art-v3/nika.webp',
  './assets/nocturne/hero-male.webp','./assets/nocturne/hero-female.webp',
  './assets/nocturne/spell-telekinesis.webp','./assets/nocturne/spell-shield.webp',
  './assets/nocturne/spell-search.webp','./assets/nocturne/spell-banish.webp',
  './assets/nocturne/main-house.webp','./assets/nocturne/occult-study.webp',
  './assets/nocturne/memory-apartment.webp','./assets/nocturne/memory-pact.webp',
  './assets/nocturne/bus-stop-flowers.webp','./assets/nocturne/first-light-square.webp',
  './assets/nocturne/memory-warehouse.webp','./assets/nocturne/mirror-sediment.webp'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(STATIC_CACHE)
    .then(cache=>Promise.allSettled(CORE_ASSETS.map(asset=>cache.add(asset))))
    .then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>![STATIC_CACHE,RUNTIME_CACHE].includes(key)).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim()));
});
async function networkFirst(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok){
      const cache=await caches.open(RUNTIME_CACHE);
      await cache.put(request,response.clone());
    }
    return response;
  }catch(error){
    const cached=await caches.match(request);
    if(cached)return cached;
    if(request.mode==='navigate')return caches.match('./index.html');
    throw error;
  }
}
async function staleWhileRevalidate(request){
  const cached=await caches.match(request);
  const update=fetch(request).then(async response=>{
    if(response&&response.ok){
      const cache=await caches.open(RUNTIME_CACHE);
      await cache.put(request,response.clone());
    }
    return response;
  }).catch(()=>null);
  return cached||update;
}
self.addEventListener('fetch',event=>{
  const {request}=event;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate')return event.respondWith(networkFirst(request));
  if(['style','script','image','font','manifest'].includes(request.destination))return event.respondWith(staleWhileRevalidate(request));
  event.respondWith(networkFirst(request));
});
