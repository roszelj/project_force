import * as React from 'react';
import { render } from '@testing-library/react';

import { ContributorsModal } from '..';

describe('<ContributorsModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ContributorsModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
