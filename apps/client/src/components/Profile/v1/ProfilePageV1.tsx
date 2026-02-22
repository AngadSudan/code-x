import { useColors } from "@/components/General/(Color Manager)/useColors";
import BottomSection from "./BottomSection";
import SideSection from "./SideSection";
import TopSection from "./TopSection";

const sizes = {
  large: 4,
  medium: 2,
  small: 1,
}

export default function ProfilePageV1() {
  const Colors = useColors();
  return (
    <div
      className={`${Colors.background.primary} min-h-screen grid grid-cols-4 grid-rows-2 gap-4 p-${sizes.large}`}
    >
      <div className={`w-full h-full row-span-2 rounded-xl`}><SideSection /></div>
      <div className={`${Colors.background.secondary} w-full h-full col-span-3 row-span-2 rounded-xl flex flex-col`}>
        <TopSection />
        <BottomSection />
      </div>
    </div>
  );
}
