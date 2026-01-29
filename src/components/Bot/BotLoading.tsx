import { FC } from "react";

export const BotLoading: FC = () => {
    return (
        <div className="max-w-[1200px] w-full px-4">
            {/* Hero Section Skeleton */}
            <div className="relative mt-8 mb-8">
                {/* Banner */}
                <div className="h-40 rounded-2xl bg-dark-elevated animate-pulse"></div>

                {/* Bot Info Card */}
                <div className="relative -mt-16 mx-4 xl:mx-2">
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6 xl:p-4">
                        <div className="flex xl:flex-col gap-6">
                            {/* Avatar */}
                            <div className="w-28 h-28 xl:w-24 xl:h-24 xl:mx-auto rounded-2xl bg-dark-elevated animate-pulse"></div>

                            {/* Info */}
                            <div className="flex-1 xl:text-center space-y-3">
                                <div className="flex items-center gap-3 xl:justify-center">
                                    <div className="h-8 w-48 bg-dark-elevated rounded-lg animate-pulse"></div>
                                    <div className="h-6 w-16 bg-dark-elevated rounded-lg animate-pulse"></div>
                                </div>
                                <div className="flex items-center gap-1 xl:justify-center">
                                    {Array(5).fill(0).map((_, i) => (
                                        <div key={i} className="w-5 h-5 bg-dark-elevated rounded animate-pulse"></div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 xl:justify-center">
                                    <div className="h-8 w-24 bg-dark-elevated rounded-lg animate-pulse"></div>
                                    <div className="h-8 w-20 bg-dark-elevated rounded-lg animate-pulse"></div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 xl:flex-row xl:justify-center">
                                <div className="h-12 w-32 bg-dark-elevated rounded-xl animate-pulse"></div>
                                <div className="h-12 w-32 bg-dark-elevated rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-3 xl:grid-cols-1 gap-6 mb-8">
                {/* Description */}
                <div className="col-span-2 xl:col-span-1">
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                        <div className="h-6 w-32 bg-dark-elevated rounded-lg animate-pulse mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-dark-elevated rounded animate-pulse"></div>
                            <div className="h-4 w-5/6 bg-dark-elevated rounded animate-pulse"></div>
                            <div className="h-4 w-4/6 bg-dark-elevated rounded animate-pulse"></div>
                            <div className="h-32 w-1/2 bg-dark-elevated rounded-lg animate-pulse mt-4"></div>
                            <div className="h-4 w-full bg-dark-elevated rounded animate-pulse"></div>
                            <div className="h-4 w-3/4 bg-dark-elevated rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Developer */}
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                        <div className="h-6 w-32 bg-dark-elevated rounded-lg animate-pulse mb-4"></div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-elevated">
                            <div className="w-12 h-12 rounded-full bg-dark-border animate-pulse"></div>
                            <div className="h-5 w-24 bg-dark-border rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                        <div className="h-6 w-16 bg-dark-elevated rounded-lg animate-pulse mb-4"></div>
                        <div className="flex flex-wrap gap-2">
                            <div className="h-8 w-20 bg-dark-elevated rounded-lg animate-pulse"></div>
                            <div className="h-8 w-16 bg-dark-elevated rounded-lg animate-pulse"></div>
                            <div className="h-8 w-24 bg-dark-elevated rounded-lg animate-pulse"></div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                        <div className="h-6 w-16 bg-dark-elevated rounded-lg animate-pulse mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-14 w-full bg-dark-elevated rounded-xl animate-pulse"></div>
                            <div className="h-14 w-full bg-dark-elevated rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedbacks Skeleton */}
            <div className="bg-dark-card rounded-2xl border border-dark-border p-6 mb-8">
                <div className="h-6 w-32 bg-dark-elevated rounded-lg animate-pulse mb-6"></div>
                <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-dark-border animate-pulse"></div>
                                <div className="space-y-1">
                                    <div className="h-4 w-24 bg-dark-border rounded animate-pulse"></div>
                                    <div className="h-3 w-16 bg-dark-border rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="h-4 w-3/4 bg-dark-border rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
