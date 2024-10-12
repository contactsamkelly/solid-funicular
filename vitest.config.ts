import path from "node:path";
import { buildPagesASSETSBinding, defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

const assetsPath = path.join(__dirname, "public");

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        main: './src/main.tsx',
        wrangler: { configPath: "./wrangler.toml" },
        miniflare: {
					compatibilityFlags: ["nodejs_compat"],
					compatibilityDate: "2024-01-01",
					kvNamespaces: ["KV_NAMESPACE"],
					serviceBindings: {
						ASSETS: await buildPagesASSETSBinding(assetsPath),
					},
				},
      },
    },
  },
});