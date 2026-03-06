import { useColors } from "@/components/General/(Color Manager)/useColors";
import BottomSection from "./BottomSection";
import SideSection from "./SideSection";
import TopSection from "./TopSection";

const sizes = {
  large: 4,
  medium: 2,
  small: 1,
};

export default function ProfilePageV1() {
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
        `}
      >
        <TopSection />
        <BottomSection />
      </div>
    </div>
  );
}