import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distRoot = resolve(repoRoot, "dist");
const configPath = resolve(distRoot, "staticwebapp.config.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
const port = Number.parseInt(process.env.KERNEL_KITTENS_TEST_PORT ?? "4321", 10);
const host = "127.0.0.1";
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"]
]);

function safeTarget(pathname) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  let relativePath = decodedPath.replace(/^\/+/, "");
  if (!relativePath || relativePath.endsWith("/")) relativePath += "index.html";

  const target = resolve(distRoot, relativePath);
  const targetRelativePath = relative(distRoot, target);
  if (targetRelativePath.startsWith("..") || isAbsolute(targetRelativePath)) return null;
  return target;
}

function applyHeaders(response, pathname) {
  for (const [name, value] of Object.entries(config.globalHeaders ?? {})) {
    response.setHeader(name, value);
  }

  if (pathname.startsWith("/_astro/")) {
    const assetRoute = config.routes?.find((route) => route.route === "/_astro/*");
    for (const [name, value] of Object.entries(assetRoute?.headers ?? {})) {
      response.setHeader(name, value);
    }
  }
}

async function readableFile(target) {
  if (!target) return null;

  try {
    const targetStat = await stat(target);
    return targetStat.isFile() ? target : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${host}:${port}`);
  applyHeaders(response, url.pathname);

  let status = 200;
  let target = await readableFile(safeTarget(url.pathname));

  if (!target) {
    status = 404;
    const rewrite = config.responseOverrides?.[String(status)]?.rewrite ?? "/404.html";
    target = await readableFile(safeTarget(rewrite));
  }

  if (!target) {
    response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const body = await readFile(target);
  response.writeHead(status, {
    "Content-Length": body.byteLength,
    "Content-Type": mimeTypes.get(extname(target).toLowerCase()) ?? "application/octet-stream"
  });
  response.end(request.method === "HEAD" ? undefined : body);
});

server.listen(port, host, () => {
  console.log(`Release test server ready at http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
