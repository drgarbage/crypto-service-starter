import React, { useReducer, useMemo, useEffect } from 'react';
import { PageBase } from "../../components/page-base";
import { Section } from "../../components/section";
import { useContract } from "../../components/hooks";
import { NftMarketContext, NftMarketInitial, NftMarketReducer } from "../../context/nft-market";
import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, IconButton, Typography, Grid } from '@mui/material';
import Web3 from 'web3';
import NftMarket from '../../contracts/NftMarket.json';
import NftAmazons from '../../contracts/NftAmazons.json';
import MainCoin from '../../contracts/MainCoin.json';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useWallet } from 'use-wallet';

const cardWidth = (1152 - 4 * 8 * 3) / 3

// Book {
//   nftContract,
//   tokenId,
//   price,
//   stamp.
//   meta: { name, description, image }
// }
const NftCard = ({book, onBuy: onPurchase}) => 
  <Card sx={{m:2, width: cardWidth}}>
    <CardMedia 
      component="img" 
      height="320"
      image={book.meta?.image}
      alt={book.meta?.name}
      sx={{minWidth: 320}}
      />
    <CardContent>
      <Typography variant='h5'>{book.meta?.name}</Typography>
      { book.price && 
        <Typography variant='subtitle'>
          {`${Web3.utils.fromWei(book.price)} BNB`}
        </Typography>
      }
    </CardContent>
    <CardActions sx={{display: 'flex', justifyContent: 'space-between'}}>
      <Button onClick={onPurchase}>Buy now</Button>
      <IconButton><FavoriteBorderIcon /></IconButton>
    </CardActions>
  </Card>;

export const PageNftHome = () => {
  const [market, dispatchMarket] = useReducer(NftMarketReducer, NftMarketInitial);
  const wallet = useWallet();
  const {contract} = useContract(NftMarket);
  const {contract:contractAmazons} = useContract(NftAmazons);
  const {contract:contractCoin} = useContract(MainCoin);

  const onPurchase = async(sku) => {
    try {
      if(!wallet.isConnected())
        throw new Error("Wallet not connected!");

      await contractCoin.methods
        .apporve(contract.options.address, Web3.utils.toWei(sku.price)).send({from:wallet.account});

      let res = await contract.methods.buy(sku.bookId).send({from:wallet.account});
    }catch(err){
      alert(err.message)
    }
  }

  useEffect(()=>{
    if(!contract) return;
    (async () => {
      let evts = await contract.getPastEvents("Booked", {fromBlock:'earliest'});
      evts = evts.map(evt => evt.returnValues);
      let skus = [];
      for (const evt of evts) {
        let book = await contract.methods.books(evt.bookId).call();
        let metaUrl = await contractAmazons.methods.tokenURI(book.tokenId).call();
        let rs = await fetch(metaUrl);
        let meta = await rs.json();
        skus.push({...book, bookId:evt.bookId, seller: evt.seller, meta})
      }
      dispatchMarket({type:"UPDATE_SKUS",payload: { skus }});
    })();
  }, [contract]);
  
  return (
    <NftMarketContext.Provider 
      value={{market, dispatchMarket}}>
      <PageBase navProps={{title:"Gamberverse"}}>
        <Section sx={{p:2, backgroundColor: 'white'}}>

        <Container>
          <Grid container>
              <NftMarketContext.Consumer>
                {({market}) =>
                  market.skus && Object.values(market.skus).map(
                    sku => <NftCard
                     key={`${sku.nftContract}/${sku.tokenId}`}
                     book={sku} 
                     onPurchase={()=>onPurchase(sku)}/>
                  )
                }
              </NftMarketContext.Consumer>
            </Grid>
        </Container>

        </Section>
      </PageBase>
    </NftMarketContext.Provider>
  );
}