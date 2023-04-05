import * as React from 'react';
import { render } from '@testing-library/react';
import { createRenderer } from 'react-test-renderer/shallow';

import { ProposalForm } from '..';

const shallowRenderer = createRenderer();

describe('<ProposalForm />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<ProposalForm />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
