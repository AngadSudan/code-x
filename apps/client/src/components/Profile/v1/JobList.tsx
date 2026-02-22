"use client";

import { use, useState } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { demoProjectsResponse } from "./DemoProjects";
import ProjectModal from "./ProjectModal";
import JobCard from "./JobCard";
import { useRouter } from "next/navigation";

export default function JobList() {
  const Colors = useColors();
  const NO_OF_PROJECTS_TO_SHOW = 5;
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const allProjects = demoProjectsResponse.data;
  const shown_projects = allProjects.slice(0, NO_OF_PROJECTS_TO_SHOW);
  const router = useRouter();

  function redirectToProjects() {
    router.push("/projects");
  }

  return (
    <div className={`${Colors.text.primary} font-mono p-2`}>
      <h1 className="text-2xl">John Doe's Projects</h1>
      <div className={`${Colors.border.defaultThinBottom} mb-3`} />

      <div className="h-65 overflow-y-auto">
        <ul>
          {shown_projects.map((project) => (
            <li key={project.id}>
              <JobCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </li>
          ))}
        </ul>
      </div>

      {allProjects.length > NO_OF_PROJECTS_TO_SHOW && (
        <div onClick={redirectToProjects} className={`text-sm text-center mt-2 ${Colors.text.secondary} cursor-pointer hover:opacity-80 hover:underline`}>
          And {allProjects.length - NO_OF_PROJECTS_TO_SHOW} more
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}