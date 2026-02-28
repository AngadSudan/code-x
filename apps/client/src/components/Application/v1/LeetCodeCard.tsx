import axios from "axios";
import React, { useEffect, useState } from "react";
import FailedToFetch from "./FailedToFetch";

function LeetCodeCard({ url, data }: { url: string; data: any }) {
  if (!data)
    return (
      <FailedToFetch
        message={"Failed to fetch Data"}
        onRetry={() => window.location.replace(new URL(url))}
      />
    );

  return <div>{JSON.stringify(data)}</div>;
}

export default LeetCodeCard;
