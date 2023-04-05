/* --- STATE --- */
export interface LoginState {
  loading: boolean;
  username: string;
  password: string;
  cpassword: string;
  email: string;
  name: string;
  company: string;
  firstLogin: boolean;
  reset: boolean;
  error?: any;
  currentUser: any;
}
