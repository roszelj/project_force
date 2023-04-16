/**
 *
 * StoriesAccordion
 *
 */
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

interface Props {
  stories: any;
  epicId: any;
  handleEditStory: any;
}

export function StoriesAccordion({ stories, epicId, handleEditStory }: Props) {
  const theme = useTheme();

  return (
    <div>
      {stories.map((item, count) => (
        <Accordion key={count}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{ width: '75%', flexShrink: 0 }} color="primary">
              {item.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'rgb(18, 18, 18)', paddingBottom:"0px" }}>
            <Typography color="secondary">{item.description}</Typography>
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="baseline"
              spacing={1}
              sx={{ width: '100%', marginTop: '10px' }}
            >
              <Typography sx={{ textAlign: 'center' }} color="secondary">
                {item.status}
              </Typography>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Typography sx={{ textAlign: 'center' }} color="secondary">
               {item.points} pts
              </Typography>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Typography sx={{ textAlign: 'center' }} color="secondary">
                {item.type}
              </Typography>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Typography sx={{ textAlign: 'center'}} color="secondary" >
                  <Button variant="text" color="primary" onClick={() => {handleEditStory(item,epicId)}}>Edit</Button>
              </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
