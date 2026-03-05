import aiService from "../service/ai.service";
import { parse } from "yaml";

async function main() {
  const tech = new Set(["typescript"]);
  const data = await aiService.getClassification(Array.from(tech));
  console.log(parse(data));

  const processing = {
    frontend: 0,
    backend: 0,
    devops: 0,
    systemDesign: 0,
    tools: 0,
  };

  const jsonData = parse(data);

  processing.frontend =
    Math.round((Number(jsonData.FRONTEND) || 0) / tech.size) * 100;
  processing.backend =
    Math.round((Number(jsonData.BACKEND) || 0) / tech.size) * 100;
  processing.devops =
    Math.round((Number(jsonData.DEVOPS) || 0) / tech.size) * 100;
  processing.systemDesign =
    Math.round((Number(jsonData.SYSTEM_DESIGN) || 0) / tech.size) * 100;
  processing.tools =
    Math.round((Number(jsonData.PROGRAMMING) || 0) / tech.size) * 100;

  console.log(processing);
}

main();
