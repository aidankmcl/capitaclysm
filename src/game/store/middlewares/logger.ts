import { Middleware } from '@reduxjs/toolkit';

export const logger: Middleware = _ => next => action => {
  console.group('Action:', action.type);
  const result = next(action);

  console.groupEnd();
  return result;
};
