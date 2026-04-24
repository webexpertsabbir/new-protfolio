import { cn } from "@/src/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-3xl bg-white/10 border border-white/5",
        className
      )}
    />
  );
}

export function ProjectSkeleton() {
  return (
    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-brand-dark/50 border border-white/5 flex flex-col justify-end p-6 gap-3">
      <Skeleton className="absolute inset-0 opacity-20" />
      <div className="relative z-10 space-y-4">
        <Skeleton className="h-3 w-1/4 rounded-full bg-white/5" />
        <Skeleton className="h-10 w-3/4 rounded-lg bg-white/5" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
          <Skeleton className="h-3 w-1/3 rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  );
}
