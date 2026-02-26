"use client";
import InterviewRound from "@/components/InterviewRound/InterviewRound";
import { useParams } from "next/navigation";
import React from "react";

function page() {
  const param = useParams<{ id: string }>();
  return <InterviewRound id={param.id} />;
}

export default page;
