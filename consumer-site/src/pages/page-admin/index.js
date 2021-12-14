import { Container, Grid } from '@mui/material';
import {PageBase} from '../../components/page-base';
import {Section} from '../../components/section';
export const PageAdmin = () =>
  <PageBase>  
    <Section>
      <Container>
        <Grid container>
          <Grid item>
            <div>Something here</div>
          </Grid>
        </Grid>
      </Container>
    </Section>
  </PageBase>;