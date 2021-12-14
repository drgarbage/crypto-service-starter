import { createContext } from 'react';

export const NftMarketInitial = {
  skus: {
    "FAKE_BOOK_ID_01": {
      nftContract: '0x00',
      tokenId: 0,
      price: '10000000000000000',
      stamp: 0,
      meta: { 
        name: 'FAKE NFT', 
        description: 'This is fake', 
        image: 'https://i.pinimg.com/originals/45/f6/b5/45f6b57cb4de6125544c05db8ecb9bbd.jpg'
      }
    },
    "FAKE_BOOK_ID_02": {
      nftContract: '0x01',
      tokenId: 0,
      price: '10000000000000000',
      stamp: 0,
      meta: { 
        name: 'FAKE NFT', 
        description: 'This is fake', 
        image: 'https://i.pinimg.com/originals/96/2e/4e/962e4e7b248e18d312f91b07e13fcd89.jpg'
      }
    },
    "FAKE_BOOK_ID_03": {
      nftContract: '0x02',
      tokenId: 0,
      price: '10000000000000000',
      stamp: 0,
      meta: { 
        name: 'FAKE NFT', 
        description: 'This is fake', 
        image: 'https://i.pinimg.com/originals/c1/d2/94/c1d294490863adccf9dd823241b2cc0b.jpg'
      }
    },
  },
};

export const NftMarketContext = createContext(NftMarketInitial);

export const NftMarketReducer = (state, action) => {
  const nextState = {...state};

  switch(action.type) {
    case "UPDATE_SKUS":
      let { skus } = action.payload;
      nextState.skus = [...state.skus, ...skus];
      break;
  }

  return nextState;
}