import * as React from 'react';
import { render } from '@testing-library/react';

import { ProposalDetail } from '..';

describe('<ProposalDetail  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProposalDetail />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
