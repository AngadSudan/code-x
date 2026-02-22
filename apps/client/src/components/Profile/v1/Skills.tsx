'use client';

import { useState } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

type DataProps = {
  name: string;
};

const data = [
  { name: "Javascript" },
  { name: "Docker" },
  { name: "Django" },
  { name: "Mongo DB" },
  { name: "Kubernetes" },
  { name: "Amazon Web Services" },
  { name: "React" },
  { name: "Next.js" },
  { name: "TypeScript" },
];

const skillMap: Record<string, string> = {
  java: "java",
  javascript: "javascript",
  typescript: "typescript",
  docker: "docker",
  django: "django",
  mongodb: "mongodb",
  "mongo db": "mongodb",
  kubernetes: "kubernetes",
  react: "react",
  "next.js": "nextdotjs",
  next: "nextdotjs",
  "amazon web services": "amazonwebservices",
  aws: "amazonwebservices",
  "c++": "cplusplus",
  "c#": "csharp",
  ".net": "dotnet",
};

function getSkillSlug(name: string) {
  const normalized = name.toLowerCase().trim();

  if (skillMap[normalized]) {
    return skillMap[normalized];
  }

  // fallback cleaning
  return normalized
    .replace(/\s+/g, "")
    .replace(/\./g, "dot")
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9]/g, "");
}

function Skills() {
  const visibleSkills = data.slice(0, 8);
  const showMore = data.length > 8;
  const Colors = useColors();

  return (
    <div
      className={`${Colors.text.primary} font-mono flex flex-col justify-between h-full gap-2`}
    >
      <div>
        <h1 className="text-2xl">Skills and Technologies</h1>
        <div className={`${Colors.border.defaultThinBottom} mb-3`} />
      </div>

      <div className="grid grid-rows-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 h-full">
        {visibleSkills.map((item, index) => (
          <GridItem key={index} name={item.name} />
        ))}
      </div>

      {showMore && (
        <p className="text-center text-sm cursor-pointer hover:underline mx-auto">
          See More {">>"}
        </p>
      )}
    </div>
  );
}

// -----------------------------
// 4️⃣ Grid Item with Fallback
// -----------------------------
function GridItem({ name }: DataProps) {
  const Colors = useColors();
  const [imageError, setImageError] = useState(false);
  const slug = getSkillSlug(name);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`${Colors.background.secondary} flex flex-col items-center justify-center w-full min-h-20 rounded-xl transition hover:scale-105 duration-200`}
    >
      {!imageError ? (
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={name}
          className="w-8 h-8 mb-2"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-full bg-gray-500 text-white text-xs font-bold">
          {initials}
        </div>
      )}

      <p className="text-xs text-center">{name}</p>
    </div>
  );
}

export default Skills;