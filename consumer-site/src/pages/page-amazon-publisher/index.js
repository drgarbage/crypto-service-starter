import { Container, Grid } from '@mui/material';
import { useContract } from '../../components/hooks';
import { PageBase } from '../../components/page-base';
import { Section } from '../../components/section';
import { useWallet } from 'use-wallet';
import { publish } from '../../services/nft-amazons';
import { NftPublisher } from './components/nft-publisher';
import NftAmazons from '../../contracts/NftAmazons.json';

export const PageAmazonPublisher = (props) => {
  const wallet = useWallet();
  const {web3, contract} = useContract(NftAmazons);

  return (
    <PageBase navProps={{title: "Amazon Administration"}}>
      <Section sx={{m:4}}>

        <Grid container>
          <Grid item md={4}>
            <NftPublisher 
              onSubmit={async ({image, meta}) => {
                try{
                  if(!wallet.isConnected())
                    throw new Error("Wallet not connected!");
                  let context = {
                    wallet, web3, contract
                  };
                  let rs = await publish(context, image, meta);
                }catch(e){
                  alert(e.message);
                }
              }} />
          </Grid>
        </Grid>
        
      </Section>
    </PageBase>
  );
}