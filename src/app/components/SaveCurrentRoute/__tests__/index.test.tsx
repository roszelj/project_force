import * as React from 'react';
import { render } from '@testing-library/react';

import { SaveCurrentRoute } from '..';

describe('<SaveCurrentRoute  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<SaveCurrentRoute />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
