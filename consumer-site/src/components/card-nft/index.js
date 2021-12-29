import { Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography, Grid } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Web3 from 'web3';

export const NftCard = ({book}) => 
  <Card sx={{m:2}}>
    <CardMedia 
      component="img" 
      height="500"
      image={book.meta?.image}
      alt={book.meta?.name}
      sx={{minWidth: 320}}
      />
    <CardContent>
      <Typography variant='h5'>{book.meta?.name}</Typography>
      { book.price && 
        <Typography variant='subtitle'>
          {`#${book.tokenId} ${Web3.utils.fromWei(book.price)} BNB`}
        </Typography>
      }
    </CardContent>
    <CardActions sx={{display: 'flex', justifyContent: 'space-between'}}>
      <Button>Buy now</Button>
      <IconButton><FavoriteBorderIcon /></IconButton>
    </CardActions>
  </Card>;