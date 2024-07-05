import React from 'react';

const Skeleton = ({ width, height, className }: { width: string, height: string, className?: string }) => {
  return (
    <div
      className={`bg-gray-300 animate-pulse rounded ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export default Skeleton;