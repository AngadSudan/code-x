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
      const refinedData = {};

      const profileData = await axios.post(
        "https://leetcode.com/graphql",
        {
          query: publicProfile,
          variables: { username },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const questonProfile = await axios.post(
        "https://leetcode.com/graphql",
        {
          query: questionProfile,
          variables: { username },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const contestRating = await axios.post(
        "https://leetcode.com/graphql",
        {
          query: userContestRating,
          variables: { username },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userBadges = await axios.post(
        "https://leetcode.com/graphql",
        {
          query: Badges,
          variables: { username },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const UserProfileCalender = await axios.post(
        "https://leetcode.com/graphql",
        {
          query: profileCalender,
          variables: { username },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(JSON.stringify(profileData.data, null, 2));
      console.log(JSON.stringify(questonProfile.data, null, 2));
      console.log(JSON.stringify(contestRating.data, null, 2));
      console.log(JSON.stringify(userBadges.data, null, 2));
      console.log(JSON.stringify(UserProfileCalender.data, null, 2));
      return refinedData;
    } catch (error: any) {
      console.log(error);
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
