import React from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageHome } from './pages/page-home';
import { PageGameHome } from './pages/page-game-home';
import { PageNftHome} from './pages/page-nft-home';
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default () => (
  <UseWalletProvider
    chainId={97}>
    <App />
  </UseWalletProvider>
);
