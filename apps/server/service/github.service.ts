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
      const allRepositories =
        await this.octokit.rest.repos.listForAuthenticatedUser();

      let repo = allRepositories.data || [];
      let filteredData = repo.map((repo) => {
        return { name: repo.name, owner: repo.owner.login };
      });
      return filteredData || [];
    } catch (error: any) {
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
