import { useColors } from "@/components/General/(Color Manager)/useColors";
import FailedToFetch from "./FailedToFetch";

function CodeforcesCard({ url, data }: { url: string; data: any }) {
  const colors = useColors();

  if (!data || Object.keys(data).length === 0)
    return (
      <FailedToFetch
        message={"Failed to fetch Data"}
        onRetry={() => window.location.replace(new URL(url))}
      />
    );

  const profile = data.profile;

  const registrationDate = new Date(
    profile.registrationTimeSeconds * 1000,
  ).toLocaleDateString();

  const lastOnline = new Date(
    profile.lastOnlineTimeSeconds * 1000,
  ).toLocaleDateString();

  return (
    <div
      className={`w-full h-[80%] rounded-xl p-6 shadow-md ${colors.background.primary} ${colors.border.defaultThin}`}
    >
      <div className="flex items-center gap-6">
        <img
          src={profile.avatar}
          alt={profile.handle}
          className={`w-24 h-24 rounded-full object-cover ${colors.border.fadedThin}`}
        />

        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${colors.text.primary}`}>
            {profile.firstName} {profile.lastName}
          </h2>
          <p className={`text-lg ${colors.text.primary}`}>@{profile.handle}</p>

          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            <span
              className={`px-3 py-1 rounded-full ${colors.background.accent} ${colors.text.inverted}`}
            >
              {profile.rank}
            </span>

            <span
              className={`px-3 py-1 rounded-full ${colors.border.greenThin} ${colors.text.primary}`}
            >
              Rating: {profile.rating}
            </span>

            <span
              className={`px-3 py-1 rounded-full ${colors.border.specialThin} ${colors.text.primary}`}
            >
              Max: {profile.maxRating} ({profile.maxRank})
            </span>
          </div>
        </div>
      </div>

      <div className={`my-6 ${colors.border.fadedThinTop}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className={colors.text.primary}>Location</p>
          <p className={colors.text.primary}>
            {profile.city}, {profile.country}
          </p>
        </div>

        <div>
          <p className={colors.text.primary}>Contribution</p>
          <p className={colors.text.primary}>{profile.contribution}</p>
        </div>

        <div>
          <p className={colors.text.primary}>Friends</p>
          <p className={colors.text.primary}>{profile.friendOfCount}</p>
        </div>

        <div>
          <p className={colors.text.primary}>Registered</p>
          <p className={colors.text.primary}>{registrationDate}</p>
        </div>

        <div>
          <p className={colors.text.primary}>Last Online</p>
          <p className={colors.text.primary}>{lastOnline}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className={`px-5 py-2 rounded-lg ${colors.background.special} ${colors.text.inverted} ${colors.properties.interactiveButton}`}
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
}

export default CodeforcesCard;
