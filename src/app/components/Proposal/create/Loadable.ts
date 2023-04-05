/**
 *
 * Asynchronously loads the component for ProposalForm
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProposalFormOld = lazyLoad(
  () => import('./index'),
  module => module.ProposalFormOld,
);
