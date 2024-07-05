import React from 'react';
import Skeleton from '../recipes/components/Skeleton';

const RecipeDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-white p-6 relative">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="-mx-8 bg-orange-300 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="24px" className="mt-4" />
            </div>
            <Skeleton width="100%" height="256px" />
          </div>
        </div>
        <div className="relative flex justify-center -mt-8 z-20">
          <div className="absolute flex space-x-0 transform -translate-y-1/2">
            <div className="flex flex-col items-center bg-white p-4 shadow-lg w-32 h-32">
              <Skeleton width="48px" height="48px" />
              <Skeleton width="50%" height="20px" className="mt-2" />
              <Skeleton width="50%" height="20px" className="mt-1" />
            </div>
            <div className="flex flex-col items-center bg-white p-4 shadow-lg w-32 h-32">
              <Skeleton width="48px" height="48px" />
              <Skeleton width="50%" height="20px" className="mt-2" />
              <Skeleton width="50%" height="20px" className="mt-1" />
            </div>
          </div>
        </div>
        <div className="-mx-8 bg-orange-400 p-8 -mt-8 flex gap-6">
          <div className="w-1/2">
            <Skeleton width="100%" height="24px" />
            <div className="mt-4 space-y-2">
              <Skeleton width="100%" height="20px" />
              <Skeleton width="100%" height="20px" />
              <Skeleton width="100%" height="20px" />
            </div>
          </div>
          <div className="w-1/2">
            <Skeleton width="100%" height="24px" />
            <div className="mt-4 space-y-2">
              <Skeleton width="100%" height="20px" />
              <Skeleton width="100%" height="20px" />
              <Skeleton width="100%" height="20px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsSkeleton;
