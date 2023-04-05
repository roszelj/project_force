import * as React from 'react';
import { render } from '@testing-library/react';

import { ProposalItemDetail } from '..';

describe('<ProposalItemDetail  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProposalItemDetail />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
