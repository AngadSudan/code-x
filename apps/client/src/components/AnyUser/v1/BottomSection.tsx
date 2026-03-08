"use client";

import React from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { Building2, Calendar } from "lucide-react";
import ProjectCardV2 from "@/components/Profile/v1/ProjectCardV2";

interface fnHandler {
  project: any[];
  experience: any[];
}

function BottomSection({ project, experience }: fnHandler) {
  const Colors = useColors();

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 w-full">
      {/* Projects */}
      <div
        className={`${Colors.background.primary} rounded-xl p-4 xl:col-span-2`}
      >
        <h2 className={`${Colors.text.primary} font-mono text-lg mb-4`}>
          Projects
        </h2>

        {project && project.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.map((proj) => (
              <ProjectCardV2 key={proj.id} project={proj} />
            ))}
          </div>
        ) : (
          <p className={`${Colors.text.secondary} font-mono text-sm`}>
            No projects added yet.
          </p>
        )}
      </div>

      {/* Experience */}
      <div className={`${Colors.background.primary} rounded-xl p-4`}>
        <h2 className={`${Colors.text.primary} font-mono text-lg mb-4`}>
          Experience
        </h2>

        {experience && experience.length > 0 ? (
          <div className="space-y-4">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className={`${Colors.background.secondary} rounded-lg p-4 ${Colors.border.defaultThin}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`${Colors.text.primary} font-semibold`}>
                      {exp.jobTitle}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <Building2 size={14} className={Colors.text.secondary} />
                      <span className={`${Colors.text.secondary} text-sm`}>
                        {exp.companyName}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-md ${Colors.background.primary} ${Colors.text.secondary}`}
                  >
                    {exp.jobType}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3 text-sm">
                  <Calendar size={14} className={Colors.text.secondary} />
                  <span className={Colors.text.secondary}>
                    {formatDate(exp.startDate)} -{" "}
                    {exp.isOngoing === "ONGOING"
                      ? "Present"
                      : formatDate(exp.endDate)}
                  </span>
                </div>

                <p
                  className={`${Colors.text.secondary} text-sm mt-3 line-clamp-4`}
                >
                  {exp.jobDescription}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className={`${Colors.text.secondary} font-mono text-sm`}>
            No experience added yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default BottomSection;
