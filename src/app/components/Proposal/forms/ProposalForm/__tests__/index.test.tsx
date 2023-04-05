import * as React from 'react';
import { render } from '@testing-library/react';

import { ProposalForm } from '..';

describe('<ProposalForm  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProposalForm />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
