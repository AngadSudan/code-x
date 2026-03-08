import React from "react";
import AnyUserV1 from "./v1/AnyUserV1";

interface fnHandler {
  username: string;
}

function AnyUser(props: fnHandler) {
  return <AnyUserV1 username={props.username} />;
}

export default AnyUser;
