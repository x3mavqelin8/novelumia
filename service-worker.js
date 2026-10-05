const CACHE_NAME = "dbsdv-build-57";

const STATIC_FILES = ["./", "./index.html", "./manifest.json"];

// インストール

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES)),
  );
});

// 有効化
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );

      await self.clients.claim();
    })(),
  );
});

// 通信
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // http/https以外はキャッシュしない
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  // index.htmlは毎回ネット優先
  if (
    event.request.mode === "navigate" ||
    url.pathname.endsWith("index.html")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put("./index.html", copy);
          });

          return response;
        })
        .catch(() => caches.match("./index.html")),
    );

    return;
  }

  // version.jsonは毎回ネットから取得
  if (url.pathname.endsWith("version.json")) {
    event.respondWith(fetch(event.request));

    return;
  }

  // JS・CSS・画像はネット優先
  // ネットが使えない場合だけキャッシュを使用
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});

// アプリ側から「今すぐ新しいService Workerを有効化して」と言われたら実行
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
