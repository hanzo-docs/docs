import { createFileSystemCache, defineStoryFactory } from '@hanzo/docs-story';

export const { defineStory, getStoryPayloads } = defineStoryFactory({
  cache: process.env.NODE_ENV === 'production' && createFileSystemCache('.tanstack/tmp/story'),
});
