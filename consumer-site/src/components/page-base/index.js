import React from 'react';
import { PageNav } from '../page-nav';
import { Section } from '../section';
import { Box, Container, Typography } from '@mui/material';

export const PageBase = ({
  navProps, loading, error, reload, children, sx
}) => 
  <Box sx={{display: 'flex', flexDirection: 'column', minHeight:'100vh', ...sx}}>
    <PageNav {...navProps} />
    {children}

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
  </Box>;