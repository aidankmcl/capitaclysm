import { createAction } from "@reduxjs/toolkit";

import { RootState } from "..";
import { FinalizedTradePayload } from "./trades";

export const actions = {
  syncState: createAction<RootState>("sync"),
  save: createAction<RootState>("save/create"), // This is here because of errors caused by circular import, otherwise would be in 'saves' slice
  finalizeTrade: createAction<FinalizedTradePayload>("trade/finalize"),
  purchaseProperty: createAction<{
    playerID: string;
    locationIndex: number;
    price: number;
  }>("property/purchase"),
};
