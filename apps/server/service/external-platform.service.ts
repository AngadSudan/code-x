import axios from "axios";
import {
  Badges,
  profileCalender,
  publicProfile,
  questionProfile,
  userContestRating,
} from "../utils/query";
class PlatformService {
  async getLeetCodeInfo(username: string) {
    try {
      const url = "https://leetcode.com/graphql";

      const graphqlRequest = (query: string) =>
        axios.post(
          url,
          { query, variables: { username } },
          { headers: { "Content-Type": "application/json" } },
        );

      const [profileRes, questionRes, contestRes, badgeRes, calendarRes] =
        await Promise.all([
          graphqlRequest(publicProfile),
          graphqlRequest(questionProfile),
          graphqlRequest(userContestRating),
          graphqlRequest(Badges),
          graphqlRequest(profileCalender),
        ]);

      const profile = profileRes.data?.data?.matchedUser;
      const questions = questionRes.data?.data?.matchedUser;
      const contests = contestRes.data?.data;
      const badges = badgeRes.data?.data?.matchedUser;
      const calendar = calendarRes.data?.data?.matchedUser?.userCalendar;

      const refinedData = {
        user: {
          username: profile?.username,
          realName: profile?.profile?.realName,
          avatar: profile?.profile?.userAvatar,
          ranking: profile?.profile?.ranking,
          reputation: profile?.profile?.reputation,
          certificationLevel: profile?.profile?.certificationLevel,
        },

        languagesSolved: Object.fromEntries(
          (questions?.languageProblemCount || []).map((l: any) => [
            l.languageName,
            l.problemsSolved,
          ]),
        ),

        contestStats: {
          rating: contests?.userContestRanking?.rating,
          attendedContests: contests?.userContestRanking?.attendedContestsCount,
          globalRanking: contests?.userContestRanking?.globalRanking,
          totalParticipants: contests?.userContestRanking?.totalParticipants,
          topPercentage: contests?.userContestRanking?.topPercentage,
        },

        contestHistory: (contests?.userContestRankingHistory || []).map(
          (c: any) => ({
            contestName: c.contest.title,
            problemsSolved: c.problemsSolved,
            totalProblems: c.totalProblems,
            ranking: c.ranking,
            rating: c.rating,
            trend: c.trendDirection,
            finishTime: c.finishTimeInSeconds,
          }),
        ),

        badges: (badges?.badges || []).map((b: any) => ({
          name: b.displayName,
          category: b.category,
          date: b.creationDate,
        })),

        upcomingBadges: (badges?.upcomingBadges || []).map((b: any) => ({
          name: b.name,
          progress: b.progress,
        })),

        activity: {
          activeYears: calendar?.activeYears || [],
          streak: calendar?.streak || 0,
          totalActiveDays: calendar?.totalActiveDays || 0,
        },
      };

      return refinedData;
    } catch (error: any) {
      console.error("LeetCode API Error:", error.message);
      return null;
    }
  }
  async getGithubInfo(username: string) {
    try {
      let filteredData = { profileInfo: {}, repo: [] };
      const userData = await axios.get(
        `https://api.github.com/users/${username}`,
      );
      const repo = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
          params: { per_page: 40 },
        },
      );

      const topRepos = repo.data
        .sort((a: any, b: any) => b.size - a.size)
        .slice(0, 6);

      filteredData.profileInfo = {
        name: userData.data.login,
        avatar: userData.data.avatar_url,
        publicRepo: userData.data.public_repos,
        publicGists: userData.data.public_gists,
      };

      filteredData.repo = topRepos;
      return filteredData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getMediumInfo(username: string) {}
  async getCodeForcesInfo(username: string) {
    try {
      let filteredData = { profile: {} };
      const profile = await axios.get(
        `https://codeforces.com/api/user.info?handles=${username}`,
      );

      filteredData.profile = profile.data.result[0];
      return filteredData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new PlatformService();
