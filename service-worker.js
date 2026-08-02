const VERSION='6.0.0-screen-system';
const STATIC_CACHE=`magic-rpg-static-${VERSION}`;
const RUNTIME_CACHE=`magic-rpg-runtime-${VERSION}`;

const CORE_ASSETS=[
  './','./index.html',
  './css/nocturne-game.css','./js/app.js','./js/nocturne-ui.js',
  './tests/ui-audit-bootstrap.js','./tests/ui-ux-audit.js',
  './manifest.webmanifest','./assets/icons/icon-512.png','./assets/icons/icon-192.png',
  './assets/art-v3/intro-hero.webp','./assets/art-v3/ritual-battle.webp','./assets/art-v3/alchemy-lab.webp',
  './assets/art-v3/neighbor-yard.webp','./assets/art-v3/parents-home.webp','./assets/art-v3/morven.webp','./assets/art-v3/liora.webp',
  './assets/art-v3/celeste.webp','./assets/art-v3/nika.webp',
  './assets/nocturne/hero-male.webp','./assets/nocturne/hero-female.webp',
  './assets/nocturne/spell-telekinesis.webp','./assets/nocturne/spell-shield.webp',
  './assets/nocturne/spell-search.webp','./assets/nocturne/spell-banish.webp',
  './assets/nocturne/main-house.webp','./assets/nocturne/occult-study.webp',
  './assets/nocturne/memory-apartment.webp','./assets/nocturne/memory-pact.webp',
  './assets/nocturne/bus-stop-flowers.webp','./assets/nocturne/first-light-square.webp',
  './assets/nocturne/memory-warehouse.webp','./assets/nocturne/mirror-sediment.webp',
  './assets/art-v4/first-light-rooftop.webp','./assets/art-v4/flower-shop.webp','./assets/art-v4/occult-greenhouse.webp',
  './assets/icons/ui/arrow-left.svg','./assets/icons/ui/backpack.svg','./assets/icons/ui/book-2.svg',
  './assets/icons/ui/check.svg','./assets/icons/ui/chevron-right.svg','./assets/icons/ui/clipboard-list.svg',
  './assets/icons/ui/flask.svg','./assets/icons/ui/help-circle.svg','./assets/icons/ui/home.svg',
  './assets/icons/ui/leaf.svg','./assets/icons/ui/lock.svg','./assets/icons/ui/notebook.svg',
  './assets/icons/ui/refresh.svg','./assets/icons/ui/search.svg','./assets/icons/ui/settings.svg',
  './assets/icons/ui/shield.svg','./assets/icons/ui/sparkles.svg','./assets/icons/ui/sword.svg',
  './assets/icons/ui/user-circle.svg','./assets/icons/ui/users-group.svg','./assets/icons/ui/wand.svg','./assets/icons/ui/x.svg'
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
