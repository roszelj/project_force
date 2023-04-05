import * as React from 'react';
import { render } from '@testing-library/react';

import { ProposalUpdateForm } from '..';

describe('<ProposalUpdateForm  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProposalUpdateForm />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
