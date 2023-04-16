import * as React from 'react';
import { render } from '@testing-library/react';

import { StoriesAccordian } from '..';

describe('<StoriesAccordian  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<StoriesAccordian />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
