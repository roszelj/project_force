import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { Masthead } from './Masthead';
import { Features } from './Features';
import { PageWrapper } from 'app/components/PageWrapper';
import { ProposalList } from 'app/components/Proposal/view/list/ProposalList';
import { SaveCurrentRoute } from 'app/components/SaveCurrentRoute';

// 4.) Add delete option
// 7.) Clean out old code and get testing to work
// 8.) (X) Build on new BBD instance
// 9.) Setup email cloud function for (version changes, and comments, and payments)
// 11.) Add in comments feature for both client and me
// 14.) Add auto versioning when a proposal is changed/editied
// 15.) Finish the payment schedule logic and display and prompt future payments
// 16.) Add in the Objective summary fields
// 17.) Fix whatever is wrong with stripe checkout form on validation
// 19.) Build a better way to handle all the spread out firebase config

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="Prototype Proposal Generator"
          content="Get started build a proposal"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <ProposalList />
        <SaveCurrentRoute />
      </PageWrapper>
    </>
  );
}
