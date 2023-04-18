/**
 *
 * AssetManager
 *
 */
import React, { useEffect, SyntheticEvent } from 'react';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import { useStorage, useAuth } from 'firebase_setup/firebase';
import { LoadingIndicator } from '../LoadingIndicator';

import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import Fab from '@mui/material/Fab';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

interface Props {
  docId: any;
  epicId: any;
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const ModalStyle = styled(Box)({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#898381',
  border: '2px solid rgba(220,120,95,1)',
  boxShadow: 24,
  padding: 14,
  color: p => p.theme.palette.text.primary,
});

function generate(element: React.ReactElement) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

export function AssetManager({ docId, epicId }: Props) {
  const initalState: any = [];
  const initialFilesState: any = [];

  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [attachment, setAttachment] = React.useState(initalState);
  const [isLoading, setLoading] = React.useState(false);
  const [csFiles, csSetFiles] = React.useState(initialFilesState);
  const storage = useStorage;
  const listRef = ref(storage, 'epic-assets/' + docId + '/' + epicId);

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    listFiles();
  });

  const listFiles = () => {
    const assetData: any = [];

    const listRef = ref(storage, 'epic-assets/'+docId+'/'+epicId);

    listAll(listRef)
      .then(res => {
        res.prefixes.forEach(folderRef => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });

        res.items.forEach((itemRef: any) => {
          // All the items under listRef.
          assetData.push({ name: itemRef.name, assetRef: itemRef.fullPath });
          //csSetFiles(itemRef.name);
        });

        csSetFiles(assetData);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDownload = assetRef => {
    console.log(ref);

    getDownloadURL(ref(storage, assetRef))
      .then(url => {
        window.open(url, '_blank');
      })
      .catch(error => {
        // Handle any errors
        console.log(error);
      });
  };

  const handleChange = event => {
    const files: any = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      try {
        const files_array: any = Array.from(files);

        files_array.forEach(file => {
          setLoading(true);

          const storageRef = ref(
            storage,
            'epic-assets/' + docId + '/' + epicId + '/' + file.name,
          );

          // 'file' comes from the Blob or File API
          uploadBytes(storageRef, file).then(snapshot => {
            console.log('Uploaded a blob or file!');
            listFiles();
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDelete = assetRef => {
    const deleteRef = ref(storage, assetRef);

    deleteObject(deleteRef)
      .then(() => {
        // File deleted successfully
        listFiles();
      })
      .catch(error => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  return (
    <>
      <Box>
        <Demo>
          <List>
            {csFiles.length ? (
              csFiles.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(item.assetRef)}
                    >
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon color="secondary" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemButton onClick={() => handleDownload(item.assetRef)}>
                    <ListItemText
                      secondary={item.name}
                      //secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Typography color="secondary" sx={{ padding: '15px' }}>
                Noting uploaded yet.
              </Typography>
            )}
          </List>
        </Demo>

        <input
          accept="any/*"
          style={{ display: 'none' }}
          id={'assets_'+epicId}
          name={'assets_'+epicId}
          type="file"
          multiple
          onChange={handleChange}
        />
        {isLoading ? (
          <div>
            <LoadingIndicator small strokeColor={'rgba(220,120,95,1)'} />
          </div>
        ) : (
          <label htmlFor={'assets_'+epicId}>
            <Button variant="outlined" component="span">
              Add
            </Button>
          </label>
        )}
      </Box>
    </>
  );
}
