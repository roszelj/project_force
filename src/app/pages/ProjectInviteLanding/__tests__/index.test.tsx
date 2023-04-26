import * as React from 'react';
import { render } from '@testing-library/react';

import { ProjectInviteLanding } from '..';

describe('<ProjectInviteLanding  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProjectInviteLanding />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
