import * as React from 'react';
import { render } from '@testing-library/react';

import { EpicEditModal } from '..';

describe('<EpicEditModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<EpicEditModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
