/**
 *
 * AssetManager
 *
 */
import React, {useEffect, SyntheticEvent} from 'react';
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

import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "firebase/storage";


import Fab from '@mui/material/Fab';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

interface Props {
  docId:any;
  epicId:any;
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
  backgroundColor: '#898381', //'background.paper',
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

export function AssetManager({docId, epicId}: Props) {


  const initalState:any = []
  const initialFilesState: any = [];

  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [attachment, setAttachment] = React.useState(initalState);
  const [isLoading, setLoading] = React.useState(false);
  const [csFiles, csSetFiles] = React.useState(initialFilesState);
  const storage = useStorage;
  const listRef = ref(storage, 'epic-assets/'+docId+'/'+epicId);

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    listFiles();

  });



  const listFiles = () => {
    const assetData:any = [];

    listAll(listRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
        
          //gs://proposal-generator-f87ad.appspot.com/epic-assets/hU3NhK0Xr2nMT2HlFkC2/2
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });
        
        res.items.forEach((itemRef:any) => {
          // All the items under listRef.
            assetData.push({name: itemRef.name, assetRef: itemRef.fullPath});
           //csSetFiles(itemRef.name);
          
        });

        csSetFiles(assetData);
      
      }).catch((error) => {
        console.log(error);
    });

  }

  const handleUploadClose = () => setUploadOpen(false);

  const handleSubmit = (event: React.FormEvent) => {
    if (event !== undefined && event.preventDefault) {
      event.preventDefault();
      //const files = (event.target as HTMLInputElement).files[0]
    //const files = Array.from(event.target.files);
    //const [file] = files;
    //console.log(files);
   

   
    }
  };

  //const ref:any = React.useRef();


  const handleDownload = (assetRef) => {

    console.log(ref);

    getDownloadURL(ref(storage, assetRef))
  .then((url) => {

    window.open(url, '_blank');

    // `url` is the download URL for 'images/stars.jpg'

    // This can be downloaded directly:
    /*
    const xhr = new XMLHttpRequest();

    

    xhr.responseType = 'blob';
  

    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', url);

    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    xhr.setRequestHeader('Access-Control-Allow-Headers', '*');

    

    xhr.send();

    */

    // Or inserted into an <img> element
    //const img = document.getElementById('myimg');
    //img.setAttribute('src', url);

  })
  .catch((error) => {
    // Handle any errors
    console.log(error);
  });
  }

  const handleChange = (event) => {

  
    const files:any = (event.target as HTMLInputElement).files
    
    if (files && files.length > 0) {
      //setAttachment(files[0])
      //console.log(files);

      setLoading(true);

      try {

        
      const storageRef = ref(storage, 'epic-assets/'+docId+'/'+epicId+'/'+files[0].name);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, files[0]).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        listFiles();
        setLoading(false);

      });
    }catch(err){
      console.log(err);
    }
    }
    
   // attachment(event.target.files[0]);

    //console.log(event.target.files[0]);
    //const files = Array.from(event.target.files);
    //const [file] = files;

    //setAttachment(file);
    //if (!!onChange) onChange({ target: { value: file } });
  };

  const handleTest = () => {
    console.log("test");
  }

  const handleDelete = (assetRef) => {

    const deleteRef = ref(storage, assetRef)

    deleteObject(deleteRef).then(() => {
      // File deleted successfully
      listFiles();
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  }

  return (
    <>
      <Box>
        <Demo>
          <List>

            {(csFiles.length ? csFiles.map((item,index) => (
                <ListItem key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.assetRef)}>
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  }>
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
            )): <Typography color="secondary" sx={{padding:"15px"}}>Noting uploaded yet.</Typography>)}
          </List>
        
        </Demo>
       
        <input
              accept="any/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              name="assets"
              type="file"
              onChange={handleChange}
            />
            {(isLoading ?
              
               <div><LoadingIndicator small strokeColor={'rgba(220,120,95,1)'}/></div>
             : <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span">
                  Add
                </Button>
             
            </label> )}
            
            {/*}
        <Button
          variant="contained"
          size="large"
          onClick={() => setUploadOpen(true)}
        >
          Upload
              </Button>*/ }
      </Box>
      <Modal
        open={uploadOpen}
        onClose={handleUploadClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalStyle>
          <Typography id="modal-modal-title" variant="h6" color="secondary">
            Upload Assets
          </Typography>
          <Box
            component="form"
           
            sx={{
              '& .MuiTextField-root': { m: 1, width: '35ch' },
            }}
            noValidate
            autoComplete="off">



            <input
              accept="any/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              name="assets"
              type="file"
              multiple
              onChange={handleChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span">
                Upload 1
              </Button>
            </label> 
            <Button variant="contained" size="large">
              Upload
            </Button>
          </Box>
        </ModalStyle>
      </Modal>
    </>
  );
}
