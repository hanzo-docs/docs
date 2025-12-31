import type { ContentConfig } from './content';

export interface PressConfig {
  /**
   * the directory for app files (relative to project root)
   *
   * @defaultValue './app'
   */
  appDir: string;

  content?: ContentConfig;
}

export function defineConfig(config: Partial<PressConfig>): PressConfig {
  return {
    ...config,
    appDir: config.appDir ?? './app',
  };
}
