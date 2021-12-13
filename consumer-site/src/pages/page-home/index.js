import { PageBase } from "../../components/page-base";
import { Box, Container, Grid, Button, Typography } from "@mui/material";

const Section = ({sx, children}) =>
  <Box sx={{
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    ...sx,
  }}>{children}</Box>

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

  return (
    <PageBase navProps={{title:"Gamberverse"}}>
      <Section sx={{
        minHeight: '500px',
        background: 'url(https://wallpapercave.com/wp/wp10343417.jpg)',
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
                  color="primary">
                    Get Involved!
                </Button>
              </Typography>
            </Grid>

          </Grid>
        </Container>
      </Section>

      <Section sx={{
        minHeight: '500px',
        background: 'url(https://cdn.wallpapersafari.com/33/22/I6KywG.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
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
        background: 'url(https://media.giphy.com/media/ik2KBT1a6IUvu/giphy.gif)',
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

      <Section sx={{
        minHeight: '200px',
        color: 'silver',
        background: '#444',
      }}>
        <Container>
          <Typography variant="body1" align="center">
            Service Policy | Privacy | White Paper<br/><br/><br/><br/>
          </Typography>
          <Typography variant="h6" align="center">
            GAMBERVERSE
          </Typography>
          <Typography variant="body2" align="center">
            &copy; 2022 Gamberverse
          </Typography>
        </Container>
      </Section>


    </PageBase>
  );
}