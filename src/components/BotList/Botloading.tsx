import React from "react";

const SkeletonCard: React.FC = () => (
    <div className="bg-dark-card rounded-2xl overflow-hidden border border-dark-border flex flex-col animate-pulse">
        {/* Banner Skeleton */}
        <div className="relative h-28 bg-dark-elevated">
            {/* Avatar skeleton */}
            <div className="absolute -bottom-8 left-4">
                <div className="w-16 h-16 rounded-2xl bg-dark-border border-4 border-dark-card"></div>
            </div>
            {/* Vote badge skeleton */}
            <div className="absolute top-3 right-3">
                <div className="w-16 h-7 rounded-lg bg-dark-border"></div>
            </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col flex-1 p-4 pt-12">
            {/* Name skeleton */}
            <div className="h-6 w-32 bg-dark-elevated rounded-lg mb-3"></div>
            
            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-dark-elevated rounded-lg"></div>
                <div className="h-4 w-3/4 bg-dark-elevated rounded-lg"></div>
            </div>
            
            {/* Tags skeleton */}
            <div className="flex gap-1.5 mb-4">
                <div className="h-6 w-16 bg-dark-elevated rounded-md"></div>
                <div className="h-6 w-20 bg-dark-elevated rounded-md"></div>
                <div className="h-6 w-14 bg-dark-elevated rounded-md"></div>
            </div>

            {/* Actions skeleton */}
            <div className="flex gap-2 mt-auto pt-4 border-t border-dark-border">
                <div className="flex-1 h-10 bg-dark-elevated rounded-xl"></div>
                <div className="flex-1 h-10 bg-dark-elevated rounded-xl"></div>
            </div>
        </div>
    </div>
);

export const Botloading: React.FC<{ fills: number; grid?: boolean }> = ({ fills, grid }) => {
    const cards = Array.from({ length: fills }, (_, i) => <SkeletonCard key={i} />);
    
    return grid ? (
        <>{cards}</>
    ) : (
        <div className="grid grid-cols-2 gap-4 text-white px-4 xl:grid-cols-1 w-full">
            {cards}
        </div>
    );
};
