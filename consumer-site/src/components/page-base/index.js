import React from 'react';
import { PageNav } from '../page-nav';
import { Box } from '@mui/material';

export const PageBase = ({
  navProps, loading, error, reload, children
}) => 
  <Box sx={{display: 'flex', flexDirection: 'column', height:'100vh'}}>
    <PageNav {...navProps} />
    {children}
  </Box>;