import externalPlatformService from "../service/external-platform.service";

async function main() {
  const data = await externalPlatformService.getLeetCodeInfo("Aayush0821");

  console.log(data);
}

main();
