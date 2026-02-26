import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import RoundSidebar from "./RoundSidebar";
import Candidates from "./Candidates";
import Interviews from "./Interviews";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import CandidateFilter from "./CandidateFilter";
import InterviewFilter from "./InterviewFilter";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { useRouter } from "next/navigation";
import InterviewCreationFrom from "./InterviewCreationFrom";

function InterviewRoundV1({ id }: { id: string }) {
  const query = useSearchParams();
  const colors = useColors();
  const router = useRouter();

  const [info, setInfo] = useState();
  const [interviewForm, showInterviewForm] = useState<boolean>(false);
  const [tab, setTab] = useState(query.get("tab") || "candidates");
  const [candidates, setCandidate] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [candidateFilter, setCandidateFilter] = useState<{
    name: string;
    status: string;
  }>({
    name: "",
    status: "ALL",
  });
  const [interviewFilter, setInterviewFilter] = useState<{
    name: string;
    status: string;
  }>({
    name: "",
    status: "ALL",
  });

  const [filteredCandidates, setFilterCandidates] = useState([]);
  const [filteredInterviews, setFilterInterviews] = useState([]);

  const fetchInfo = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/v1/interview/interview-suite/round/get-details/" + id,
      );
      if (res.data.statusCode > 200) throw new Error(res.data.message);

      console.log(res.data.data);
      setInfo(res.data.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const fetchCandidates = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/v1/interview/interview-suite/round/candidate/" + id,
      );
      if (res.data.statusCode > 200) throw new Error(res.data.message);

      setCandidate(res.data.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const fetchInterviews = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/v1/interview/interview-suite/round/candidate/" + id,
      );
      if (res.data.statusCode > 200) throw new Error(res.data.message);

      setInterviews(res.data.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleDelete = async () => {};
  const handleUpdate = async (data: any) => {};
  const handleInterviewCreation = async (data: any) => {};
  useEffect(() => {
    let data = [...candidates];
    if (data.length === 0) return;

    if (candidateFilter.name.trim().length !== 0) {
      //TODO: implement filtering
    }
    setFilterCandidates(data);
  }, [candidates, candidateFilter]);
  useEffect(() => {
    let data = [...interviews];
    if (data.length === 0) return;

    if (candidateFilter.name.trim().length !== 0) {
      //TODO: implement filtering
    }
    setFilterCandidates(data);
  }, [interviews, interviewFilter]);
  useEffect(() => {
    fetchInfo();
  }, []);
  useEffect(() => {
    if (tab === "interviews") {
      fetchInterviews();
    } else {
      fetchCandidates();
    }
  }, [tab]);
  return (
    <div className={`relative h-screen flex ${colors.background.primary}`}>
      {interviewForm && (
        <InterviewCreationFrom
          onClose={() => showInterviewForm(false)}
          onSubmit={(data) => handleInterviewCreation(data)}
          candidates={[
            {
              id: "cand_001",
              name: "Aarav Sharma",
              username: "aarav.dev",
              email: "aarav.sharma@example.com",
              profileUrl: "https://randomuser.me/api/portraits/men/32.jpg",
              headline: "Full Stack Developer | MERN",
            },
          ]}
        />
      )}
      <aside className="w-90 min-w-90 max-w-90 h-full shrink-0">
        <RoundSidebar
          info={info as any}
          onUpdate={(data) => handleUpdate(data)}
          onDelete={() => handleDelete()}
        />
      </aside>
      <div className="w-full">
        <div className="w-full flex my-2 justify-evenly items-center px-4">
          <button
            onClick={() => {
              setTab("candidates");
              const params = new URLSearchParams(query.toString());
              params.set("tab", "candidates");
              router.push(`?${params.toString()}`);
            }}
            className={`${colors.text.primary} ${colors.border.defaultThin} w-1/2 cursor-pointer ${
              tab === "candidates"
                ? colors.background.special
                : colors.background.primary
            } rounded-sm`}
          >
            candidates
          </button>

          <button
            onClick={() => {
              setTab("interviews");
              const params = new URLSearchParams(query.toString());
              params.set("tab", "interviews");
              router.push(`?${params.toString()}`);
            }}
            className={`${colors.text.primary} ${colors.border.defaultThin} w-1/2 cursor-pointer ${
              tab === "interviews"
                ? colors.background.special
                : colors.background.primary
            } rounded-sm`}
          >
            Interviews
          </button>
        </div>
        {tab === "candidates" && (
          <>
            <CandidateFilter
              filter={candidateFilter}
              setFilter={setCandidateFilter}
            />
            <Candidates data={filteredCandidates} />
          </>
        )}
        {tab === "interviews" && (
          <>
            <InterviewFilter
              showInterviewForm={showInterviewForm}
              filter={interviewFilter}
              setFilter={setInterviewFilter}
            />
            <Interviews data={filteredInterviews} />
          </>
        )}
      </div>
    </div>
  );
}

export default InterviewRoundV1;
