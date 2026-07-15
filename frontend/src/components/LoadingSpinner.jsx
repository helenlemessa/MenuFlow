import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, size = 'default' }) => {
  const sizeClass = size === 'small' ? 'w-5 h-5' : size === 'large' ? 'w-12 h-12' : 'w-8 h-8';

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
        <Loader2 className={`${sizeClass} animate-spin text-primary-600`} />
      </div>
    );
  }

  return <Loader2 className={`${sizeClass} animate-spin text-primary-600`} />;
};

export default LoadingSpinner;
