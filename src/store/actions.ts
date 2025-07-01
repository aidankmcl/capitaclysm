import { createAction } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { FinalizedTradePayload } from "./slices/trades";

export const syncState        = createAction<RootState>('shared/syncState');
export const save             = createAction<RootState>('shared/save');
export const finalizeTrade    = createAction<FinalizedTradePayload>('shared/finalizeTrade');
export const purchaseProperty = createAction<{
    playerID: string;
    locationIndex: number;
    price: number;
  }>('shared/purchaseProperty');