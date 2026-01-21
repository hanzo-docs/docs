
import { getIcon } from "@/constants/iconMappings";
import Link from "next/link";

interface SolutionItem {
  name: string;
  href: string;
  description: string;
}

interface SolutionCategoryProps {
  title: string;
  items: SolutionItem[];
  onItemClick: () => void;
}

export const SolutionCategory = ({ title, items, onItemClick }: SolutionCategoryProps) => {
  // Display 8 items per category
  const displayItems = items.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--white)]">{title}</h3>
        <Link
          href="/solutions"
          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          onClick={onItemClick}
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {displayItems.map((item) => {
          const Icon = getIcon(item.name);
          return (
            <Link
              href={item.href}
              key={item.name}
              className="flex items-center space-x-3 group"
              onClick={onItemClick}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-neutral-400 group-hover:text-[var(--white)] transition-colors" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-neutral-300 group-hover:text-[var(--white)] font-medium truncate">{item.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
