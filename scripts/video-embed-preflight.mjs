import http from "node:http";

const videos = new Set([
  "F-ouLW_MDkY", "O4b30uS8QL0", "T_BrGwWYwDI", "f2dXK0nw5zE", "smqy6ZgsZXU",
  "EAAR2KzU43s", "x-zH-44dWqQ", "yKAlXh4ZToU", "v4_QrTQxdvc", "f_Ti-tCX5Lo",
]);

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1:3138");
  const videoId = requestUrl.searchParams.get("video") ?? "";
  if (!videos.has(videoId)) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Unknown video ID");
    return;
  }
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": "default-src 'self'; frame-src https://www.youtube-nocookie.com; style-src 'unsafe-inline'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  response.end(`<!doctype html><html><head><title>Video embed preflight ${videoId}</title><style>body{margin:0;background:#211722;color:white;font:16px Arial}main{max-width:960px;margin:auto;padding:24px}iframe{width:100%;aspect-ratio:16/9;border:0}</style></head><body><main><h1>${videoId}</h1><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="${videoId} embed preflight" loading="eager" allow="accelerometer; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></main></body></html>`);
});

server.listen(3138, "127.0.0.1", () => console.log("Video embed preflight ready at http://127.0.0.1:3138"));
