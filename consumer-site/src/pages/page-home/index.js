import React, { useState, useCallback } from 'react';
import { PageBase } from "../../components/page-base";
import { Section } from '../../components/section';
import { 
  Box, Container, Grid, Button, Typography, 
  Card, CardHeader, CardContent, 
  List, ListItem, ListItemText, CardActions, CardMedia 
} from "@mui/material";
import { useWallet } from "use-wallet";
import { useWeb3, useContract } from '../../components/hooks';
import { useEffect } from "react";
import MainCoin from '../../contracts/MainCoin.json';
import MainPool from '../../contracts/MainPool.json';

const NftCard = ({sx}) =>
  <Box sx={{
    m: 2,
    color: 'white',
    minWidth: 240,
    minHeight: 400,
    borderRadius: 2,
    backgroundColor: 'black',
    ...sx,
  }}>&nbsp;</Box>

export const PageHome = () => {
  const wallet = useWallet();
  const web3 = useWeb3();
  const contractCoin = useContract(MainCoin);
  const contractPool = useContract(MainPool);
  const [ stakingInfo, setStakingInfo ] = useState({staked: '0', earned: '0'});
  const stake = useCallback(async () => {
    try{
      let amt = web3.utils.toWei('1','ether');
      await contractCoin.methods
        .approve(contractPool.options.address, amt)
        .send({from:wallet.account});
      await contractPool.methods
        .stake(amt)
        .send({from:wallet.account});
    }catch(err){
      alert(err.message);
    }
  }, [wallet, web3, contractPool]);
  const unstake = useCallback(async () => {
    try{
      let amt = web3.utils.toWei('1','ether');
      await contractPool.methods
        .unstake(amt)
        .send({from:wallet.account});
    }catch(err){
      alert(err.message);
    }
  }, [wallet, contractPool])

  useEffect(()=>{
    if(!wallet || !wallet.account || !contractPool) return;

    (async () => {
      try{
        let staked = await contractPool.methods.balanceOf(wallet.account).call();
        let earned = await contractPool.methods.earned(wallet.account).call();
        setStakingInfo({staked, earned});
      }catch(err){
        console.error(err);
      }
      
    })();

  }, [setStakingInfo, wallet, contractPool]);


  return (
    <PageBase navProps={{title:"Gamberverse"}} sx={{
      background: 'url(https://cdn.wallpapersafari.com/33/22/I6KywG.jpg)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      }}>

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
                <strong><small>Decentralized</small></strong><br/>Gambling Platform
              </Typography>
              <Typography variant="body1">
                Become the sponsor of our gaming platform, by staking GBP, you'll get unlimited reward from all kinds of game universe on this platoform.
              </Typography>
              <Typography variant="body1">
                <br/>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={()=>wallet.connect()}>
                    Get Involved!
                </Button>
              </Typography>
            </Grid>

          </Grid>
        </Container>
      </Section>

      { wallet.isConnected() &&

        <Section sx={{p: 4}}>
          <Container>

            <Grid container>
              <Grid item md={4}>

                <Card>
                  <CardMedia 
                    component="img" 
                    image="https://qph.fs.quoracdn.net/main-qimg-be8fc26693f76dc98e580fd1112749e9" />
                  <CardContent>
                    {web3.utils.fromWei(stakingInfo.staked)} Staked, {web3.utils.fromWei(stakingInfo.earned)} Earned.
                  </CardContent>
                  <CardActions>
                    <Button onClick={stake}>Stake</Button>
                    <Button onClick={unstake}>Unstake</Button>
                  </CardActions>
                </Card>

              </Grid>
            </Grid>

          </Container>
        </Section>
      }

      <Section sx={{
        minHeight: '500px',
        background: 'rgba(0,0,255,0.2)',
        }}>
        <Container>
          <Grid container>

            <Grid item xs={4} sx={{color: 'white'}}>
              <Typography variant="h2">
                <strong><small>the amazing</small></strong><br/>AMAZONS
              </Typography>
              <Typography variant="p">
                Become the sponsor of our gaming platform, by staking GBP, you'll get unlimited reward from all kinds of game universe on this platoform.
              </Typography>
            </Grid>

          </Grid>
        </Container>
      </Section>


      <Section sx={{
        p: 2,
        background: 'transparent url(https://media.giphy.com/media/ik2KBT1a6IUvu/giphy.gif)',
        backgroundSize: 'cover',
        }}>
        <Container>

          <Typography variant="h2" sx={{color: 'white', textAlign: 'center'}}>
            <span style={{fontSize: 32}}>UPCOMMING</span><br/>
            <strong>Game NFTs</strong> 
          </Typography>

          <Box sx={{
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'center',
            }}>

            <NftCard sx={{
              background: 'url(https://i.pinimg.com/originals/72/3b/1c/723b1cca03ed1334336c2db8f97e53d5.jpg)',
              backgroundSize: 'cover',
            }} />

            <NftCard sx={{
              background: 'url(https://i.pinimg.com/originals/96/2e/4e/962e4e7b248e18d312f91b07e13fcd89.jpg)',
              backgroundSize: 'cover',
            }} />

            <NftCard sx={{
              background: 'url(https://i.pinimg.com/originals/c1/d2/94/c1d294490863adccf9dd823241b2cc0b.jpg)',
              backgroundSize: 'cover',
            }} />

          </Box>
          
        </Container>
      </Section>

    </PageBase>
  );
}