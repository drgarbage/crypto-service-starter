import IERC721Metadata from '../../contracts/IERC721Metadata.json';

export const Sorting = {
  NONE:               'NONE',
  RECENTLY_LISTED:    'RECENTLY_LISTED',
  RECENTLY_CREATED:   'RECENTLY_CREATED',
  RECENTLY_SOLD:      'RECENTLY_SOLD',
  RECENTLY_RECEIVED:  'RECENTLY_RECEIVED',
  ENDING_SOON:        'ENDING_SOON',
  PRICE_LOW_HIGH:     'PRICE_LOW_HIGH',
  PRICE_HIGH_LOW:     'PRICE_HIGH_LOW',
  HIGHEST_LAST_SALE:  'HIGHEST_LAST_SALE',
  OLDEST:             'OLDEST'
}

export const genContract = (context, address, artifacts) => {
  let { web3 } = context;
  return new web3.eth.Contract(artifacts.abi, address);
}

export const listBooks = async (context, options) => {
  let { web3, market } = context;
  let { search } = options;

  // const ListOptions = {
  //   search,
  //   tags: [],
  //   priceRange: [low, high],
  //   status: [],
  //   categories: [],
  //   sort: Sorting.NONE
  // }

  if(!market) return [];

  let events = await market.getPastEvents("Booked", {fromBlock:'earliest'});
  let skus = [];
  
  for(let e of events){
    try{
      let evt = e.returnValues;
      let book = await market.methods.books(evt.bookId).call();
      let nftc = genContract({web3}, book.nftContract, IERC721Metadata);
      let url = await nftc.methods.tokenURI(book.tokenId).call();
      let owner = await nftc.methods.ownerOf(book.tokenId).call();
      // todo: add contract meta data
      let contractMeta = { name: '', image: '' };
      let rsp = await fetch(url);
      let meta = await rsp.json();
      let info = { ...book, ...evt, meta, contractMeta, owner};
      skus.push(info);
    }catch(err){
      console.error(err);
    }
  }
    
  return skus;
}

export const buy = async (context, book) => {
  let { wallet, market, coin } = context;
  await coin.methods.approve(market.options.address, book.price).send({from:wallet.account});
  await market.methods.buy(book.bookId).send({from:wallet.account});
}