/* --- STATE --- */
export interface LoginState {
  loading: boolean;
  password: string;
  cpassword: string;
  username: string;
  email: string;
  company: string;
  firstLogin: boolean;
  reset?: boolean;
  error?: any;
  profile: any;
  invited: any;
  currentUser: any;
}
