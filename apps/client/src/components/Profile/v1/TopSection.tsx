"use client";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import RadarChart from "./RadarChart";
import Skills from "./Skills";
import Resume from "./Resume";
import UserInfo from "./UserInfo";
import { useUserStore } from "@/store/user-store";

export default function TopSection() {
  const Colors = useColors();
  const { info, hasHydrated } = useUserStore();
  return (
    <div
      className={`${Colors.background.secondary} rounded-xl gap-4 p-4 w-full h-full grid grid-cols-1 xl:grid-cols-3`}
    >
      {hasHydrated && info && (
        <div className={`${Colors.background.primary} rounded-xl p-4 min-h-64`}>
          <RadarChart />
        </div>
      )}
      <div
        className={`${Colors.background.primary} xl:col-span-2 rounded-xl p-4`}
      >
        <UserInfo />
      </div>
    </div>
  );
}
