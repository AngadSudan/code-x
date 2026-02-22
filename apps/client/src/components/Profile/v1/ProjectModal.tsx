import React, { useEffect, useRef } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import Link from "next/link";
import { X } from "lucide-react";

function ProjectModal({ project, onClose }: any) {
  const Colors = useColors();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div onMouseDown={handleOutsideClick} className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div ref={modalRef} onMouseDown={(e) => e.stopPropagation()}
        className={`relative w-[90%] max-w-6xl h-3/4 rounded-2xl flex flex-col p-6 ${Colors.background.primary}`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-4 rounded-lg mb-4 ${Colors.background.secondary}`}
        >
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={onClose}
              className={`${Colors.text.primary} font-semibold hover:text-red-500 rounded ${Colors.properties.interactiveButton}`}
            >
              <X size={28} />
            </button>
          </div>
        </div>

        <div className=" flex-1 grid grid-cols-3 gap-4 h-fit">
          {/* Left Column */}
          <div className={`col-span-1 flex flex-col justify-between ${Colors.background.secondary} p-4 rounded-lg`}>
            <div>
              <h3 className={`text-lg mb-2 ${Colors.border.defaultThinBottom}`}>Description</h3>
              <p className="text-sm opacity-80">{project.description}</p>
            </div>

            <div>
              <ul className={`text-sm`}>
                <li>Start Date: {new Date(project.startDate).toLocaleDateString()}</li>
                <li>End Date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"}</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-white/30 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Project Snippets */}
          <div className={`col-span-2 ${Colors.background.secondary} p-3 rounded-lg`}>
            <div className={`flex justify-between mb-2 rounded-lg`}>
              <h3 className="text-lg">Project Snippets</h3>
              <div className="flex gap-2 justify-center items-center">
                {project.repositoryUrl && (
                  <Link
                    href={project.repositoryUrl}
                    target="_blank"
                    className={`px-3 py-1 ${Colors.text.primary} ${Colors.background.accent} ${Colors.properties.interactiveButton} rounded-md font-semibold`}
                  >
                    Project Repo
                  </Link>
                )}
                {project.projectUrl && (
                  <Link
                    href={project.projectUrl}
                    target="_blank"
                    className={`px-3 py-1 ${Colors.text.inverted} ${Colors.background.special} ${Colors.properties.interactiveButton} rounded-md font-semibold`}
                  >
                    Visit Project
                  </Link>
                )}
              </div>
            </div>

            <div>
              {project.projectMedias.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {project.projectMedias.map((media: any, index: number) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <img src={media.url} alt={media.alt || "Project Media"} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-80">No project media available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;