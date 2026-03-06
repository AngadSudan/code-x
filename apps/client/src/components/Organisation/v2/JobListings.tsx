"use client";

import { useRouter } from "next/navigation";
import { useColors } from "@/components/General/(Color Manager)/useColors";

export default function JobListings() {
    const Colors = useColors();
    const router = useRouter();

    return (
        <div
            onClick={() => router.push("/org-dashboard/job-listings")}
            className={`
          cursor-pointer
          rounded-xl
          p-4
          h-full
          flex flex-col justify-center
          hover:opacity-80
        `}
        >
            <h2 className={`text-xl font-semibold ${Colors.text.primary}`}>
                Job Listings
            </h2>

            <p className={`text-sm ${Colors.text.secondary} mt-1`}>
                View and manage Job Listings.
            </p>
        </div>
    );
}