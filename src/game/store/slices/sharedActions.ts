import { createAction } from '@reduxjs/toolkit';

import { RootState } from '..';

export const actions = {
  syncState: createAction<RootState>('sync'),
  save: createAction<RootState>('save/create') // This is here because of errors caused by circular import, otherwise would be in 'saves' slice
};
