import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
	return {
		// `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local` — loaded from here.
		// Only variables prefixed with `VITE_` are exposed to client code via `import.meta.env`.
		envDir: path.resolve(__dirname),
		build: {
			outDir: "build",
		},
		css: {
			preprocessorOptions: {
				// Both keys: Vite passes `lang` from the file extension (`scss` vs `sass`).
				scss: {
					loadPaths: [path.resolve(__dirname, "src")],
					// Avoid flooding the dev server; @import still works until Dart Sass 3.
					silenceDeprecations: ["import" as const],
				},
				sass: {
					loadPaths: [path.resolve(__dirname, "src")],
					silenceDeprecations: ["import" as const],
				},
			},
		},
		server: {
			port: 4763,
		},
		plugins: [
			tsconfigPaths(),
			tanstackRouter({
				target: "react",
				autoCodeSplitting: false,
			}),
			tailwindcss(),
			react(),
		],
	};
});
