import * as React from 'react';
import { render } from '@testing-library/react';

import { InviteModal } from '..';

describe('<InviteModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<InviteModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
