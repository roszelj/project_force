import * as React from 'react';
import { render } from '@testing-library/react';

import { StringAvatar } from '..';

describe('<StringAvatar  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<StringAvatar />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
