import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";

function checkPort(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const s = net.connect({ port, host, timeout: 500 });
    s.on("connect", () => { s.destroy(); resolve(true); });
    s.on("error", () => resolve(false));
    s.on("timeout", () => { s.destroy(); resolve(false); });
  });
}

function localBackend() {
  return {
    name: "local-php-mysql",
    configureServer() {
      const mysqld = "C:\\xampp\\mysql\\bin\\mysqld.exe";
      const ariaChk = "C:\\xampp\\mysql\\bin\\aria_chk.exe";
      const php = "C:\\xampp\\php\\php.exe";

      if (fs.existsSync(mysqld)) {
        checkPort(3307, "127.0.0.1").then((up) => {
          if (!up) {
            if (fs.existsSync(ariaChk)) {
              const maiDir = "C:\\xampp\\mysql\\data\\mysql";
              const tables = ["columns_priv.MAI", "help_topic.MAI", "proc.MAI", "proxies_priv.MAI"]
                .map((f) => `${maiDir}\\${f}`)
                .filter((f) => fs.existsSync(f));
              if (tables.length) {
                spawnSync(ariaChk, ["-o", "-f", ...tables], { stdio: "ignore", windowsHide: true });
              }
            }
            const p = spawn(
              mysqld,
              [
                "--defaults-file=C:\\xampp\\mysql\\bin\\my.ini",
                "--innodb-use-native-aio=0",
                "--innodb-buffer-pool-load-at-startup=0",
              ],
              { detached: true, stdio: "ignore", windowsHide: true }
            );
            p.unref();
          }
        });
      }

      if (fs.existsSync(php)) {
        checkPort(8000, "localhost").then((up) => {
          if (!up) {
            const p = spawn(php, ["-S", "localhost:8000", "-t", "public"], {
              detached: true,
              stdio: "ignore",
              windowsHide: true,
            });
            p.unref();
          }
        });
      }
    },
  };
}

/* npm run dev serves the React site on http://localhost:5173.
   The PHP backend (blog, forms, admin) runs with "npm run api" on http://localhost:8000 and is reached through the proxy below. */
export default defineConfig({
  plugins: [react(), localBackend()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
      "/uploads": "http://localhost:8000",
      "/sitemap.xml": { target: "http://localhost:8000", rewrite: () => "/api/sitemap.php" },
    },
  },
  build: { cssCodeSplit: false, chunkSizeWarningLimit: 900 },
});
