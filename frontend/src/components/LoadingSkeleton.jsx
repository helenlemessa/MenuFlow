import { motion } from 'framer-motion';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClass = 'skeleton';
  const variants = {
    rect: 'h-4 w-full',
    circle: 'rounded-full aspect-square',
    card: 'h-48 w-full rounded-2xl',
    text: 'h-4 w-3/4',
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`${baseClass} ${variants[variant]} ${className}`}
    />
  );
};

export const FoodCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton variant="card" className="h-48" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </div>
);

export default Skeleton;
