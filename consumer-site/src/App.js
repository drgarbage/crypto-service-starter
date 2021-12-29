import React from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageHome } from './pages/page-home';
import { PageGameHome } from './pages/page-game-home';
import { PageNftHome} from './pages/page-nft-home';
import { PageAdmin } from './pages/page-admin';
import { PageAmazonPublisher } from './pages/page-amazon-publisher';
import { grey, deepOrange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepOrange,
    divider: grey[700],
    background: {
      default: grey[900],
      paper: grey[900],
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageHome />} />
          <Route path="/game" element={<PageGameHome />} />
          <Route path="/nft" element={<PageNftHome />} />
          <Route path="/nft-amazon" element={<PageAmazonPublisher />} />
          <Route path="/admin" element={<PageAdmin />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default () => (
  <UseWalletProvider
    chainId={process.env.REACT_APP_CHAIN_ID}>
    <App />
  </UseWalletProvider>
);
