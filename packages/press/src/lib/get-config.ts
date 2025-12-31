import { defineConfig, type PressConfig } from '../config/global.js';
import { glob } from 'tinyglobby';
import { pathToFileURL } from 'node:url';

const DefaultConfig = defineConfig({});

/**
 * Default glob patterns for finding config file
 */
const DefaultConfigPatterns = ['hanzoPress.config.{js,jsx,ts,tsx}'];

export async function findConfigPath(): Promise<string | null> {
  const paths = await glob(DefaultConfigPatterns);

  return paths.length > 0 ? paths[0] : null;
}

export async function loadConfig(configPath?: string | null): Promise<PressConfig> {
  if (configPath === null) return DefaultConfig;
  if (configPath === undefined) return loadConfig(await findConfigPath());

  try {
    const { default: userConfig } = await import(pathToFileURL(configPath).href);

    return checkConfig(userConfig);
  } catch (error) {
    console.error(
      `Failed to load config from ${configPath}:`,
      error instanceof Error ? error.message : String(error),
    );
    return DefaultConfig;
  }
}

function checkConfig(loaded: unknown): PressConfig {
  if (typeof loaded !== 'object' || loaded === null) {
    throw new Error(`Config file ${loaded} must export an object.`);
  }

  return loaded as PressConfig;
}
