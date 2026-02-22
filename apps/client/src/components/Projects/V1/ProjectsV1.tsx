"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useColors } from "../../General/(Color Manager)/useColors";
import { demoProjectsResponse } from "../../Profile/v1/DemoProjects";
import ProjectCard from "./ProjectCard";
import Spinner from "@/components/General/Spinner";

const PAGE_SIZE = 6;

export default function ProjectsV1() {
  const Colors = useColors();
  const allProjects = demoProjectsResponse.data;

  const [visibleProjects, setVisibleProjects] = useState(
    allProjects.slice(0, PAGE_SIZE)
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const nextItems = allProjects.slice(
        0,
        nextPage * PAGE_SIZE
      );

      setVisibleProjects(nextItems);
      setPage(nextPage);
      setLoading(false);
    }, 2000); // simulate API delay
  }, [page, loading, allProjects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleProjects.length < allProjects.length) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, visibleProjects.length, allProjects.length]);

  return (
    <div
      className={`${Colors.text.primary} ${Colors.background.primary}
      min-h-screen w-full flex flex-col items-center gap-8 py-16`}
    >
      <div
        className={`${Colors.background.secondary}
        w-4/5 mx-auto rounded-xl p-4`}
      >
        <h1 className="text-2xl font-semibold">Projects</h1>
      </div>

      <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Spinner */}
      {loading && (
        <div className="py-2">
          <Spinner />
        </div>
      )}

      {/* Sentinel */}
      <div ref={observerRef} className="h-10" />
    </div>
  );
}