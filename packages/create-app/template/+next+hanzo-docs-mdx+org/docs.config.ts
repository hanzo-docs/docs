import { defineProject } from '@hanzo/docs-org/config';
import { hanzo } from '@hanzo/docs-org/presets/hanzo';

// Configure your project identity here.
// Change the preset import and project slug to match your org and project.
const config = defineProject(hanzo, 'dev');

export default config;
