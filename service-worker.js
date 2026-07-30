const VERSION='2.6.0-battle-ui-v1';
const STATIC_CACHE=`magic-rpg-static-${VERSION}`;
const RUNTIME_CACHE=`magic-rpg-runtime-${VERSION}`;

const CORE_ASSETS=[
  './','./index.html','./css/app.css','./css/design-system-v1.css','./css/mobile-layout-v1.1.css','./css/core-screens-v1.css','./css/investigation-ui-v1.css','./css/battle-ui-v1.css',
  './js/app.js','./js/hotfix-v2.1.js','./js/mobile-layout-v1.1.js','./js/core-screens-v1.js','./js/investigation-ui-v1.js','./js/battle-ui-v1.js','./manifest.webmanifest',
  './design-system-v1.html','./investigation-ui-v1.html','./battle-ui-v1.html','./assets/icons/icon-512.png','./assets/icons/icon-192.png',
  './assets/characters/celeste.svg','./assets/characters/nika.svg','./assets/characters/eren.svg',
  './assets/characters/liora.svg','./assets/characters/morven.svg','./assets/backgrounds/greenhouse.svg',
  './assets/backgrounds/c2home.svg','./assets/backgrounds/yard.svg','./assets/backgrounds/lab.svg',
  './assets/backgrounds/c4hero.svg','./assets/backgrounds/home.svg','./assets/backgrounds/ritualist.svg',
  './assets/backgrounds/hunger.svg','./assets/backgrounds/warehouse.svg','./assets/backgrounds/root.svg',
  './assets/backgrounds/shop.svg','./assets/backgrounds/apartment.svg','./assets/backgrounds/roof.svg',
  './assets/art-v3/intro-hero.webp','./assets/art-v3/parents-home.webp','./assets/art-v3/alchemy-lab.webp',
  './assets/art-v3/neighbor-yard.webp','./assets/art-v3/ritual-battle.webp','./assets/art-v3/morven.webp',
  './assets/art-v3/liora.webp','./assets/art-v3/celeste.webp','./assets/art-v3/nika.webp'
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
