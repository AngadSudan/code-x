"use client";

import React from "react";
import { useColors } from "../../General/(Color Manager)/useColors";

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  skills: string[];
  isOngoing: boolean;
  publishStatus: "PUBLISHED" | "DRAFT";
}

export default function ProjectCard({ project }: { project: Project }) {
  const Colors = useColors();

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        ${Colors.background.secondary}
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:shadow-2xl
      `}
    >
      {/* Background Image */}
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-700 ease-out
                     group-hover:scale-110"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative p-6 flex flex-col justify-end h-72">
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`
              px-3 py-1 text-xs font-medium rounded-full backdrop-blur-md
              ${
                project.publishStatus === "PUBLISHED"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
              }
            `}
          >
            {project.publishStatus === "PUBLISHED"
              ? project.isOngoing
                ? "Live • Ongoing"
                : "Live"
              : "Draft"}
          </span>
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-semibold tracking-tight mb-2 ${Colors.text.primary}`}
        >
          {project.title}
        </h2>

        {/* Description */}
        <p
          className={`text-sm line-clamp-2 mb-4 opacity-80 ${Colors.text.secondary}`}
        >
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="
                text-xs px-3 py-1 rounded-full
                bg-white/10 backdrop-blur-md
                border border-white/10
                text-white/80
                transition duration-300
                group-hover:bg-white/20
              "
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Luxury Border Glow */}
      <div
        className="
          absolute inset-0 rounded-2xl
          border border-white/10
          pointer-events-none
        "
      />
    </div>
  );
}