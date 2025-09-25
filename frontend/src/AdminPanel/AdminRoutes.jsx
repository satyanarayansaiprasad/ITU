import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewContact from "./Pages/ViewContact";
import FormSubmissions from "./Pages/FormSubmissions";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/viewcontact" element={<ViewContact />} />
      <Route path="/admin/form-submissions" element={<FormSubmissions />} />

    </Routes>
  );
};

export default AdminRoutes;
