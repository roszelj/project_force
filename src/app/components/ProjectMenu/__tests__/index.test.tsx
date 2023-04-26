import * as React from 'react';
import { render } from '@testing-library/react';

import { ProjectMenu } from '..';

describe('<ProjectMenu  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProjectMenu />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
