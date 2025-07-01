import { Middleware } from "@reduxjs/toolkit";

export const logger: Middleware = () => next => (action: unknown) => {
  console.log("Action:", action);
  const result = next(action);

  console.groupEnd();
  return result;
};
