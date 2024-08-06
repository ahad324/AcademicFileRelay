import React from "react";
import { Routes, Route } from "react-router-dom";
import Background from "../components/Background";
import Foreground from "../components/Foreground";
import Login from "../Auth/Login";
import Error from "../components/Error/Error";
import PrivateRoutes from "./PrivateRoutes";

import Dashboard from "../components/Dashboard/Dashboard";
// Dashboard Components
import Overview from "../components/Dashboard/Overview";
import Files from "../components/Dashboard/Files";
import Actions from "../components/Dashboard/Actions";
// Actions Components
import CreateTeacher from "../components/Dashboard/Actions/CreateTeacher";
import CreateURL from "../components/Dashboard/Actions/CreateURL";
import AllTeachers from "../components/Dashboard/Actions/AllTeachers";
import AllURLs from "../components/Dashboard/Actions/AllURLs";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className="w-full h-full">
            <Background />
            <Foreground />
          </section>
        }
      />
      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="files" element={<Files />} />
          <Route path="actions/*" element={<Actions />}>
            <Route path="createteacher" element={<CreateTeacher />} />
            <Route path="createurl" element={<CreateURL />} />
            <Route path="allteachers" element={<AllTeachers />} />
            <Route path="allurls" element={<AllURLs />} />
          </Route>
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default AppRoutes;
