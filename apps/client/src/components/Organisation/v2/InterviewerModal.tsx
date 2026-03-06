"use client";

import { useColors } from "@/components/General/(Color Manager)/useColors";
import InterviewersTable from "./InterviewersTable";
import SideSection from "./SideSection";

export default function InterviewersPage() {
    const Colors = useColors();

    return (
        <div
            className={`
                ${Colors.background.primary}
                h-screen
                overflow-hidden
                grid
                grid-cols-4
                gap-4
                p-4
              `}
        >
            {/* LEFT SECTION*/}
            <div className="col-span-1 h-full rounded-xl">
                <SideSection />
            </div>

            {/* RIGHT SECTION*/}
            <div
                className={`
                  ${Colors.background.secondary}
                  col-span-3
                  h-full
                  rounded-xl
                  flex
                  flex-col
                  overflow-y-auto
                  scrollbar-hide
                  p-4
                `}
            >
                <InterviewersTable />
            </div>
        </div>
    );
}
