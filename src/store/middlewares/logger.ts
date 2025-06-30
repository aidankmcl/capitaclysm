import { Middleware } from "@reduxjs/toolkit";

export const logger: Middleware = () => next => action => {
  console.group("Action:", action.type);
  const result = next(action);

  console.groupEnd();
  return result;
};
