import * as React from 'react';
import { render } from '@testing-library/react';

import { TabNavigation } from '..';

describe('<TabNavigation  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<TabNavigation />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
