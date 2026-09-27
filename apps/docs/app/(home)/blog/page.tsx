import { blog } from '@/lib/source';
import { PathUtils } from '@hanzo/docs/core/source';
import { Posts } from '@/components/posts';

// Blog frontmatter (source.config.ts). A post with no date is dated by its file.
interface BlogData {
  title: string;
  description?: string;
  date?: string | Date;
}

const DAY = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

export default function Page() {
  const posts = blog
    .getPages()
    .map((page) => {
      const data = page.data as unknown as BlogData;
      const when = new Date(data.date ?? PathUtils.basename(page.path, PathUtils.extname(page.path)));
      return { page, data, when };
    })
    .sort((a, b) => b.when.getTime() - a.when.getTime())
    .map(({ page, data, when }) => ({
      url: page.url,
      title: data.title,
      description: data.description,
      date: DAY.format(when),
    }));

  return <Posts posts={posts} />;
}
