import { createContext } from 'react';

export const NftMarketInitial = {
  skus: {
  },
};

export const NftMarketContext = createContext(NftMarketInitial);

export const NftMarketReducer = (state, action) => {
  const nextState = {...state};
  switch(action.type) {
    case "UPDATE_SKUS":
      let { skus } = action.payload;

      for (const key in state.skus) {
        nextState.skus[key] = state.skus[key];
      }

      for (const sku of skus) {
       nextState.skus[sku.bookId] = sku;
      }
      break;
  }

  return nextState;
}