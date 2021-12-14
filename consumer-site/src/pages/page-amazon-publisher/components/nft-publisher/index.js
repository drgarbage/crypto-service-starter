import React, { useState } from 'react';
import { 
  Card, CardHeader, CardContent, CardActions, CardMedia,
  TextField, Button,
} from "@mui/material";

export const NftPublisher = ({onSubmit}) => {
  const [meta, setMeta] = useState({
    name: 'Amazons',
    description: 'Female warrior Amazons'
  });
  const [image, setImage] = useState(null);
  
  const onMeta = (updates) =>
    setMeta(config => ({...config, ...updates}));

  const onPublish = () => {
    if(!onSubmit) return;
    onSubmit({image, meta});
  }

  return (
    <Card>
      <CardHeader title="發行NFT" />
      { image && 
        <CardMedia component="img" image={URL.createObjectURL(image)} />
      }
      <CardContent>
        <form>
          <TextField fullWidth label="name" type="text"
            onChange={e => onMeta({name:e.target.value})}
            value={meta.name} />
          <TextField fullWidth label="description" type="text"
            onChange={e => onMeta({description:e.target.value})}
            value={meta.description} />
        </form>
      </CardContent>
      <CardActions>
        <Button component="label">
          Select Image
          <input type="file" hidden onChange={e => setImage(e.target.files[0])} />
        </Button>
        <Button color="primary" onClick={onPublish}>Publish</Button>
      </CardActions>
    </Card>
  );
};