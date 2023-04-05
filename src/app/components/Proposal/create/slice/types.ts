/* --- STATE --- */
export interface ProposalState {
  loading: boolean;
  form_data: {
    id: string;
    name: string;
    project_items: any[];
  };
}
