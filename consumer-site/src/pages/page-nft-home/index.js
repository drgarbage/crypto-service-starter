import React, { useReducer, useMemo, useEffect } from 'react';
import { PageBase } from "../../components/page-base";
import { Section } from "../../components/section";
import { useContract } from "../../components/hooks";
import { NftMarketContext, NftMarketInitial, NftMarketReducer } from "../../context/nft-market";
import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, IconButton, Typography } from '@mui/material';
import Web3 from 'web3';
import NftMarket from '../../contracts/NftMarket.json';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Book {
//   nftContract,
//   tokenId,
//   price,
//   stamp.
//   meta: { name, description, image }
// }
const NftCard = ({book}) => 
  <Card sx={{m:2, maxWidth: 320}}>
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
      <Button>Buy now</Button>
      <IconButton><FavoriteBorderIcon /></IconButton>
    </CardActions>
  </Card>;

export const PageNftHome = () => {
  const [market, dispatchMarket] = useReducer(NftMarketReducer, NftMarketInitial);
  const {contract} = useContract(NftMarket);
  
  useEffect(()=>{
    if(!contract) return;
    (async () => {
      let evts = await contract.getPastEvents("Booked");
      let bookIds = evts.map(evt => evt.returnValues.bookId);
      let skus = await Promise.all(bookIds.map(id => contract.methods.books[id].call()));
      dispatchMarket("UPDATE_SKUS", { skus });
    })();
  }, [contract]);
  
  return (
    <NftMarketContext.Provider 
      value={{market, dispatchMarket}}>
      <PageBase navProps={{title:"Gamberverse"}}>
        <Section sx={{p:2, backgroundColor: 'white'}}>

         <Box sx={{
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'center',
            }}>
            <NftMarketContext.Consumer>
              { ({market}) => 
                market.skus && Object.values(market.skus).map(
                  sku => <NftCard key={`${sku.nftContract}/${sku.tokenId}`} book={sku} />
                )
              }
            </NftMarketContext.Consumer>
          </Box>

        </Section>
      </PageBase>
    </NftMarketContext.Provider>
  );
}