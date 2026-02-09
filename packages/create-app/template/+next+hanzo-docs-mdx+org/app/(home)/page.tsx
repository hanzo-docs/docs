import Link from 'next/link';
import config from '@/docs.config';

export default function HomePage() {
  const { project } = config;

  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <p className="mb-4 text-fd-muted-foreground">{project.description}</p>
      <p>
        <Link href="/docs" className="font-medium underline">
          View Documentation
        </Link>
      </p>
    </div>
  );
}
