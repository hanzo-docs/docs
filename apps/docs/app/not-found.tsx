import { NotFound } from '@/components/layouts/not-found';

// The 404 the host serves. A static export answers every unknown URL with this
// one file, so it cannot know which URL was asked for — the component reads the
// address in the browser and searches the exported corpus for it.
export default function Page() {
  return <NotFound />;
}
