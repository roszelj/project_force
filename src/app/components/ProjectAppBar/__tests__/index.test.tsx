import * as React from 'react';
import { render } from '@testing-library/react';

import { ProjectAppBar } from '..';

describe('<ProjectAppBar  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProjectAppBar />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
