"use client";
import Application from "@/components/Application/Application";
import { useParams } from "next/navigation";
import React from "react";

function page() {
  const param = useParams<{ id: string }>();
  return <Application id={param.id} />;
}

export default page;
