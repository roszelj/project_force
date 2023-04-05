/**
 *
 * ProposalForm
 *
 */
import { useEffect, useState, SyntheticEvent } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, useProposalSlice } from './slice';
import { selectProposal, selectLoading } from './slice/selectors';
import { FormLabel } from 'app/components/FormLabel';
import { Input } from 'app/components/Input';
import { TextButton } from 'app/components/TextButton';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { PageWrapper } from '../../PageWrapper';
import { A } from '../../A';
import { TextArea } from '../../TextArea';
import { FieldSet } from '../../FieldSet';

import {
  addDoc,
  collection,
  setDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from 'firebase_setup/firebase';
import { v4 as uuidv4 } from 'uuid';

//interface Props {}

export const ProposalFormOld = () => {
  const { actions } = useProposalSlice();
  const dispatch = useDispatch();

  const form_data = useSelector(selectProposal);
  const isLoading = useSelector(selectLoading);

  const error = '';

  const INITIAL_STATE: any = {
    id: uuidv4(),
    name: '',
    project_items: [],
  };

  const INITIAL_ITEMS = [
    {
      _id: 0,
      item_title: '',
      description: '',
    },
  ];

  const VALIDATION = {
    name: [
      {
        isValid: value => !!value,
        message: 'Is required.',
      },
    ],
    item_title: [
      {
        isValid: value => !!value,
        message: 'Is required',
      },
    ],
    email: [
      {
        isValid: value => !!value,
        message: 'Is required.',
      },
      {
        isValid: value => /\S+@\S+\.\S+/.test(value),
        message: 'Needs to be an email.',
      },
    ],
  };

  const getErrorFields = items =>
    Object.keys(form_data.form_data).reduce((acc, key) => {
      if (!VALIDATION[key]) return acc;

      const errorsPerField = VALIDATION[key]
        // get a list of potential errors for each field
        // by running through all the checks
        .map(validation => ({
          isValid: validation.isValid(items[key]),
          message: validation.message,
        }))
        // only keep the errors
        .filter(errorPerField => !errorPerField.isValid);
      return { ...acc, [key]: errorsPerField };
    }, {});

  const handleChange = event => {
    const item = {
      value: event.target.value,
      field: event.target.name,
    };

    dispatch(actions.update(item));
  };

  const onSubmitForm = (evt?: SyntheticEvent<HTMLFormElement>) => {
    /* istanbul ignore next  */
    if (evt !== undefined && evt.preventDefault) {
      const hasErrors = Object.values(errorFields).flat().length > 0;
      if (hasErrors) {
        evt.preventDefault();
        return;
      }

      //WE SHOULD HAVE ALL THE STATE READY TO SEND OFF TO FIREBASE
      dispatch(actions.saveProposal(true));
      evt.preventDefault();
    }
  };

  const addItem = evt => {
    const list_items = {
      _id: form_data.form_data.project_items.length,
      item_title: '',
      description: '',
    };

    dispatch(actions.addNewProjectItem(list_items));

    evt.preventDefault();
  };

  const removeItem = item => {
    dispatch(actions.removeProjectItem(item._id));
  };

  const handleItemsChange = (id, evt) => {
    const new_item = {
      _id: id,
      name: evt.target.name,
      value: evt.target.value,
    };

    dispatch(actions.updateProjectItem(new_item));
  };

  const errorFields = getErrorFields(form_data.form_data);

  const handleSubmit = testdata => {
    const ref = collection(firestore, 'test_data'); // Firebase creates this automatically

    let data = {
      testData: testdata,
    };

    try {
      addDoc(ref, data);
    } catch (err) {
      console.log(err);
    }
  };

  const submithandler = () => {
    handleSubmit(Date());
  };

  const [info, setInfo] = useState<any[]>([]);
  const [isUpdate, setisUpdate] = useState(false);
  const [docId, setdocId] = useState('');
  const [detail, setDetail] = useState('');
  const [ids, setIds] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await query(collection(firestore, 'test_data'));
      onSnapshot(data, querySnapshot => {
        const databaseInfo: any[] = [];
        const dataIds: any[] = [];
        querySnapshot.forEach(doc => {
          databaseInfo.push(doc.data());
          dataIds.push(doc.id);
          //console.log(doc.data().name);
        });
        setIds(dataIds);
        setInfo(databaseInfo);
      });
    };
    getData();
  }, []);

  return (
    <PageWrapper>
      <FormGroup id="proposal" onSubmit={onSubmitForm}>
        <FormLabel>Project Name</FormLabel>
        <InputWrapper>
          <Input
            id="name"
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
          />

          {errorFields['name']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['name'][0].message}
            </span>
          ) : null}

          {isLoading && <LoadingIndicator small />}
        </InputWrapper>

        {form_data.form_data.project_items.map(item => (
          <Div key={item._id}>
            <FieldSet>
              <legend>Enter Project Item Details</legend>
              <InputWrapper>
                <Input
                  placeholder="Title"
                  name="item_title"
                  onChange={evt => {
                    handleItemsChange(item._id, evt);
                  }}
                />

                {errorFields['item_title']?.length ? (
                  <span style={{ color: 'red' }}>
                    {errorFields['item_title'][0].message}
                  </span>
                ) : null}
              </InputWrapper>
              <InputWrapper>
                <TextArea
                  placeholder="Description"
                  name="description"
                  onChange={evt => {
                    handleItemsChange(item._id, evt);
                  }}
                ></TextArea>
              </InputWrapper>
              {item._id > 0 ? (
                <A
                  onClick={() => {
                    removeItem(item);
                  }}
                >
                  Remove
                </A>
              ) : (
                ''
              )}
            </FieldSet>
          </Div>
        ))}
        <Div>
          <InputWrapper>
            <TextButton onClick={addItem}>Add Another Item</TextButton>
          </InputWrapper>
          <InputWrapper>
            <TextButton>Save</TextButton>
          </InputWrapper>
          <button type="submit" onClick={submithandler}>
            Save
          </button>
        </Div>
      </FormGroup>
      <Div></Div>
      {info.map((data, index) => (
        <Div key={ids[index]}>{data.name}</Div>
      ))}
    </PageWrapper>
  );
};

const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  ${Input} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  ${TextArea} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  ${TextButton} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const ErrorText = styled.span`
  color: ${p => p.theme.text};
`;

const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  ${FormLabel} {
    margin-bottom: 0.25rem;
    margin-left: 0.125rem;
  }
`;

const Div = styled.div`
  color: ${p => p.theme.text};
`;
