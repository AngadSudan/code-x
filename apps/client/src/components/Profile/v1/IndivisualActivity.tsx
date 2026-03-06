"use client";
import React, { useState } from "react";
import { useUserStore } from "@/store/user-store";
import { useColors } from "@/components/General/(Color Manager)/useColors";

function IndividualActivity() {
    const Colors = useColors();

    const user = useUserStore((state) => state.info);
    const hasHydrated = useUserStore((state) => state.hasHydrated);

    const [imageError, setImageError] = useState(false);

    console.log("HYDRATION STATUS:", hasHydrated);
    console.log("USER FROM ZUSTAND STORE:", user);

    if (!hasHydrated) {
        console.log("Waiting for hydration...");
        return <div className="text-center p-4">Loading activity...</div>;
    }

    if (!user) {
        console.log("User still null after hydration");
        return <div className="text-center p-4">No user found</div>;
    }

    const githubHandle = user.username ?? "";

    const githubConnected = Boolean(user.githubOAuth);

    console.log("githubOAuth:", user.githubOAuth);
    console.log("githubConnected:", githubConnected);

    const graphUrl = `https://github-readme-activity-graph.vercel.app/graph?username=${encodeURIComponent(
        githubHandle
    )}&theme=github`;

    console.log("GRAPH URL:", graphUrl);

    const connectGithub = () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/github`;
        console.log("Redirecting to OAuth:", url);
        window.location.href = url;
    };

    return (
        <div>
            <div className="w-full max-w-7xl mx-auto">

                <div className="relative p-3 sm:p-4 md:p-2 lg:p-2">

                    <div className="relative">

                        <img
                            src={graphUrl}
                            alt={`${githubHandle}'s GitHub activity graph`}
                            loading="lazy"
                            onLoad={() => console.log("GRAPH LOADED")}
                            onError={() => {
                                console.log("GRAPH FAILED");
                                setImageError(true);
                            }}
                            className={`w-full h-auto rounded-lg sm:rounded-xl transition-opacity duration-300
                            ${graphUrl ? "opacity-100" : "opacity-40 blur-[2px]"}`}
                        />

                        {!graphUrl && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">

                                <p className="text-sm sm:text-base text-white/80">
                                    Connect GitHub to view your activity
                                </p>

                                <button
                                    onClick={connectGithub}
                                    className={`${Colors.properties.interactiveButton} ${Colors.text.special} ${Colors.hover.textSpecial} px-4 py-2 rounded-md`}
                                >
                                    Connect GitHub
                                </button>

                            </div>
                        )}
                    </div>

                    {imageError && (
                        <div className="text-center mt-4 text-sm">
                            Failed to load activity graph
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default IndividualActivity;