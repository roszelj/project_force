import * as React from 'react';
import { render } from '@testing-library/react';

import { ProposalItem } from '..';

describe('<ProposalItem  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProposalItem />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
