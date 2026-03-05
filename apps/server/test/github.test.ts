import aiService from "../service/ai.service";
import GithubService from "../service/github.service";
async function main() {
  const client = new GithubService(process.env.DUMMY_TOKEN!);

  const allRepos = (await client.getAllReposName()) || [];
  const tagData = [];
  for (let i = 0; i < allRepos?.length; i++) {
    let res = await client.getAllRepoTopicAndLang(
      allRepos[i]?.name,
      allRepos[i]?.owner,
    );
    tagData.push(res);
  }

  let tech: Set<string> = new Set();
  for (let i = 0; i < tagData.length; i++) {
    const currentTags = tagData[i]?.tags;
    const currentLanguages = Object.keys(tagData[i]?.languages || {});

    currentTags?.forEach((tag) => tech.add(tag));
    currentLanguages.forEach((lang) => tech.add(lang));
  }

  tech = new Set(tech);
  console.log(Array.from(tech));

  const res = await aiService.getClassification(Array.from(tech));

  console.log(res);
}

main();
