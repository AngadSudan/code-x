"use client";
import AnyUser from "@/components/AnyUser/AnyUser";
import { useParams } from "next/navigation";
import React from "react";

function page() {
  const params = useParams<{ id: string }>();
  return <AnyUser username={params.id} />;
}

export default page;
