import * as React from 'react';
import { render } from '@testing-library/react';

import { CheckoutForm } from '..';

describe('<CheckoutForm  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<CheckoutForm />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
