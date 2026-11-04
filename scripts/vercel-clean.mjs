/* Vercel only: remove the PHP backend from the build output.
   Vercel cannot run PHP. If the .php files stay in dist/, Vercel serves them as plain files and every
   form or admin request fails with "405". Without them, the rewrites in vercel.json forward /api to the PHP host. */
import fs from "node:fs";
for (const d of ["dist/api", "dist/uploads"]) fs.rmSync(d, { recursive: true, force: true });
console.log("vercel-clean: removed dist/api and dist/uploads (served by the PHP host)");
