import { useColors } from "@/components/General/(Color Manager)/useColors";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export type InterviewCandidate = {
  name: string;
  username: string;
  email: string;
  profileUrl: string;
};

export type Interview = {
  slug: string;
  id: string;
  roundCandidate: {
    candidate: InterviewCandidate;
  };
  interviewStatus: "PENDING" | "SELECTED_FOR_NEXT" | "REJECTED" | "ACCEPTED";
};

function Interviews({ data }: { data: Interview[] }) {
  const colors = useColors();
  const router = useRouter();
  if (!data?.length) {
    return (
      <div
        className={`p-8 w-[80%] mx-auto mt-3 rounded-xl text-center ${colors.background.secondary} ${colors.border.fadedThin}`}
      >
        <p className={`text-lg font-semibold ${colors.text.primary}`}>
          No Interviews Found
        </p>
        <p className={`text-sm ${colors.text.secondary} mt-2`}>
          There are no scheduled interviews yet.
        </p>
      </div>
    );
  }
  const handleInterviewStart = async (id: string, slug: string) => {
    try {
      if (!id) return;
      const res = await axiosInstance.put(
        "/api/v1/interview/interview-suite/interview/start/" + id,
      );
      if (res.data.statusCode > 200) throw new Error(res.data.message);
      toast.success("starting interview");
      router.push(`/interview/${slug}?slug=${slug}&id=${id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div
      className={`w-[95%] mx-auto mt-3 overflow-x-auto rounded-xl ${colors.background.primary} ${colors.text.primary} ${colors.border.defaultThin}`}
    >
      <table className="w-full text-sm">
        <thead
          className={`${colors.background.secondary} ${colors.border.fadedThinBottom}`}
        >
          <tr>
            <th className="p-4 text-left">Profile</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Username</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Slug</th>
            <th className="p-4 text-left">Interview Status</th>
            <th className="p-4 text-left">Start Interview</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => {
            const candidate = item.roundCandidate.candidate;

            return (
              <tr key={index} className={`border-t ${colors.border.fadedThin}`}>
                <td className="p-4">
                  <img
                    src={candidate.profileUrl}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                <td className="p-4 font-medium">{candidate.name}</td>

                <td className="p-4">{candidate.username}</td>

                <td className="p-4">{candidate.email}</td>

                <td className="p-4">{item.slug}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.background.secondary}`}
                  >
                    {item.interviewStatus}
                  </span>
                </td>
                <td className="p-4">
                  {item.interviewStatus === "PENDING" ? (
                    <button
                      onClick={() => handleInterviewStart(item.id, item.slug)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer bg-green-400 text-white`}
                    >
                      Start Interview
                    </button>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Interviews;
