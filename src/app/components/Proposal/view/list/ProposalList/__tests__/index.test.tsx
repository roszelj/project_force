import * as React from 'react';
import { render } from '@testing-library/react';

import { ProposalList } from '..';

describe('<ProposalList  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProposalList />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
