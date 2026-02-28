import { useColors } from "@/components/General/(Color Manager)/useColors";
import React, { useState } from "react";
import CandidateRow from "./CandidateRow";
import axiosInstance from "@/utils/axiosInstance";

export type CandidateStatus =
  | "PENDING"
  | "SELECTED_FOR_NEXT"
  | "REJECTED"
  | "ACCEPTED";

export type Candidate = {
  id: string;
  name: string;
  username: string;
  email: string;
  resume: string;
  roundStatus?: CandidateStatus;
};

function Candidates({
  id,
  data,
}: {
  id: string;
  data: { id: string; roundStatus: CandidateStatus; candidate: Candidate }[];
}) {
  const colors = useColors();

  const updateStatus = async (username: string, status: CandidateStatus) => {
    // update candidate
    await axiosInstance.put(
      `/api/v1/interview/interview-suite/round/update-status/${id}/${username}`,
      {
        status,
      },
    );
    console.log(username, status);
  };

  console.log("DATA in candidate: " + JSON.stringify(data));

  if (!data.length) {
    return (
      <div
        className={`p-8 w-[80%] mx-auto mt-3 rounded-xl text-center ${colors.background.secondary} ${colors.border.fadedThin}`}
      >
        <p className={`text-lg font-semibold ${colors.text.primary}`}>
          No Candidates Found
        </p>
        <p className={`text-sm ${colors.text.secondary} mt-2`}>
          There are no applicants yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-[95%] mx-auto mt-3 overflow-x-auto rounded-xl ${colors.background.primary} ${colors.text.primary} ${colors.border.defaultThin}`}
    >
      <table className="w-full text-sm">
        <thead
          className={`${colors.background.secondary} ${colors.border.fadedThinBottom}`}
        >
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Username</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Resume</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((data, index) => (
            <CandidateRow
              key={index}
              id={data.id}
              data={data}
              onStatusChange={updateStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Candidates;
