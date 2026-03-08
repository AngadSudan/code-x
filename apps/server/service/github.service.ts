import prisma from "../utils/prisma";
import { Octokit } from "octokit";

class GithubService {
  token: string;
  octokit: Octokit;
  constructor(token: string) {
    this.token = token;
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async getAllReposName() {
    try {
      const repos = await this.octokit.paginate(
        this.octokit.rest.repos.listForAuthenticatedUser,
        {
          per_page: 100,
          mediaType: {
            previews: ["mercy"], // enables topics
          },
        },
      );

      const data = repos.map((repo: any) => ({
        name: repo.name,
        owner: repo.owner.login,
        topics: repo.topics || [],
      }));

      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getAllRepoTopicAndLang(name: string, owner: string) {
    try {
      const languages = await this.octokit.rest.repos.listLanguages({
        owner,
        repo: name,
      });

      const tags = await this.octokit.rest.repos.listTags({
        owner,
        repo: name,
      });

      return {
        languages: languages.data,
        tags: tags.data,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export default GithubService;
