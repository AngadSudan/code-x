import React from "react";
import Link from "next/link";
import { Application } from "./Applications";
import { useColors } from "@/components/General/(Color Manager)/useColors";

interface ApplicationCardProps {
  data: any;
}

const getColor = (status: string) => {
  switch (status) {
    case "UNDER_REVIEW":
      return "bg-yellow-100 text-yellow-800";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    case "ACCEPTED":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};
function ApplicationCard({ data }: ApplicationCardProps) {
  const colors = useColors();
  return (
    <tr
      className={"transition mt-12 " + ` hover:${colors.background.secondary}`}
    >
      <td className="px-6 text-center py-4">{data.candidate?.name}</td>

      <td className="px-6 text-center py-4">{data.candidate?.email}</td>

      <td className="px-6 text-center py-4">
        <Link
          href={data.resume}
          target="_blank"
          rel="noopener noreferrer"
          className={`${colors.background.secondary} p-1 rounded-md ${colors.text.primary}`}
        >
          View Resume
        </Link>
      </td>

      <td>
        <div
          className={`${getColor(data.currentStatus)} rounded-md w-fit p-1 text-center mx-auto`}
        >
          {data.currentStatus}
        </div>
      </td>
      <td>
        <Link
          href={`/interviewer-dashboard/application/${data.id}`}
          className={
            "text-white px-2 py-1 rounded-md " + `${colors.background.special}`
          }
        >
          View More
        </Link>
      </td>
    </tr>
  );
}

export default ApplicationCard;
