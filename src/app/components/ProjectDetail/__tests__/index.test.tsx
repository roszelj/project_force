import * as React from 'react';
import { render } from '@testing-library/react';

import { ProjectDetail } from '..';

describe('<ProjectDetail  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProjectDetail />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
