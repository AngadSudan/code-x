type TechKey =
  // Languages
  | "HTML"
  | "CSS"
  | "Javascript"
  | "Typescript"
  | "Java"
  | "Python"

  // Frontend
  | "React"
  | "Next.js"
  | "Tailwind CSS"

  // Backend
  | "Node.js"
  | "Express"
  | "Spring Boot"
  | "Django"

  // Databases
  | "Mongo DB"
  | "PostgreSQL"
  | "MySQL"
  | "Redis"

  // DevOps / Cloud
  | "Docker"
  | "Kubernetes"
  | "AWS"
  | "GCP"
  | "Azure"

  // Tools
  | "Github"
  | "Git"
  | "Postman"
  | "Figma"

  // Roles
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "DevOps Engineer"
  | "Internship"

  // Companies / Platforms
  | "Google"
  | "Amazon"
  | "Microsoft"
  | "Netflix"
  | "Meta";


const techAndColours: Record<TechKey, { dot: string }> = {
  // Languages
  HTML: { dot: "bg-orange-500" },
  CSS: { dot: "bg-sky-500" },
  Javascript: { dot: "bg-yellow-300" },
  Typescript: { dot: "bg-blue-600" },
  Java: { dot: "bg-red-500" },
  Python: { dot: "bg-yellow-400" },

  // Frontend
  React: { dot: "bg-cyan-400" },
  "Next.js": { dot: "bg-neutral-300" },
  "Tailwind CSS": { dot: "bg-teal-400" },

  // Backend
  "Node.js": { dot: "bg-green-500" },
  Express: { dot: "bg-neutral-400" },
  "Spring Boot": { dot: "bg-green-600" },
  Django: { dot: "bg-emerald-600" },

  // Databases
  "Mongo DB": { dot: "bg-green-500" },
  PostgreSQL: { dot: "bg-blue-700" },
  MySQL: { dot: "bg-blue-500" },
  Redis: { dot: "bg-red-600" },

  // DevOps / Cloud
  Docker: { dot: "bg-blue-500" },
  Kubernetes: { dot: "bg-blue-400" },
  AWS: { dot: "bg-yellow-400" },
  GCP: { dot: "bg-red-400" },
  Azure: { dot: "bg-blue-600" },

  // Tools
  Github: { dot: "bg-orange-400" },
  Git: { dot: "bg-red-500" },
  Postman: { dot: "bg-orange-500" },
  Figma: { dot: "bg-pink-500" },

  // Roles
  "Frontend Developer": { dot: "bg-cyan-500" },
  "Backend Developer": { dot: "bg-purple-500" },
  "Full Stack Developer": { dot: "bg-indigo-500" },
  "DevOps Engineer": { dot: "bg-emerald-500" },
  Internship: { dot: "bg-lime-400" },

  // Companies
  Google: { dot: "bg-red-500" },
  Amazon: { dot: "bg-yellow-500" },
  Microsoft: { dot: "bg-blue-500" },
  Netflix: { dot: "bg-red-600" },
  Meta: { dot: "bg-blue-400" },
};

type ColouredCardsProps = {
  name: TechKey;
};

const colors = {
  priBG: "bg-[#121313]",
  secBG: "bg-[#1E1E1E]",
  primary: "bg-[#6BFBBF]",
  priFont: "text-white",
  secFont: "text-[#B1AAA6]",
};

export default function ColouredCards({ name }: ColouredCardsProps) {
  const tech = techAndColours[name];

  if (!tech) return null;

  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-md ${colors.secBG} ${colors.secFont} font-mono text-sm font-bold max-w-fit`}>
      <span
        className={`w-3 h-3 rounded-full ${tech.dot}`}
      />
      <span>{name}</span>
    </div>
  );
}

