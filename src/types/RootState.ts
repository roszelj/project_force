import { GithubRepoFormState } from 'app/pages/HomePage/Features/GithubRepoForm/slice/types';
import { ThemeState } from 'styles/theme/slice/types';
import { ProposalListState } from 'app/components/Proposal/view/list/ProposalList/slice/types';
import { ProposalDetailState } from 'app/components/Proposal/view/item/ProposalItemDetail/slice/types';
import { ProposalFormState } from 'app/components/Proposal/forms/ProposalForm/slice/types';
import { LoginState } from 'app/components/LoginForm/slice/types';
import { ProposalPaymentState } from 'app/pages/PaymentSuccessful/slice/types';
import { PaymentScheduleState } from 'app/components/ProjectStartCost/slice/types';
/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life. 
  So, not available always
*/
export interface RootState {
  theme?: ThemeState;
  githubRepoForm?: GithubRepoFormState;
  proposalList?: ProposalListState;
  proposalDetail?: ProposalDetailState;
  proposalForm?: ProposalFormState;
  login?: LoginState;
  proposalPayment?: ProposalPaymentState;
  paymentSchedule?: PaymentScheduleState;}
