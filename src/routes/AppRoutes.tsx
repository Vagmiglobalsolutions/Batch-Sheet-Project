import {
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Login from "../pages/auth/Login";

import ProductionLayout from "../layouts/ProductionLayout";
import ProductionDashboard from "../pages/production/ProductionDashboard";
import StartNewProduction from "../pages/production/StartNewProduction";
import StageSelection from "../pages/production/StageSelection";
import GenerateLotNumber from "../pages/production/GenerateLotNumber";
import StageForm from "../pages/production/StageForm";
import ProductionNotifications from "../pages/production/ProductionNotifications";
import ActiveProductions from "../pages/production/ActiveProductions";
import PendingQA from "../pages/production/PendingQA";
import CompletedProductions from "../pages/production/CompletedProductions";
import RequestEdit from "../pages/production/RequestEdit";
import StockLeft from "../pages/production/StockLeft";

import QALayout from "../layouts/QALayout";
import QADashboard from "../pages/qa/QADashboard";
import QAReview from "../pages/qa/QAReview";
import QANotifications from "../pages/qa/QANotifications";
import QAPendingReviews from "../pages/qa/QAPendingReviews";
import QAApprovedReviews from "../pages/qa/QAApprovedReviews";
import QAOnHoldReviews from "../pages/qa/QAOnHoldReviews";
import QARejectedReviews from "../pages/qa/QARejectedReviews";

import TechnicalLayout from "../layouts/TechnicalLayout";
import TechnicalDashboard from "../pages/technical/TechnicalDashboard";
import TechnicalProducts from "../pages/technical/TechnicalProducts";
import TechnicalReactorMachines from "../pages/technical/TechnicalReactorMachines";
import AssignEmployeesToProduct from "../pages/technical/AssignEmployeesToProduct";
import TechnicalStageConfiguration from "../pages/technical/TechnicalStageConfiguration";
import TechnicalForms from "../pages/technical/TechnicalForms";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEmployeeManagement from "../pages/admin/AdminEmployeeManagement";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminBatchSheets from "../pages/admin/AdminBatchSheets";
import AdminRejectedBatchSheets from "../pages/admin/AdminRejectedBatchSheets";
import AdminAuditLogs from "../pages/admin/AdminAuditLogs";
import AdminNotifications from "../pages/admin/AdminNotifications";
import AdminPendingStock from "../pages/admin/AdminPendingStock";
import AdminEditRequests from "../pages/admin/AdminEditRequests";

import { ProductProvider } from "../context/ProductContext";


const Unauthorized = () => (
  <div>Unauthorized</div>
);


/* ==================================================
    TEMPORARY TECHNICAL PAGES

    These will be replaced with the actual Technical
    pages as we build them.
================================================== */


const AppRoutes = () => {
  return (
    <Routes>

      {/* ==================================================
          PUBLIC
      ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />


      {/* ==================================================
          AUTHENTICATED USERS
      ================================================== */}

      <Route element={<ProtectedRoute />}>

        {/* ==================================================
            SHARED PRODUCT MASTER
        ==================================================

            ProductProvider sits above every authenticated
            portal that may read or modify the Product Master.

            This creates one shared Product Master for:
            - Technical
            - Admin

            TechnicalDataProvider consumes ProductProvider
            inside TechnicalLayout.
        ================================================== */}

        <Route
          element={
            <ProductProvider>
              <Outlet />
            </ProductProvider>
          }
        >

          {/* ==================================================
              PRODUCTION
          ================================================== */}

          <Route
            element={
              <RoleRoute allowedRoles={["PRODUCTION"]} />
            }
          >

            <Route
              path="/production"
              element={<ProductionLayout />}
            >

              {/* Production Dashboard */}
              <Route
                index
                element={<ProductionDashboard />}
              />

              {/* Start New Production */}
              <Route
                path="start"
                element={<StartNewProduction />}
              />

              {/* Active Production */}
              <Route
                path="active"
                element={<ActiveProductions />}
              />

              {/* Pending QA/QC */}
              <Route
                path="pending"
                element={<PendingQA />}
              />

              {/* Stage Selection */}
              <Route
                path="select-stage"
                element={<StageSelection />}
              />

              {/* Generate Lot Number */}
              <Route
                path="generate-lot"
                element={<GenerateLotNumber />}
              />

              {/* Stage Form */}
              <Route
                path="stage-form"
                element={<StageForm />}
              />

              {/* Next Stages */}
              <Route
                path="next-stages"
                element={
                  <Navigate
                    to="/production/select-stage"
                    replace
                  />
                }
              />

              {/* Completed Productions */}
              <Route
                path="completed"
                element={<CompletedProductions />}
              />

              <Route
                path="stock-left"
                element={<StockLeft />}
            />

              {/* Request Edit */}
              <Route
                path="request-edit"
                element={<RequestEdit />}
              />

              {/* Production Notifications */}
              <Route
                path="notifications"
                element={<ProductionNotifications />}
              />

            </Route>

          </Route>


          {/* ==================================================
              QA / QC
          ================================================== */}

          <Route
            element={
              <RoleRoute allowedRoles={["QA"]} />
            }
          >

            <Route
              path="/qa"
              element={<QALayout />}
            >

              {/* QA Dashboard */}
              <Route
                index
                element={<QADashboard />}
              />

              {/* QA Review */}
              <Route
                path="review/:lotNumber"
                element={<QAReview />}
              />

              {/* QA Notifications */}
              <Route
                path="notifications"
                element={<QANotifications />}
              />

              {/* Pending Reviews */}
              <Route
                path="pending"
                element={<QAPendingReviews />}
              />

              {/* Approved Reviews */}
              <Route
                path="approved"
                element={<QAApprovedReviews />}
              />

              {/* On Hold Reviews */}
              <Route
                path="on-hold"
                element={<QAOnHoldReviews />}
              />

              {/* Rejected Reviews */}
              <Route
                path="rejected"
                element={<QARejectedReviews />}
              />

            </Route>

          </Route>


          {/* ==================================================
              TECHNICAL
          ================================================== */}

          <Route
            element={
              <RoleRoute allowedRoles={["TECHNICAL"]} />
            }
          >

            <Route
              path="/technical"
              element={<TechnicalLayout />}
            >

              {/* Technical Dashboard */}
              <Route
                index
                element={<TechnicalDashboard />}
              />

              {/* Products */}
              <Route
                path="products"
                element={<TechnicalProducts />}
              />

              {/* Reactor Machines */}
              <Route
                path="reactor-machines"
                element={<TechnicalReactorMachines />}
              />

              {/* Assign Employees to Products */}
              <Route
                path="assign-employees"
                element={<AssignEmployeesToProduct />}
              />

              {/* Process / Stage Configuration */}
              <Route
                path="stage-configuration"
                element={<TechnicalStageConfiguration />}
              />

              {/* Forms */}
              <Route
                path="forms"
                element={<TechnicalForms />}
              />

            </Route>

          </Route>


          {/* ==================================================
              ADMIN
          ================================================== */}

          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN"]} />
            }
          >

            <Route
              path="/admin"
              element={<AdminLayout />}
            >

              {/* Admin Dashboard */}
              <Route
                index
                element={<AdminDashboard />}
              />

               {/* Employee & User Management */}
                <Route
                  path="employees"
                  element={<AdminEmployeeManagement />}
                />

               <Route
                  path="products"
                  element={<AdminProducts />}
               />
   
              {/* Future Admin pages will be added here */}

               <Route
                path="pending-stock"
                element={<AdminPendingStock />}
              />

              <Route
                path="batch-sheets"
                element={<AdminBatchSheets />}
              />

              <Route
                path="edit-requests"
                element={<AdminEditRequests />}
              />

              <Route
                path="rejected-batch-sheets"
                element={<AdminRejectedBatchSheets />}
              />

              <Route
                path="audit-logs"
                element={<AdminAuditLogs />}
              />

              <Route
                path="notifications"
                element={<AdminNotifications />}
              />
            

            </Route>

          </Route>

        </Route>
        {/* closes ProductProvider Route */}

      </Route>
      {/* closes ProtectedRoute */}


      {/* ==================================================
          DEFAULT
      ================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
};


export default AppRoutes;