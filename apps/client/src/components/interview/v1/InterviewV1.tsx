import { useInterviewer } from "@/store/interviewer-store";
import { useParams } from "next/navigation";
import Loading from "./Loading";
import StartInterview from "./StartInterview";
import JoinInterview from "./JoinInterview";
import { useUserStore } from "@/store/user-store";

function InterviewV1() {
  const param = useParams<{ id: string }>();
  const { info: interviewerInfo, hasHydrated: interviewerLoading } =
    useInterviewer();
  const { info: userInfo, hasHydrated: userLoading } = useUserStore();
  if (!interviewerLoading && !userLoading) return <Loading />;
  if (interviewerInfo)
    return (
      <StartInterview param={param} userData={interviewerInfo} isHost={true} />
    );
  return <JoinInterview param={param} userData={userInfo} isHost={false} />;
}

export default InterviewV1;
