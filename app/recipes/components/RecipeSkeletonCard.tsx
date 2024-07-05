import React from 'react';
import Skeleton from './Skeleton';

const RecipeSkeletonCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Skeleton width="100%" height="256px" />
      <div className="mt-4">
        <Skeleton width="75%" height="24px" />
        <Skeleton width="50%" height="20px" className="mt-2" />
      </div>
    </div>
  );
};

export default RecipeSkeletonCard;