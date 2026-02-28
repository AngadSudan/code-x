import React from "react";
import { Experience } from "./ApplicationV1";
import { useColors } from "@/components/General/(Color Manager)/useColors";
function NoExperience() {
  const colors = useColors();

  return (
    <div
      className={`w-full rounded-xl p-8 text-center ${colors.background.secondary} ${colors.border.fadedThin}`}
    >
      <p className={`text-lg font-semibold ${colors.text.primary}`}>
        No Experience Added
      </p>
      <p className={`mt-2 text-sm ${colors.text.primary}`}>
        Add your professional experience to showcase your journey.
      </p>
    </div>
  );
}

function ExperienceCard({ experience }: { experience: Experience[] }) {
  const colors = useColors();

  if (!experience || experience.length === 0) {
    return <NoExperience />;
  }

  return (
    <div className="space-y-6">
      {experience.map((exp) => {
        const startDate = new Date(exp.startDate).toLocaleDateString();
        const endDate = exp.endDate
          ? new Date(exp.endDate).toLocaleDateString()
          : "Present";

        return (
          <div
            key={exp.id}
            className={`w-full rounded-xl p-6 shadow-sm ${colors.background.primary} ${colors.border.defaultThin}`}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className={`text-xl font-bold ${colors.text.primary}`}>
                  {exp.jobTitle}
                </h3>
                <p className={`text-md ${colors.text.primary}`}>
                  {exp.companyName}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    exp.isOngoing === "ONGOING"
                      ? `${colors.background.special} ${colors.text.inverted}`
                      : `${colors.border.greenThin} ${colors.text.primary}`
                  }`}
                >
                  {exp.isOngoing}
                </span>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${colors.background.accent} ${colors.text.inverted}`}
                >
                  {exp.jobType}
                </span>
              </div>
            </div>

            {/* Duration */}
            <p className={`mt-3 text-sm ${colors.text.primary}`}>
              {startDate} - {endDate}
            </p>

            {/* Description */}
            <p
              className={`mt-4 text-sm leading-relaxed ${colors.text.primary}`}
            >
              {exp.jobDescription}
            </p>

            {/* Documents */}
            {(exp.offerLetter || exp.completionCertifiate) && (
              <div className="mt-5 flex gap-3 flex-wrap">
                {exp.offerLetter && (
                  <a
                    href={exp.offerLetter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg text-sm ${colors.background.secondary} ${colors.border.fadedThin} ${colors.properties.interactiveButton}`}
                  >
                    View Offer Letter
                  </a>
                )}

                {exp.completionCertifiate && (
                  <a
                    href={exp.completionCertifiate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg text-sm ${colors.background.secondary} ${colors.border.fadedThin} ${colors.properties.interactiveButton}`}
                  >
                    View Certificate
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ExperienceCard;
