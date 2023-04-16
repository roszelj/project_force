import * as React from 'react';
import { render } from '@testing-library/react';

import { StoryEditModal } from '..';

describe('<StoryEditModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<StoryEditModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
