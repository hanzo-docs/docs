import { type Plugin, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import mdx from '@hanzo/mdx/vite';
import path from 'node:path';
import { createContentConfig } from '../config/content.js';
import { baseDir } from '../constants.js';
import { defineConfig, PressConfig } from '../config/global.js';
import { findFile } from '../lib/find-file.js';

const extnames = ['.js', '.ts', '.jsx', '.tsx'];

export async function hanzoPress(config: Partial<PressConfig> = {}): Promise<PluginOption[]> {
  const resolved = defineConfig(config);

  return [
    react(),
    rsc({
      entries: {
        client: path.join(baseDir, 'dist/entry.browser.js'),
        rsc: path.join(baseDir, 'dist/entry.rsc.js'),
        ssr: path.join(baseDir, 'dist/entry.ssr.js'),
      },
    }),
    mdx(await createContentConfig(resolved), {
      index: false,
      updateViteConfig: false,
    }),
    init(null, resolved),
  ];
}

function init(configPath: string | null, config: PressConfig): Plugin {
  let routesPath: string | null;

  return {
    name: 'hanzoPress:init',
    enforce: 'pre',
    configEnvironment(_name, config) {
      if (config.optimizeDeps?.include) {
        config.optimizeDeps.include = config.optimizeDeps.include.map((entry) => {
          if (entry.startsWith('@vitejs/plugin-rsc')) {
            entry = `hanzoPress > ${entry}`;
          }
          return entry;
        });
      }
    },
    async configResolved() {
      const name = path.join(config.appDir, 'routes');
      routesPath = (await findFile(extnames.map((ext) => name + ext))) ?? null;
    },
    resolveId(id) {
      if (id == 'virtual:app/routes') return routesPath;
    },
    configureServer(server) {
      server.watcher.on('change', async (file) => {
        if (!configPath) return;

        const fullConfigPath = path.resolve(configPath);
        if (fullConfigPath === file) {
          console.log(`Config changed: ${file}. Restarting dev server.`);
          await server.restart();
        }
      });
    },
  };
}
