"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import Spinner from "@/components/General/Spinner";

type JobListingModal = {
  id: string;
  name: string;
  username: string;
  email: string;
};

export default function JobListingModal() {
  const Colors = useColors();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [jobListings, setJobListings] = useState<JobListingModal[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchJobListings() {
    try {
      const res = await axios.get(
        `${backendUrl}/api/v1/organizations/job-listings`,
        { withCredentials: true }
      );

      setJobListings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch job listings", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobListings();
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${Colors.background.primary} rounded-xl ${Colors.border.defaultThin}`}>
      <div className="flex justify-between items-center p-4">
        <h2 className={`text-xl font-semibold ${Colors.text.primary}`}>
          Job Listings
        </h2>
      </div>

      <div className={`${Colors.border.defaultThinBottom}`} />

      <div className="p-4 overflow-y-auto flex-1">
        {loading ? (
          <Spinner size={28} thickness={3} />
        ) : jobListings.length === 0 ? (
          <p className={`${Colors.text.secondary}`}>
            No job listings found
          </p>
        ) : (
          <div className="space-y-3">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className={`
                    ${Colors.background.secondary}
                    ${Colors.border.defaultThin}
                    rounded-lg
                    p-3
                  `}
              >
                <div className="font-semibold">{job.name}</div>
                <div className={`text-xs ${Colors.text.secondary}`}>
                  @{job.username}
                </div>
                <div className="text-sm">{job.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}