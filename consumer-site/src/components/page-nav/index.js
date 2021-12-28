import React from 'react';
import { useWallet } from 'use-wallet';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

import { AppBar, Toolbar, IconButton, Typography, Button, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight, faWallet } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTwitch } from '@fortawesome/free-brands-svg-icons';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export const PageNav = ({
  showBack,
  onBack,
  leftIcon,
  onLeftItemClicked,
  title,
  rightIcon,
  onRightIconClicked,
}) => {
  const navigate = useNavigate();
  const wallet = useWallet();
  const web3React = useWeb3React();
  const { error } = web3React;
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError

  if(isUnsupportedChainIdError)
    alert('CHAIN ERROR');

  return (
    <AppBar color="primary" position="sticky">
      <Toolbar variant="dense">

        {
          showBack &&
          <IconButton 
            edge="start"
            color="inherit"
            onClick={() => onBack ? onBack() : navigate(-1)}>
            <KeyboardArrowLeftIcon />
          </IconButton>
        }

        {
          leftIcon && 
          <IconButton 
            edge="start"
            color="inherit"
            onClick={onLeftItemClicked}>
            {leftIcon}
          </IconButton>
        }

        <IconButton onClick={()=>navigate('/')}>
          <FontAwesomeIcon icon={faChessKnight} />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <Button onClick={()=>navigate('/game')}>Games</Button>

        <Button onClick={()=>navigate('/collections')}>Collections</Button>

        <Button onClick={()=>navigate('/nft')}>NFT</Button>

        <Divider sx={{m:2}} orientation="vertical" flexItem />

        <IconButton><FontAwesomeIcon icon={faDiscord} /></IconButton>

        <IconButton><FontAwesomeIcon icon={faTwitch} /></IconButton>

        {
          !wallet.isConnected() &&
          <Button 
            variant='contained'
            onClick={()=>wallet.connect()}
            >
            <FontAwesomeIcon icon={faWallet} />&nbsp;Connect
          </Button>
        }

        {
          wallet.isConnected() &&
          <Button 
            variant='contained'
            onClick={()=>wallet.connect()}
            >
            <FontAwesomeIcon icon={faWallet} />
            &nbsp;{`${Web3.utils.fromWei(wallet?.balance || '0')} BNB`}
          </Button>
        }


        {
          rightIcon &&
          <IconButton 
            edge="end"
            color="inherit"
            onClick={onRightIconClicked}>
            {rightIcon}
          </IconButton>
        }

      </Toolbar>
    </AppBar>
  );
}