import React, { useReducer, useMemo, useEffect } from 'react';
import { useWeb3, useContract } from "../../components/hooks";
import { useWallet } from "use-wallet";
import { PageBase } from "../../components/page-base";
import { Section } from "../../components/section";
import { NftCard } from '../../components/card-nft';
import { NftMarketContext, NftMarketInitial, NftMarketReducer } from "../../context/nft-market";
import { Card, CardMedia, Container, Typography, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { buy, listBooks } from '../../services/nft';
import NftMarket from '../../contracts/NftMarket.json';
import MainCoin from '../../contracts/MainCoin.json';

// Book {
//   nftContract,
//   tokenId,
//   price,
//   stamp.
//   meta: { name, description, image }
// }

export const PageNftHome = () => {
  let { collection } = useParams();
  const [market, dispatchMarket] = useReducer(NftMarketReducer, NftMarketInitial);
  const wallet = useWallet();
  const web3 = useWeb3();
  const contractMarket = useContract(NftMarket);
  const contractCoin = useContract(MainCoin);
  const context = {
    web3,
    wallet,
    market: contractMarket,
    coin: contractCoin
  };


  const purchase = (book) => {
    try{
      if(!wallet.isConnected())
        throw new Error("Wallet not connected!");
      buy(context, book);
      alert('Purchase Success!')
    } catch(err) {
        alert(err.message);
    }
  }
  
  useEffect(()=>{
    listBooks({web3, market: contractMarket}, {})
      .then(skus => dispatchMarket({type:"UPDATE_SKUS",payload: { skus }}));
  }, [web3, contractMarket]);
  
  return (
    <NftMarketContext.Provider 
      value={{market, dispatchMarket}}>
      <PageBase navProps={{title:"Gamberverse"}}>


      <Section sx={{
        minHeight: '100vh',
        background: 'url(https://wallpapercave.com/wp/wp10343417.jpg)',
        backgroundSize: '300% 300%',
        opacity: .85,
        }}>
        <Container>
          <Grid container>
            <Grid item md={4}></Grid>

            <Grid item md={6} sx={12} sx={{color: 'white'}}>
              <Typography variant="h2">
                <strong><small>All Collections</small></strong><br/>NFT Marketplace
              </Typography>
              <Typography variant="body1">
                Become the sponsor of our gaming platform, by staking GBP, you'll get unlimited reward from all kinds of game universe on this platoform.
              </Typography>
            </Grid>

          </Grid>
        </Container>
      </Section>
      
        <Section sx={{p:2, backgroundColor: 'white'}}>

        <Container>
          <Grid container>

            <Grid item md={4}>
              <Card sx={{m:2}}>
                <CardMedia 
                  component="img" 
                  height="200"
                  image="https://cdn.wallpapersafari.com/33/22/I6KywG.jpg"
                  alt="The Amazons"
                  sx={{minWidth: 320}}
                  />
              </Card>
            </Grid>

            <Grid item md={6} sx={12} sx={{m: 2, color: 'black'}}>
              <Typography variant="h2">
                <strong><small>Trending</small></strong><br/>The Amazons
              </Typography>
              <Typography variant="body1">
                Become the sponsor of our gaming platform, by staking GBP, you'll get unlimited reward from all kinds of game universe on this platoform.
              </Typography>
            </Grid>

            <NftMarketContext.Consumer>
              {({market}) =>
                market.skus && Object.values(market.skus).map(
                  sku => 
                  <Grid item xs={4}>
                    <NftCard 
                      key={`${sku.nftContract}/${sku.tokenId}`} 
                      book={sku} 
                      onPurchase={()=>purchase(sku)}
                      />
                  </Grid>
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