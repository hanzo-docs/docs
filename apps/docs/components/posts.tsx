'use client';

import Link from 'next/link';
import { Text, YStack } from '@hanzo/gui';
import { Grid } from '@hanzo/ui/grid';
import { muted } from '@/lib/ink';

export interface Post {
  url: string;
  title: string;
  description?: string;
  /** Formatted on the server, so both renders print the same string. */
  date: string;
}

/** The blog's index: a heading and the posts, newest first. */
export function Posts({ posts }: { posts: Post[] }) {
  return (
    <YStack render="main" width="100%" maxW={1120} self="center" px={40} py={48} gap={28} $max-md={{ px: 20, py: 28 }}>
      <YStack gap={8} pb={24} borderBottomWidth={1} borderColor="$borderColor">
        <Text render="h1" fontSize={32} lineHeight={40} fontWeight="600" letterSpacing={-0.6} color="$color12">
          Blog
        </Text>
        <Text fontSize={17} {...muted}>
          Announcements and updates from Hanzo.
        </Text>
      </YStack>
      <Grid columns={{ min: 260, max: 3 }} gap={12}>
        {posts.map((post) => (
          <YStack
            key={post.url}
            render={<Link href={post.url} prefetch={false} />}
            gap={6}
            p={18}
            rounded="$5"
            borderWidth={1}
            borderColor="$borderColor"
            bg="$panel"
            hoverStyle={{ bg: '$hover' }}
          >
            <Text fontSize={15} lineHeight={22} fontWeight="600" color="$color12" whiteSpace="normal">
              {post.title}
            </Text>
            {post.description ? (
              <Text fontSize={14} lineHeight={21} whiteSpace="normal" {...muted}>
                {post.description}
              </Text>
            ) : null}
            <Text mt="auto" pt={12} fontSize={12} {...muted}>
              {post.date}
            </Text>
          </YStack>
        ))}
      </Grid>
    </YStack>
  );
}
