import { useColors } from "@/components/General/(Color Manager)/useColors";
import Sidebar from "@/components/General/Sidebar";
import { useInterviewer } from "@/store/interviewer-store";
import { useOrgStore } from "@/store/org-store";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import DisplaySuites from "./DisplaySuites";
import Filter from "./Filter";
import { Suite, SuiteFilters } from "@/utils/type";
import { useRef } from "react";

function AllSuitesV1() {
  const themes = useColors();
  const { info: interviewInfo, hasHydrated } = useInterviewer();
  const { info: orgInfo } = useOrgStore();

  // latest fetched version
  const [interviewSuites, setInterviewSuites] = useState<Suite[]>([]);
  const [filteredData, setFilteredData] = useState<Suite[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [filters, setFilters] = useState<SuiteFilters>({
    search: "",
    publishStatus: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    const fetchSuites = async () => {
      if (!interviewInfo?.id && !orgInfo?.id) {
        return;
      }

      const id = interviewInfo?.id || orgInfo?.id;
      const res = await axiosInstance.get(
        "/api/v1/interview/interview-suite/get-all-suite/" + id,
      );

      setInterviewSuites(res.data.data);
    };
    if (hasHydrated) {
      fetchSuites();
    }
  }, [hasHydrated, interviewInfo?.id]);

  useEffect(() => {
    let data = [...interviewSuites];
    if (data.length === 0) return;

    if (filters.search.trim()) {
      data = data.filter((suite) =>
        suite.name.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.publishStatus !== "ALL") {
      data = data.filter(
        (suite) => suite.publishStatus === filters.publishStatus,
      );
    }

    if (filters.startDateFrom) {
      data = data.filter(
        (suite) =>
          new Date(suite.startDate) >= new Date(filters.startDateFrom!),
      );
    }

    if (filters.startDateTo) {
      data = data.filter(
        (suite) => new Date(suite.startDate) <= new Date(filters.startDateTo!),
      );
    }

    // ↕ Sorting
    data.sort((a, b) => {
      const fieldA = a[filters.sortBy];
      const fieldB = b[filters.sortBy];

      if (fieldA < fieldB) return filters.sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(data);
  }, [filters, interviewSuites]);

  useEffect(() => {
    if (!interviewInfo?.id && !orgInfo?.id) return;

    const id = interviewInfo?.id || orgInfo?.id;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axiosInstance.post(
          "/api/v1/interview/suite/filter/" + id,
          filters,
        );

        setFilteredData(res.data.data);
      } catch (err) {
        console.error("Filter API error", err);
      }
    }, 500); // 500ms debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters]);
  console.log(filteredData);
  return (
    <div className={`h-screen flex gap-4 ${themes.background.secondary}`}>
      <Sidebar />
      <div className="w-full">
        <Filter filters={filters} setFilters={setFilters} />
        <DisplaySuites suites={filteredData} />
      </div>
    </div>
  );
}

export default AllSuitesV1;
