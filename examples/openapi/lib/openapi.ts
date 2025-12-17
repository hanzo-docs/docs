import { createOpenAPI } from '@hanzo/docs/openapi/server';

export const openapi = createOpenAPI({
  // input files
  input: ['./openapi.yaml'],
});
