// CapyUniverse Service Worker - Funcionalidade Offline Completa
// Implementa caching estático e dinâmico para uma experiência PWA robusta

const CACHE_NAME = 'capyuniverse-v1';
const STATIC_CACHE = 'capyuniverse-static-v1';
const DYNAMIC_CACHE = 'capyuniverse-dynamic-v1';

// URLs para cache estático (assets essenciais)
const staticUrls = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@material/web@1.0.0/all.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// URLs para cache dinâmico (API responses, imagens geradas)
const dynamicUrls = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  'https://image.pollinations.ai/'
];

// Instala o service worker e faz cache dos assets estáticos
self.addEventListener('install', event => {
  console.log('[SW] Instalando CapyUniverse Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Fazendo cache dos assets estáticos...');
        return cache.addAll(staticUrls.map(url => {
          return new Request(url, {
            cache: 'reload' // Força reload para evitar cache do browser
          });
        }));
      }),
      // Prepara cache dinâmico
      caches.open(DYNAMIC_CACHE)
    ])
  );
  
  // Força a ativação imediata do SW
  self.skipWaiting();
});

// Ativa o service worker e limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[SW] Ativando CapyUniverse Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Toma controle de todas as páginas abertas
      self.clients.claim()
    ])
  );
});

// Intercepta todas as requisições de rede
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estratégia: Cache First para assets estáticos
  if (staticUrls.some(staticUrl => request.url.includes(staticUrl.replace('/', '')))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
  
  // Estratégia: Network First para APIs (com fallback offline)
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('pollinations.ai')) {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }
  
  // Estratégia: Stale While Revalidate para outros recursos
  event.respondWith(staleWhileRevalidate(request));
});

// Estratégia Cache First: Busca no cache primeiro, depois na rede
async function cacheFirst(request, cacheName = STATIC_CACHE) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Cache hit:', request.url);
      return cachedResponse;
    }
    
    console.log('[SW] Cache miss, buscando na rede:', request.url);
    const networkResponse = await fetch(request);
    
    // Salva no cache para próximas requisições
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Erro em cacheFirst:', error);
    // Retorna uma página offline genérica ou erro
    return new Response('Conteúdo não disponível offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estratégia Network First: Busca na rede primeiro, cache como fallback
async function networkFirstWithOfflineFallback(request) {
  try {
    console.log('[SW] Tentando rede primeiro:', request.url);
    const networkResponse = await fetch(request);
    
    // Salva resposta bem-sucedida no cache dinâmico
    if (networkResponse.status === 200 && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      console.log('[SW] Resposta salva no cache dinâmico');
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Rede falhou, tentando cache:', error.message);
    
    // Busca no cache dinâmico
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Resposta encontrada no cache dinâmico');
      return cachedResponse;
    }
    
    // Se é uma requisição à API Gemini, retorna resposta offline personalizada
    if (request.url.includes('googleapis.com')) {
      return new Response(JSON.stringify({
        offline: true,
        message: 'Esta funcionalidade requer conexão com a internet. Suas configurações e dados locais estão seguros.',
        cachedAt: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 503
      });
    }
    
    // Para outras requisições, retorna erro genérico
    return new Response('Recurso não disponível offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estratégia Stale While Revalidate: Retorna do cache e atualiza em background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Busca na rede em background (fire and forget)
  const networkPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignora erros de rede silenciosamente
    console.log('[SW] Falha na atualização em background:', request.url);
  });
  
  // Retorna do cache imediatamente se disponível
  if (cachedResponse) {
    console.log('[SW] Servindo do cache (stale):', request.url);
    return cachedResponse;
  }
  
  // Se não tem cache, espera a rede
  console.log('[SW] Aguardando rede (no cache):', request.url);
  return networkPromise;
}

// Escuta mensagens do app principal
self.addEventListener('message', event => {
  console.log('[SW] Mensagem recebida:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_CACHE_SIZE':
        getCacheSize().then(size => {
          event.ports[0].postMessage({ cacheSize: size });
        });
        break;
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ cleared: true });
        });
        break;
      default:
        console.log('[SW] Tipo de mensagem não reconhecido:', event.data.type);
    }
  }
});

// Função utilitária: Calcula tamanho total dos caches
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return Math.round(totalSize / 1024 / 1024 * 100) / 100; // MB com 2 casas decimais
}

// Função utilitária: Limpa todos os caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => {
      console.log('[SW] Limpando cache:', cacheName);
      return caches.delete(cacheName);
    })
  );
}

// Sincronização em background (quando a conexão retornar)
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-capyuniverse') {
    event.waitUntil(
      // Aqui você pode implementar lógica para sincronizar dados
      // quando a conexão voltar (ex: enviar dados offline para servidor)
      syncOfflineData()
    );
  }
});

async function syncOfflineData() {
  console.log('[SW] Sincronizando dados offline...');
  // Implementar sincronização se necessário
  // Por exemplo: enviar histórico local para servidor
}

// Notificações push (se necessário no futuro)
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização no CapyUniverse!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('CapyUniverse', options)
  );
});

console.log('[SW] CapyUniverse Service Worker carregado e pronto! 🦫✨');