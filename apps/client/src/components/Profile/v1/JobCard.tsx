import { useColors } from "@/components/General/(Color Manager)/useColors";

function JobCard({ project, onClick }: any) {
  const Colors = useColors();
  const { title, coverImage, skills, startDate, endDate } = project;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-lg overflow-hidden h-22 m-2
      ${!coverImage ? Colors.background.secondary : ""}
      hover:scale-[1.02] transition-transform duration-200`}
    >
      {coverImage && (
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
        {coverImage && <div className="absolute inset-0 bg-black/40" />}

      <div className="relative z-10 h-full flex flex-col justify-between py-2 px-3 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-xs">
            {new Date(startDate).toLocaleDateString()} -{" "}
            {endDate ? new Date(endDate).toLocaleDateString() : "Ongoing"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="bg-white/20 backdrop-blur-sm text-xs px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobCard;