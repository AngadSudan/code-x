import { useColors } from "@/components/General/(Color Manager)/useColors";
import axiosInstance from "@/utils/axiosInstance";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SiCodeforces, SiLeetcode } from "react-icons/si";
import { FaHospitalUser, FaMediumM } from "react-icons/fa";
import { useRouter } from "next/router";
import GithubCard from "./GithubCard";
import LeetCodeCard from "./LeetCodeCard";
import CodeforcesCard from "./CodeforcesCard";
import ExperienceCard from "./ExperienceCard";

export interface Experience {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  offerLetter: string;
  completionCertifiate: string;
  startDate: string;
  endDate: string;
  userId: string;
  isOngoing: string;
  jobType: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  resume: string;
  userInfo: string;
  headline: string;
  profileUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  leetcodeUrl: string;
  codeForcesUrl: string;
  mediumUrl: string;
  portfolioUrl: string;
  userExperiences: Experience[];
}

interface JobApplication {
  id: string;
  resume: string;
  currentStatus: string;
}

interface ExternalLink {
  leetcode: any;
  github: {
    profileInfo: Object;
    repo: any[];
  };
  codeforces: Object;
}

interface GetApplicationResponse {
  statusCode: number;
  message: string;
  data: {
    application: JobApplication;
    userInfo: User;
  };
}

const getColor = (status: string) => {
  let colors = "";
  switch (status) {
    case "UNDER_REVIEW":
      colors = "bg-yellow-500 text-white";
      break;
    case "ACCEPTED":
      colors = "bg-green-500 text-white";
      break;
    case "REJECTED":
      colors = "bg-red-500 text-white";
      break;
  }
  return colors;
};

