import externalPlatformService from "../service/external-platform.service";

async function main() {
  const data = await externalPlatformService.getLeetCodeInfo("angad_sudan");

  console.log(data);
}

main();
