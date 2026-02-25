import { useColors } from "@/components/General/(Color Manager)/useColors";
import { useInterviewer } from "@/store/interviewer-store";
import { useOrgStore } from "@/store/org-store";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import SuiteSidebar from "./SuiteSidebar";
import type { SuiteInfo } from "./SuiteSidebar";
import toast from "react-hot-toast";
import Filter from "./Filter";
import Rounds from "./Rounds";
import RoundForm, { Round } from "./RoundForm";
import { useRouter, useSearchParams } from "next/navigation";
import Applications from "./Applications";
import ApplicationFilter from "./ApplicationFilter";

function InterviewSuiteV1({ id }: { id: string }) {
  const { info: interviewerInfo, hasHydrated } = useInterviewer();
  const { info: orgInfo } = useOrgStore();
  const query = useSearchParams();
  const router = useRouter();
  const colors = useColors();

  const [tab, setTab] = useState(query.get("tab") || "round");
  const [suiteInfo, setSuiteInfo] = useState();

  const [filter, setFilter] = useState<{
    name: string;
    roundType: string;
  }>({
    name: "",
    roundType: "ALL",
  });
  const [applicationFilter, setApplicationFilter] = useState<{
    name: string;
    currentStatus: string;
  }>({
    name: "",
    currentStatus: "ALL",
  });
  const [candidate, setCandidate] = useState([]);
  const [rounds, setRounds] = useState([]);

  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filteredRounds, setFilteredRounds] = useState([]);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrev, setHasPrev] = useState<boolean>(false);

  const nextPage = () => {
    setPage(Math.min(page + 1, totalPage));
  };
  const prevPage = () => {
    setPage(Math.max(page - 1, 0));
  };

  const fetchInfo = async () => {
    const res = await axiosInstance.get(
      "/api/v1/interview/interview-suite/get-details/" + id,
    );

    setSuiteInfo(res.data.data);
  };
  const fetchRound = async () => {
    const res = await axiosInstance.get(
      "/api/v1/interview/interview-suite/round/get-all-suite/" + id,
    );

    setRounds(res.data.data || []);
  };
  const fetchPage = async () => {
    // TODO: fetch all the job application from suite
    //setCandidate
    //setHasNext
    //setTotalPage
    //setHasPrev
  };
  const handlePublish = async (id: string) => {
    try {
      const res = await axiosInstance.put(
        "/api/v1/interview/interview-suite/change-status/" + id,
      );
      if (res.data.statusCode > 200) throw new Error(res.data.message);
      setSuiteInfo(res.data.data);
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.message || "something went wrong");
    }
  };
  const handleUpdate = async (data: SuiteInfo) => {
    if (!suiteInfo) return;
    try {
      const res = await axiosInstance.put(
        "/api/v1/interview/interview-suite/update/" + id,
        {
          name: data.name,
          endDate: data.endDate,
          startDate: data.startDate,
        },
      );
      if (res.data.statusCode > 200) throw new Error(res.data.message);
      setSuiteInfo(res.data.data);
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.message || "something went wrong");
    }
    console.log(data);
  };
  const handleRoundCreation = async (data: Round) => {
    try {
      const res = await axiosInstance.post(
        "/api/v1/interview/interview-suite/round/create/" + id,
        {
          name: data.name,
          description: data.description,
          duration: data.duration,
          roundType: data.roundType,
        },
      );
      if (res.data.statusCode > 200) throw new Error(res.data.message);

      await fetchRound();

      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.message || "something went wrong");
    }
  };

  useEffect(() => {
    if (hasHydrated) {
      fetchInfo();
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (tab === "round") {
      fetchRound();
    } else {
      fetchPage();
    }
  }, [tab]);
  useEffect(() => {
    let data = [...rounds];
    if (data.length === 0) return;

    if (filter.name.length !== 0) {
      data = data.filter((round: Round) => {
        return round.name.includes(filter.name);
      });
    }

    if (filter.roundType.length !== 0 && filter.roundType !== "ALL") {
      data = data.filter((round: Round) => {
        return round.roundType === filter.roundType;
      });
    }
    setFilteredRounds(data || []);
  }, [filter, rounds]);
  useEffect(() => {
    fetchPage();
  }, [page]);
  useEffect(() => {
    let data = [...candidate];
    if (data.length === 0) return;

    //TODO: apply filteration logic here
    setFilteredCandidates(data || []);
  }, [applicationFilter, candidate]);
  return (
    <div
      className={`relative h-screen flex gap-2 ${colors.background.primary}`}
    >
      {showForm && (
        <div className="bg-gray-500">
          <RoundForm
            onClose={() => setShowForm(false)}
            onSubmit={(data) => handleRoundCreation(data)}
          />
        </div>
      )}
      <SuiteSidebar
        onUpdate={(data) => {
          handleUpdate(data);
        }}
        onPublish={() => handlePublish(id)}
        info={suiteInfo}
      />
      <div className={"h-screen w-full" + `${colors.background.primary}`}>
        <div className="w-full flex my-2 justify-evenly items-center">
          <button
            onClick={() => {
              setTab("round");
              const params = new URLSearchParams(query.toString());
              params.set("tab", "round");

              router.push(`?${params.toString()}`);
            }}
            className={`${colors.text.primary} ${colors.border.defaultThin} w-1/2 cursor-pointer ${tab === "round" ? colors.background.special : colors.background.primary} rounded-sm`}
          >
            Rounds
          </button>
          <button
            onClick={() => {
              setTab("application");
              const params = new URLSearchParams(query.toString());
              params.set("tab", "application");

              router.push(`?${params.toString()}`);
            }}
            className={`${colors.text.primary} ${colors.border.defaultThin} w-1/2 cursor-pointer ${tab === "round" ? colors.background.primary : colors.background.special} rounded-sm`}
          >
            Application
          </button>
        </div>
        {tab === "round" && (
          <>
            <Filter
              filter={filter}
              showForm={showForm}
              setFilter={setFilter}
              setShowForm={setShowForm}
            />
            <Rounds filtered={filteredRounds} />
          </>
        )}
        {tab === "application" && (
          <>
            <ApplicationFilter
              filter={applicationFilter}
              setFilter={setApplicationFilter}
            />
            <Applications
              hasNext={hasNext}
              moveNext={() => nextPage()}
              movePrev={() => prevPage()}
              hasPrev={hasPrev}
              filtered={filteredCandidates}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default InterviewSuiteV1;
