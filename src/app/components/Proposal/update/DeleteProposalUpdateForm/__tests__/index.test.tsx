import * as React from 'react';
import { render } from '@testing-library/react';

import { ProposalUpdate } from '../..';

describe('<ProposalUpdate  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProposalUpdate />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
