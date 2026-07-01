// Service worker — permite "instalar" o painel como app no celular.
// Estratégia: sempre tenta buscar a versão mais nova primeiro (network-first).
// Só usa a cópia guardada em cache se o celular estiver sem internet.
// Isso evita o problema de ficar preso numa versão antiga depois de uma
// atualização. Dados de motoboys/caixa/colaboradores etc. nunca ficam em
// cache — sempre vêm direto do Supabase.

var CACHE_NAME = 'central-gestao-v2';
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
  // Nunca intercepta chamadas ao banco de dados (Supabase) — precisam
  // sempre ser buscadas na hora, senão os dados ficam desatualizados.
  if(url.indexOf('supabase.co') !== -1){
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response){
        // Deu certo buscar na internet: usa essa versão e atualiza o cache
        // pra próxima vez que estiver offline.
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        return response;
      })
      .catch(function(){
        // Sem internet: usa a cópia guardada, se existir.
        return caches.match(event.request);
      })
  );
});
