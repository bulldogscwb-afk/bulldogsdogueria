// Service worker mínimo — permite "instalar" o painel como app no celular
// e guarda uma cópia da casca do app para abrir mais rápido / offline.
// A parte que importa (dados de motoboys, caixa, colaboradores etc.) sempre
// vem direto do Supabase, nunca fica em cache.

var CACHE_NAME = 'central-gestao-v1';
var SHELL_FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(SHELL_FILES);
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(n){ return n !== CACHE_NAME; }).map(function(n){ return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  var url = event.request.url;
  // Nunca guarda em cache chamadas ao banco de dados (Supabase) — precisam
  // sempre ser buscadas na hora, senão os dados ficam desatualizados.
  if(url.indexOf('supabase.co') !== -1){
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(cached){
      return cached || fetch(event.request);
    })
  );
});
