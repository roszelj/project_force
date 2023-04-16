import * as React from 'react';
import { render } from '@testing-library/react';

import { EpicMenu } from '..';

describe('<EpicMenu  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<EpicMenu />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
