import React from "react";
import { Route, Switch } from "react-router";
import { LandingPage } from "./pages/Landing/LandingPage";
import { LandingPage as SwapLp } from "./pages/Landing/SwapLandingPage";
import AdminDashboard from "./pages/Admin/admin";
import { FLayout, FMain, FLoader, FContainer } from "ferrum-design-system";
import Header from "./header/header";

const Wrapper = () => {
  return (
    <>
      <Header />
      <FMain>
        <LandingPage />
      </FMain>
    </>
  )
}


const SwapWrapper = () => {
  return (
    <>
      <Header />
      <FMain>
        <SwapLp />
      </FMain>
    </>
  )
}

const BaseRoutes = () => {
  return (
    <Switch>
      <Route path="/admin" component={
        AdminDashboard
      }></Route>
      <Route path="/stake/:stakingId" component={
        Wrapper
      }></Route>
      <Route path="/swap/:stakingId" component={
        SwapWrapper
      }></Route>
    </Switch>
  );
};
export default BaseRoutes;
