import { useInterviewer } from "@/store/interviewer-store";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Loading from "./Loading";
import StartInterview from "./StartInterview";
import JoinInterview from "./JoinInterview";
import { useUserStore } from "@/store/user-store";
import { useEffect, useState } from "react";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";

function InterviewV1() {
  const param = useParams<{ id: string }>();
  const router = useRouter();
  const query = useSearchParams();
  const pathname = usePathname();

  const [storedId, setStoredId] = useState<string | null>(null);
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }),
  );
  useEffect(() => {
    const id = query.get("id");

    if (id) {
      setStoredId(id);

      const params = new URLSearchParams();
      params.delete("id");

      const newUrl = pathname;

      router.replace(newUrl);
    }
  }, [query, pathname, router]);

  const { info: interviewerInfo, hasHydrated: interviewerLoading } =
    useInterviewer();
  const { info: userInfo, hasHydrated: userLoading } = useUserStore();
  if (!interviewerLoading && !userLoading) return <Loading />;
  if (interviewerInfo)
    return (
      <AgoraRTCProvider client={client}>
        <StartInterview
          param={param}
          userData={interviewerInfo}
          isHost={true}
        />
      </AgoraRTCProvider>
    );
  return (
    <AgoraRTCProvider client={client}>
      <JoinInterview param={param} userData={userInfo} isHost={false} />;
    </AgoraRTCProvider>
  );
}

export default InterviewV1;
