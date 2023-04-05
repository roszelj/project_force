import * as React from 'react';
import { render } from '@testing-library/react';

import { RegisterPage } from '..';

describe('<RegisterPage  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RegisterPage />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
