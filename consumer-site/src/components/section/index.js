import { Box } from '@mui/material';

export const Section = ({sx, children}) =>
<Box sx={{
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  ...sx,
}}>{children}</Box>