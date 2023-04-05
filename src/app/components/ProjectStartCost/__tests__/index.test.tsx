import * as React from 'react';
import { render } from '@testing-library/react';

import { ProjectStartCost } from '..';

describe('<ProjectStartCost  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProjectStartCost />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
