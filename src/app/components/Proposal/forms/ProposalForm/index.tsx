/**
 *
 * ProposalForm
 *
 */
import React, { useEffect, SyntheticEvent } from 'react';
import styled from 'styled-components/macro';
import { FormLabel } from 'app/components/FormLabel';
import { Input } from 'app/components/Input';
import { TextButton } from 'app/components/TextButton';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { PageWrapper } from 'app/components/PageWrapper';
import { A } from 'app/components/A';
import { TextArea } from 'app/components/TextArea';
import { FieldSet } from 'app/components/FieldSet';
import {
  selectProposalForm,
  selectLoading,
} from 'app/components/Proposal/forms/ProposalForm/slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, useProposalFormSlice } from './slice';
import { v4 as uuidv4 } from 'uuid';
import { Select } from 'app/components/Select';
import { formatToISO } from 'utils/firestoreDateUtil';
import { selectLogin } from 'app/components/LoginForm/slice/selectors';

interface Props {
  id?: any;
  reset?: boolean;
}

export function ProposalForm({ id, reset }: Props) {
  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    id ? dispatch(actions.getProposal(id)) : null;
    reset === true ? dispatch(actions.resetProposal()) : null;
  });

  const { actions } = useProposalFormSlice();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectLoading);

  const form_data = useSelector(selectProposalForm);

  const user = useSelector(selectLogin);

  const VALIDATION = {
    name: [
      {
        isValid: value => !!value,
        message: 'Is required',
      },
    ],
    prepared_for: [
      {
        isValid: value => !!value,
        message: 'Is required',
      },
    ],
    summary: [
      {
        isValid: value => !!value,
        message: 'Is required',
      },
    ],
    price: [
      {
        isValid: value => !!value,
        message: 'Is required',
      },
      {
        isValid: value => /^\d+\.\d{0,2}$/.test(value),
        message: 'Needs be in decimal format',
      },
    ],
    deposit: [
      {
        isValid: value => !!value,
        message: 'Is required',
      },
      {
        isValid: value => /^\d+\.\d{0,2}$/.test(value),
        message: 'Needs be in decimal format',
      },
    ],
    discount: [
      {
        isValid: value => !!value,
        message: 'Is required',
      },
      {
        isValid: value => /^\d+\.\d{0,2}$/.test(value),
        message: 'Needs be in decimal format',
      },
    ],
    setup: [
      {
        isValid: value => !!value,
        message: 'Is required',
      },
      {
        isValid: value => /^\d+\.\d{0,2}$/.test(value),
        message: 'Needs be in decimal format',
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
        message: 'Is required',
      },
      {
        isValid: value => /\S+@\S+\.\S+/.test(value),
        message: 'Needs to be an email',
      },
    ],
  };

  const getErrorFields = items =>
    Object.keys(form_data).reduce((acc, key) => {
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

  const handleItemsChange = (id, evt) => {
    const new_item = {
      _id: id,
      name: evt.target.name,
      value: evt.target.value,
    };

    dispatch(actions.updateProjectItem(new_item));
  };

  const errorFields = getErrorFields(form_data);

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

      dispatch(
        actions.update({ value: user.currentUser.uid, field: 'admin_uid' }),
      );

      id
        ? dispatch(actions.saveProposal(true))
        : dispatch(actions.createProposal(true));

      evt.preventDefault();
    }
  };

  const addItem = evt => {
    const list_items = {
      _id: form_data.project_items.length,
      item_title: '',
      description: '',
      status: 'open',
      version: '1',
      created_on: formatToISO(),
      updated_on: formatToISO(),
      stories: [],
      comments: [],
    };

    dispatch(actions.addNewProjectItem(list_items));

    evt.preventDefault();
  };

  const removeItem = item => {
    dispatch(actions.removeProjectItem(item._id));
  };

  const removeStory = (item_id, story_id) => {
    console.log(story_id);
    dispatch(
      actions.removeProjectItemStory({ item_id: item_id, story_id: story_id }),
    );
  };

  const handleStoryChange = (item_id, story_id, evt) => {
    const new_item = {
      item_id: item_id,
      _id: story_id,
      name: evt.target.name,
      value: evt.target.value,
    };

    dispatch(actions.updateProjectItemStory(new_item));
  };

  const addStory = (item_id, new_id, evt) => {
    const list_story = {
      _id: new_id,
      item_id: item_id,
      title: '',
      description: '',
      points: '1',
      status: 'open',
      type: 'user',
      created_on: formatToISO(),
    };

    dispatch(actions.addNewProjectItemStory(list_story));

    evt.preventDefault();
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <FormGroup id="proposal" onSubmit={onSubmitForm}>
        <FormLabel>Project Name</FormLabel>
        <InputWrapper key={form_data.id}>
          <Input
            id="name"
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
            defaultValue={form_data.name}
          />

          {errorFields['name']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['name'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Prepared For</FormLabel>
        <InputWrapper key={form_data.id + 1}>
          <Input
            id="prepared_for"
            type="text"
            placeholder="Project Contact"
            name="prepared_for"
            onChange={handleChange}
            defaultValue={form_data.prepared_for}
          />

          {errorFields['prepared_for']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['prepared_for'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Summary</FormLabel>
        <InputWrapper key={form_data.id + 2}>
          <TextArea
            placeholder="Project Summary"
            name="summary"
            defaultValue={form_data.summary}
            onChange={handleChange}
          ></TextArea>

          {errorFields['summary']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['summary'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Email</FormLabel>
        <InputWrapper key={form_data.id + 3}>
          <Input
            id="email"
            type="text"
            placeholder="someone@somewhere.com"
            name="email"
            onChange={handleChange}
            defaultValue={form_data.email}
          />

          {errorFields['email']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['email'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Price</FormLabel>
        <InputWrapper key={form_data.id + 4}>
          <Input
            id="price"
            type="text"
            placeholder="$"
            name="price"
            onChange={handleChange}
            defaultValue={form_data.price}
          />

          {errorFields['price']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['price'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Deposit/Start Cost</FormLabel>
        <InputWrapper key={form_data.id + 5}>
          <Input
            id="deposit"
            type="text"
            placeholder="$"
            name="deposit"
            onChange={handleChange}
            defaultValue={form_data.deposit}
          />
          {errorFields['deposit']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['deposit'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Payment Schedule</FormLabel>
        <InputWrapper key={form_data.id + 6}>
          <Select
            id="payment_schedule"
            name="payment_schedule"
            onChange={handleChange}
            defaultValue={form_data.payment_schedule}
          >
            <option value="0/0">None</option>
            <option value="100">100% (Paid all up front)</option>
            <option value="50/2">50% (50% to start 50% when completed </option>
            <option value="33/3">
              1/3 (Payments split - start/middle/end)
            </option>
            <option value="25/4">
              25% (Payment split - start/milestone 1/milestone 2/end)
            </option>
          </Select>
        </InputWrapper>

        <FormLabel>Discount</FormLabel>
        <InputWrapper key={form_data.id + 7}>
          <Input
            id="discount"
            type="text"
            placeholder="$"
            name="discount"
            onChange={handleChange}
            defaultValue={form_data.discount}
          />
          {errorFields['discount']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['discount'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Setup Cost</FormLabel>
        <InputWrapper key={form_data.id + 8}>
          <Input
            id="setup"
            type="text"
            placeholder="$"
            name="setup"
            onChange={handleChange}
            defaultValue={form_data.setup}
          />
          {errorFields['setup']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['setup'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Total Estimated Hours</FormLabel>
        <InputWrapper key={form_data.id + 9}>
          <Input
            id="total_estimated_hours"
            type="text"
            placeholder=""
            name="total_estimated_hours"
            onChange={handleChange}
            defaultValue={form_data.total_estimated_hours}
          />
          {errorFields['total_estimated_hours']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['total_estimated_hours'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        <FormLabel>Estimated Completion Date</FormLabel>
        <InputWrapper key={form_data.id + 10}>
          <Input
            id="estimated_completion_date"
            type="text"
            placeholder=""
            name="estimated_completion_date"
            onChange={handleChange}
            defaultValue={form_data.estimated_completion_date}
          />
          {errorFields['estimated_completion_date']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['estimated_completion_date'][0].message}
            </span>
          ) : null}
        </InputWrapper>

        {form_data.project_items.map(item => (
          <Div key={item._id}>
            <FieldSet>
              <legend>Enter Project Epic Details</legend>
              <InputWrapper key={form_data.id + 11}>
                <Input
                  placeholder="Title"
                  name="item_title"
                  onChange={evt => {
                    handleItemsChange(item._id, evt);
                  }}
                  defaultValue={item.item_title}
                />

                {errorFields['item_title']?.length ? (
                  <span style={{ color: 'red' }}>
                    {errorFields['item_title'][0].message}
                  </span>
                ) : null}
              </InputWrapper>
              <InputWrapper key={form_data.id + 12}>
                <TextArea
                  placeholder="Description"
                  name="description"
                  defaultValue={item.description}
                  onChange={evt => {
                    handleItemsChange(item._id, evt);
                  }}
                ></TextArea>
              </InputWrapper>

              <InputWrapper key={form_data.id + 13}>
                <Input
                  placeholder="Estimated Time"
                  name="item_estimation"
                  onChange={evt => {
                    handleItemsChange(item._id, evt);
                  }}
                  defaultValue={item.item_estimation}
                />
              </InputWrapper>

              {item.stories?.map((story, count) => (
                <FieldSet key={count}>
                  <legend>Enter Project Story</legend>
                  <Div>
                    <InputWrapper key={form_data.id + 14}>
                      <Input
                        placeholder="Title"
                        name="title"
                        onChange={evt => {
                          handleStoryChange(item._id, story._id, evt);
                        }}
                        defaultValue={story.title}
                      />
                    </InputWrapper>
                    <InputWrapper key={form_data.id + 15}>
                      <TextArea
                        placeholder="Description"
                        name="description"
                        onChange={evt => {
                          handleStoryChange(item._id, story._id, evt);
                        }}
                        defaultValue={story.description}
                      />
                    </InputWrapper>

                    <FormLabel>Points</FormLabel>
                    <InputWrapper key={form_data.id + 16}>
                      <Select
                        name="points"
                        onChange={evt => {
                          handleStoryChange(item._id, story._id, evt);
                        }}
                        defaultValue={story.points}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="8">8</option>
                        <option value="13">13</option>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="100">100</option>
                      </Select>
                    </InputWrapper>
                    <FormLabel>Status</FormLabel>
                    <InputWrapper key={form_data.id + 17}>
                      <Select
                        name="status"
                        onChange={evt => {
                          handleStoryChange(item._id, story._id, evt);
                        }}
                        defaultValue={story.status}
                      >
                        <option value="open">Open</option>
                        <option value="ready to work">Ready to work</option>
                        <option value="in progress">In Progress</option>
                        <option value="ready for acceptance">
                          Ready for acceptance
                        </option>
                        <option value="accepted">Accepted</option>
                        <option value="deployed">Deployed</option>
                        <option value="blocked">Blocked</option>
                        <option value="on hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </Select>
                    </InputWrapper>

                    <FormLabel>Type</FormLabel>
                    <InputWrapper key={form_data.id + 18}>
                      <Select
                        name="type"
                        onChange={evt => {
                          handleStoryChange(item._id, story._id, evt);
                        }}
                        defaultValue={story.type}
                      >
                        <option value="user">
                          User Story - (Small Piece of Desired Functionality)
                        </option>
                        <option value="enabler - infra">
                          Enabler Story - (Infrastructure)
                        </option>
                        <option value="enabler - arch">
                          Enabler Story - (Architecture)
                        </option>
                        <option value="enabler - explor">
                          Enabler Story - (Exploration)
                        </option>
                        <option value="enanbler - comp">
                          Enabler Story - (Compliance)
                        </option>
                        <option value="bug">Bug</option>
                      </Select>
                    </InputWrapper>
                    <A
                      onClick={() => {
                        removeStory(item._id, story._id);
                      }}
                    >
                      Remove Story
                    </A>
                  </Div>
                </FieldSet>
              ))}

              <InputWrapper>
                <TextButton
                  onClick={evt => {
                    addStory(
                      item._id,
                      item.stories?.length ? item.stories.length : 0,
                      evt,
                    );
                  }}
                >
                  Add Story
                </TextButton>
              </InputWrapper>

              {item._id > 0 ? (
                <A
                  onClick={() => {
                    removeItem(item);
                  }}
                >
                  Remove Project Epic
                </A>
              ) : (
                ''
              )}
            </FieldSet>
          </Div>
        ))}
        <Div>
          <InputWrapper>
            <TextButton onClick={addItem}>Add Project Item</TextButton>
          </InputWrapper>
        </Div>
        <Div>
          <TextButton>Save</TextButton>
          {isLoading && <LoadingIndicator small />}
        </Div>
      </FormGroup>
    </>
  );
}

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
  ${TextButton} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
