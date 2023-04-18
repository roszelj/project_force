import * as React from 'react';
import { render } from '@testing-library/react';

import { AssetManager } from '..';

describe('<AssetManager  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<AssetManager />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
