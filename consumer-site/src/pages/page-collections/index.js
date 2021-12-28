import { Container, Grid } from '@mui/material';
import {PageBase} from '../../components/page-base';
import {Section} from '../../components/section';
export const PageCollections = () =>
  <PageBase>  
    <Section>
      <Container>
        <Grid container>
          <Grid item>
            <div>Collections</div>
          </Grid>
        </Grid>
      </Container>
    </Section>
  </PageBase>;