import * as React from 'react';
import { render } from '@testing-library/react';

import { LoginPage } from '..';

describe('<LoginPage  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<LoginPage />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
