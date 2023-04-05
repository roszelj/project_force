import * as React from 'react';
import { render } from '@testing-library/react';

import { PaymentSuccessful } from '..';

describe('<PaymentSuccessful  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<PaymentSuccessful />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
