import * as React from 'react';
import { render } from '@testing-library/react';

import { ProposalCreate } from '..';

describe('<ProposalCreate  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProposalCreate />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
