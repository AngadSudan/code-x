import React from "react";

interface fnHandler {
  data: any;
}

function UserInfo({ data }: fnHandler) {
  if (!data) return;
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Banner */}
      <div
        className="w-full h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.bannerUrl})` }}
      />

      {/* Profile Section */}
      <div className="relative px-6 pb-6 -mt-12 flex flex-col gap-2">
        {/* Profile Image */}
        <img
          src={data.profileUrl}
          alt="profile"
          className="w-24 h-24 rounded-full border-4 border-[#1E1E1E] object-cover"
        />

        {/* Name */}
        <h2 className="text-xl font-semibold text-white">{data.name}</h2>

        {/* Username */}
        <p className="text-gray-400">@{data.username}</p>

        {/* Headline */}
        <p className="text-gray-300 mt-2 max-w-xl">{data.headline}</p>
      </div>
    </div>
  );
}

export default UserInfo;
