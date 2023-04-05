import * as React from 'react';
import { render } from '@testing-library/react';

import { LandingPage } from '..';

describe('<LandingPage  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<LandingPage />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
