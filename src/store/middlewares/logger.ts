import { Middleware } from "@reduxjs/toolkit";

export const logger: Middleware = () => next => (action: unknown) => {
  console.info("Action:", action);
  const result = next(action);

  console.groupEnd();
  return result;
};