function ApplicationV1({ id }: { id: string }) {
  const colors = useColors();
  const [tabs, setTabs] = useState("experience");
  const [applicationInfo, setApplicationInfo] = useState<JobApplication | null>(
    null,
  );
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [platformData, setPlatformData] = useState<ExternalLink | null>(null);
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get<GetApplicationResponse>(
        "/api/v1/interview/interview-suite/application/get-application/" + id,
      );

      if (res.data.statusCode > 200) {
        throw new Error(res.data.message);
      }

      setApplicationInfo(res.data.data.application);
      setUserInfo(res.data.data.userInfo);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchPlatformData = async () => {
    try {
      if (!userInfo) return;
      const res = await axiosInstance.post(
        "/api/v1/interview/interview-suite/round/candidate/platform-link",
        {
          url: {
            leetcodeUrl: userInfo?.leetcodeUrl,
            codeforcesUrl: userInfo?.codeForcesUrl,
            mediumUrl: userInfo?.mediumUrl,
            githubUrl: userInfo?.githubUrl,
          },
        },
      );

      if (res.data.statusCode > 200) {
        throw new Error(res.data.message);
      }

      setPlatformData(res.data.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAccept = async () => {
    try {
      if (!userInfo) return;
      const res = await axiosInstance.post(
        `/api/v1/interview/interview-suite/application/${id}/select`,
      );

      if (res.data.statusCode > 200) {
        throw new Error(res.data.message);
      }

      setApplicationInfo(res.data.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleReject = async () => {
    try {
      if (!userInfo) return;
      const res = await axiosInstance.post(
        `/api/v1/interview/interview-suite/application/${id}/reject`,
      );

      if (res.data.statusCode > 200) {
        throw new Error(res.data.message);
      }
      console.log(res.data.data);
      setApplicationInfo(res.data.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [id]);
  useEffect(() => {
    fetchPlatformData();
  }, [userInfo]);

  if (loading) {
    return (
      <div className={`p-6 ${colors.text.primary}`}>Loading application...</div>
    );
  }

  if (!userInfo || !applicationInfo) {
    return (
      <div
        className={`h-screen flex gap-6 p-6 rounded-2xl animate-pulse ${colors.background.primary}`}
      >
        {/* LEFT SKELETON */}
        <div
          className={`w-90 p-5 rounded-xl space-y-4 ${colors.background.secondary}`}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-gray-300 opacity-40" />
            <div className="h-4 w-32 bg-gray-300 opacity-40 rounded" />
            <div className="h-3 w-24 bg-gray-300 opacity-30 rounded" />
            <div className="h-3 w-28 bg-gray-300 opacity-30 rounded" />
          </div>

          <div className="space-y-2 pt-4">
            <div className="h-3 w-32 bg-gray-300 opacity-30 rounded" />
            <div className="h-3 w-28 bg-gray-300 opacity-30 rounded" />
          </div>

          <div className="flex gap-3 pt-6">
            <div className="flex-1 h-9 rounded-lg bg-gray-300 opacity-40" />
            <div className="flex-1 h-9 rounded-lg bg-gray-300 opacity-40" />
          </div>
        </div>

        {/* RIGHT SKELETON */}
        <div
          className={`flex-1 p-5 rounded-xl space-y-6 ${colors.background.secondary}`}
        >
          <div>
            <div className="h-4 w-28 bg-gray-300 opacity-40 rounded mb-4" />
            <div className="h-3 w-40 bg-gray-300 opacity-30 rounded" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${colors.background.primary}`}
              >
                <div className="flex justify-between">
                  <div className="h-4 w-48 bg-gray-300 opacity-40 rounded" />
                  <div className="h-3 w-24 bg-gray-300 opacity-30 rounded" />
                </div>
                <div className="h-3 w-full bg-gray-300 opacity-30 rounded mt-3" />
                <div className="h-3 w-3/4 bg-gray-300 opacity-20 rounded mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-full  flex gap-6 p-6 rounded-2xl ${colors.background.primary} ${colors.text.primary}`}
    >
      {/* ================= LEFT SIDEBAR ================= */}
      <div
        className={`relative w-90 h-full p-5 rounded-xl space-y-4 ${colors.background.secondary} ${colors.border.defaultThin}`}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={userInfo.profileUrl}
            alt={userInfo.name}
            className="w-24 h-24 rounded-full object-cover mb-3"
          />
          <h2 className={`text-xl font-semibold ${colors.text.primary}`}>
            {userInfo.name}
          </h2>
          <p className="text-sm">{userInfo.headline}</p>
          <p className="text-sm opacity-70">{userInfo.email}</p>
          <p
            className={"text-md opacity-70 " + `${colors.background.secondary}`}
          >
            {userInfo.userInfo}
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <p>
            <span className="font-medium">Username:</span> {userInfo.username}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`font-medium ${getColor(applicationInfo.currentStatus)}`}
            ></span>
            {applicationInfo.currentStatus}
          </p>
          <div className="grid grid-cols-3 items-center gap-3 mt-3">
            {userInfo.linkedinUrl && (
              <Link
                href={userInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
        ${colors.text.primary}
        ${colors.border.defaultThin}
        ${colors.hover.special}
        ${colors.properties.interactiveButton}
        w-10 h-10
        flex items-center justify-center
        rounded-full
        transition-all
      `}
              >
                <Linkedin size={18} />
              </Link>
            )}

            {userInfo.githubUrl && (
              <Link
                href={userInfo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
        ${colors.text.primary}
        ${colors.border.defaultThin}
        ${colors.hover.special}
        ${colors.properties.interactiveButton}
        w-10 h-10
        flex items-center justify-center
        rounded-full
      `}
              >
                <Github size={18} />
              </Link>
            )}

            {userInfo.leetcodeUrl && (
              <Link
                href={userInfo.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
        ${colors.text.primary}
        ${colors.border.defaultThin}
        ${colors.hover.special}
        ${colors.properties.interactiveButton}
        w-10 h-10
        flex items-center justify-center
        rounded-full
      `}
              >
                <SiLeetcode size={18} />
              </Link>
            )}

            {userInfo.codeForcesUrl && (
              <Link
                href={userInfo.codeForcesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
        ${colors.text.primary}
        ${colors.border.defaultThin}
        ${colors.hover.special}
        ${colors.properties.interactiveButton}
        w-10 h-10
        flex items-center justify-center
        rounded-full
      `}
              >
                <SiCodeforces size={18} />
              </Link>
            )}

            {userInfo.portfolioUrl && (
              <Link
                href={userInfo.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
        ${colors.text.primary}
        ${colors.border.defaultThin}
        ${colors.hover.special}
        ${colors.properties.interactiveButton}
        w-10 h-10
        flex items-center justify-center
        rounded-full
      `}
              >
                <FaHospitalUser size={18} />
              </Link>
            )}

            {userInfo.mediumUrl && (
              <Link
                href={userInfo.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
        ${colors.text.primary}
        ${colors.border.defaultThin}
        ${colors.hover.special}
        ${colors.properties.interactiveButton}
        w-10 h-10
        flex items-center justify-center
        rounded-full
      `}
              >
                <FaMediumM size={18} />
              </Link>
            )}
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-3 ${colors.text.primary}`}>
            Resume
          </h3>

          <Link
            href={applicationInfo.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={`${colors.background.special} p-2 w-[90%] rounded-md`}
          >
            View Resume
          </Link>
        </div>
        {/* Action Buttons */}
        <div className="absolute bottom-10 pt-6 w-[90%] flex flex-col gap-3">
          {(applicationInfo.currentStatus === "ACCEPTED" ||
            applicationInfo.currentStatus === "UNDER_REVIEW") && (
            <button
              onClick={handleReject}
              className={`flex-1 py-2 rounded-lg bg-red-500 text-white  ${colors.border.defaultThin} ${colors.properties.interactiveButton}`}
            >
              Reject
            </button>
          )}
          {(applicationInfo.currentStatus === "REJECTED" ||
            applicationInfo.currentStatus === "UNDER_REVIEW") && (
            <button
              onClick={handleAccept}
              className={`flex-1 py-2 rounded-lg ${colors.background.special} ${colors.text.primary} ${colors.properties.interactiveButton}`}
            >
              Accept
            </button>
          )}
        </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div
        className={`flex-1 p-5 rounded-xl space-y-6 ${colors.background.secondary} ${colors.border.defaultThin}`}
      >
        <div
          className={`"w-full flex justify-evenly text-center ${colors.text.primary}`}
        >
          {userInfo.githubUrl && (
            <button
              onClick={() => setTabs("github")}
              className={`${tabs === "github" ? `${colors.background.special} rounded-md px-2 ` : `${colors.background.secondary}`}`}
            >
              github
            </button>
          )}
          {userInfo.leetcodeUrl && (
            <button
              onClick={() => setTabs("leetcode")}
              className={`${tabs === "leetcode" ? `${colors.background.special} rounded-md px-2 ` : `${colors.background.secondary}`}`}
            >
              leetcode
            </button>
          )}
          {userInfo.codeForcesUrl && (
            <button
              onClick={() => setTabs("codeforces")}
              className={`${tabs === "codeforces" ? `${colors.background.special} rounded-md px-2 ` : `${colors.background.secondary}`}`}
            >
              Codeforces
            </button>
          )}
          <button
            onClick={() => setTabs("experience")}
            className={`${tabs === "experience" ? `${colors.background.special} rounded-md px-2 ` : `${colors.background.secondary}`}`}
          >
            Experience
          </button>
        </div>
        <div className="h-[80%] my-auto">
          {tabs === "github" && (
            <GithubCard
              url={userInfo.githubUrl}
              data={platformData?.github as any}
            />
          )}
          {tabs === "leetcode" && (
            <LeetCodeCard
              url={userInfo.leetcodeUrl}
              data={platformData?.leetcode}
            />
          )}
          {tabs === "codeforces" && (
            <CodeforcesCard
              url={userInfo.codeForcesUrl}
              data={platformData?.codeforces}
            />
          )}
          {tabs === "experience" && (
            <ExperienceCard experience={userInfo.userExperiences || []} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationV1;
