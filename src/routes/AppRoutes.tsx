import { Navigate, Route, Routes } from "react-router-dom";

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
import ProductionDrafts from "../pages/production/ProductionDrafts";
import PendingQA from "../pages/production/PendingQA";
import CompletedProductions from "../pages/production/CompletedProductions";
import RequestEdit from "../pages/production/RequestEdit";

import QALayout from "../layouts/QALayout";
import QADashboard from "../pages/qa/QADashboard";
import QAReview from "../pages/qa/QAReview";
import QANotifications from "../pages/qa/QANotifications";
import QAPendingReviews from "../pages/qa/QAPendingReviews";
import QAApprovedReviews from "../pages/qa/QAApprovedReviews";
import QAOnHoldReviews from "../pages/qa/QAOnHoldReviews";
import QARejectedReviews from "../pages/qa/QARejectedReviews";


const Unauthorized = () => (
  <div>Unauthorized</div>
);


const TechnicalDashboard = () => (
  <div>Technical Dashboard - Coming Soon</div>
);


const AdminDashboard = () => (
  <div>Admin Dashboard - Coming Soon</div>
);


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

            {/* Drafts */}
            <Route
              path="drafts"
              element={<ProductionDrafts />}
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


            {/* ==================================================
                NEXT STAGES

                This does NOT have a separate page.

                Clicking "Next Stages" from the sidebar
                directly opens the existing Stage Selection page.

                The employee can select:
                - Reaction
                - Washing
                - Distillation
                - etc.
                - The same stage again if required

                Selecting the same stage again will generate
                a new lot number.
            ================================================== */}

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

           <Route
              path="pending"
              element={<QAPendingReviews />}
            />

            <Route
              path="approved"
              element={<QAApprovedReviews />}
            />

            <Route
              path="on-hold"
              element={<QAOnHoldReviews />}
            />

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
            element={<TechnicalDashboard />}
          />

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
            element={<AdminDashboard />}
          />

        </Route>

      </Route>


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