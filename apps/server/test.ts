process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import externalPlatformService from "./service/external-platform.service";
import K8Service from "./service/k8s.service";
import videoConfrencingService from "./service/videoConfrencing.service";
import { podConfig, serviceConfig, ingressConfig } from "./utils/config";
import yaml from "yaml";

const serviceInstance = new K8Service({
  localCluster: false,

  clusterName: "kind-codex",
  clusterURL: "https://127.0.0.1:42669",

  userName: "dashboard-admin",
  userPassword:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNmcVpsSktXSXJxcW84VDN2TGMxdC1maUpyamdzUnFCZzZ6cTA2UGZVVXcifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNzcwOTc1NzQ5LCJpYXQiOjE3NzA5NzIxNDksImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJkYXNoYm9hcmQtYWRtaW4iLCJ1aWQiOiIzOGNjY2I1OS1iZmZkLTQ4OGEtOTg2My1mZmY1NGVlN2NlNDgifX0sIm5iZiI6MTc3MDk3MjE0OSwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmVybmV0ZXMtZGFzaGJvYXJkOmRhc2hib2FyZC1hZG1pbiJ9.A_Ru0a8eGsQ1omOo04jIZfwTe9IHeWjtUPXPcAhnk1SN0y3V7XsWxVD7Ca0A6GA2lzTEd3UyT6fqe9Z6JxwNWbHY9XAXZ2I3i5yljDPzMxwXMRTpdZfQV_8tDez1MbyF3MIv3-3cXQheW6QOcTmDWfrqlh0GSKgpF1r6eyU-TWrhnh7yVbXBS3sfu_6YxRiNuJResdjo5A3Are8xrUFeUeKDXvzfOV0uDWcw7Fo509F5OV6-zG9Nl7iDeFnAnJi4vx2w5lwaZapE6JWZbDFuXE2cxA2WoaJRr1q4baYC6X858ILtLv-kABIfpRrTenMDZQZqFN4gYUFQh95DFjth7Q",
  currentUserName: "kind-codex",
});

// async function main() {
//   try {
//     let podConf = podConfig
//       .replace("_podname_", "testing-pod")
//       .replace("_podlabel_", "testing");

//     const podManifest = yaml.parse(podConf);
//     const pod = await serviceInstance.addNewPod("default", podManifest);
//     console.log(pod.metadata?.name, pod.metadata?.name);

//     let serviceConf = serviceConfig
//       .replace("_podname_", "testing-pod")
//       .replace("_podlabel_", "testing");

//     const serviceManifest = yaml.parse(serviceConf);
//     const service = await serviceInstance.addNewService(
//       "default",
//       serviceManifest,
//     );
//     console.log(service.metadata?.name, service.metadata?.namespace);

//     let ingressConf = ingressConfig.replaceAll("_podname_", "testing-pod");
//     const ingressManifest = yaml.parse(ingressConf);

//     const ingress = await serviceInstance.addNewIngress(
//       "default",
//       ingressManifest,
//     );
//     console.log(ingress.metadata?.name, ingress.metadata?.namespace);

//     await Promise.resolve(() => {
//       setTimeout(() => {}, 3000);
//     });

//     await serviceInstance.removePod(
//       pod.metadata?.namespace!,
//       pod.metadata?.name!,
//     );

//     console.log("pod removed");

//     await serviceInstance.removeService(
//       service.metadata?.namespace!,
//       service.metadata?.name!,
//     );

//     console.log("service removed");

//     await serviceInstance.removeIngress(
//       ingress.metadata?.namespace!,
//       ingress.metadata?.name!,
//     );

//     console.log("ingress removed");
//   } catch (err) {
//     console.error("Kubernetes operation failed:", err);
//   }
// }
async function main() {
  const data = await externalPlatformService.getLeetCodeInfo("angad_sudan");

  console.log(data);
}

main();
