import * as React from 'react';
import { render } from '@testing-library/react';

import { EpicSelect } from '..';

describe('<EpicSelect  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<EpicSelect />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
