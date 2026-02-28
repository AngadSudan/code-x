import React from "react";
import ApplicationV1 from "./v1/ApplicationV1";

function Application({ id }: { id: string }) {
  return <ApplicationV1 id={id} />;
}

export default Application;
