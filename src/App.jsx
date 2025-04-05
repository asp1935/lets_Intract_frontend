import React, { useEffect } from "react";
import AddPolitician from "./pages/AddPolitician";
import MemberManagement from "./pages/MemberManagement";
import PoliticianUpdation from "./pages/PoliticianUpdation";
import Configuration from "./pages/Configuration";
import Notification from "./pages/Notification";
import AddCustomer from "./components/AddCustomer";
import CustomerUpdation from "./components/CustomerUpdation";
import SelectPlan from "./components/SelectPlan";
import CreatePlan from "./components/CreatePlan";
import Home from "./components/Home";
import './components/application.css'
import Customer_Msg from "./components/Customer_Msg";
import Politician_Msg from "./components/Politician-Msg";
import Reports from "./components/Reports";
import AddStaff from "./components/AddStaff";
import AddAssociate from "./components/AddAssociate";
import StaffUpdation from "./components/StaffUpdation";
import AssociateUpdation from "./components/AssociateUpdation";

import EmployeeManagement from "./components/EmployeeManagement";
import AssociateUserDetails from "./components/AssociateUserDetails";
import AssociatePayout from "./components/AssociatePayout";
import AssociatePayoutSetting from "./components/AssociatePayoutSetting";
import AssociateHistory from "./components/AssociateHistory";
import StaffPayout from "./components/StaffPayout";
import StaffPayoutSetting from "./components/StaffPayoutSetting";
import StaffHistory from "./components/StaffHistory";
import StaffUserDetails from "./components/StaffUserDetails";
import Enquiry from "./components/Enquiry";
import Login from "./components/Login";

import { Route, Routes, BrowserRouter, NavLink } from 'react-router';
import Index from "./components/Index";
import GuestRoute from "./components/RouterComponent/GuestRoute";
import ProtededRoute from "./components/RouterComponent/ProtededRoute";
import { useDispatch } from "react-redux";
import { getloggedInUser } from "./api/adminApi";
import { setUserData } from "./redux/slice/UserSlice";
import { ToastContainer } from 'react-toastify';
import { showToast } from "./redux/slice/ToastSlice";
import AccountReport from "./components/AccountReport";
import AddPortfolio from "./pages/AddPortfolio";
import ManagePortfolio from "./pages/ManagePortfolio";

const App = () => {
  // const [activeContent, setActiveContent] = useState("home");
  // const [history, setHistory] = useState([]);  // Lift history state to App component

  // const handleMenuClick = (menu) => {
  //   setActiveContent(activeContent === menu ? null : menu);
  // };

  // const handleLogout = () => {
  //   alert("Logging out..."); // Replace with actual logout functionality
  // };

  const dispatch = useDispatch();

  const setCurrentLoggedInUser = async () => {
    try {
      const responce = await getloggedInUser();
      if (responce?.data) {
        dispatch(setUserData(responce.data))
        dispatch(showToast({ message: `Welcome Back ${responce.data.role || 'User'}` }))
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";

      dispatch(showToast({ message: errorMessage, type: 'error' }));
      window.alert(errorMessage);

      if (error.response?.status === 401) {
        return <NavLink to='\login' />

      }
    }
  }

  useEffect(() => {
    setCurrentLoggedInUser();

  }, [dispatch])

  return (
    <>
      <BrowserRouter>
        {/* <div className="flex h-screen"> */}
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path='/login' element={<Login />} />
          </Route>
          <Route element={<ProtededRoute />}>
            <Route path="/" element={<Index />}>
              <Route path="/" element={<Home />} />

              {/* Business Routes  */}
              <Route path="/business">
                <Route path="add" element={<AddCustomer />} />
                <Route path="plan" element={<SelectPlan type="business" />} />
                <Route path="member" element={<EmployeeManagement />} />
                <Route path="updation" element={<CustomerUpdation />} />
                <Route path="message" element={<Customer_Msg />} />
              </Route>

              {/* Plolitician Routes  */}
              <Route path="/politician">
                <Route path="add" element={<AddPolitician />} />
                <Route path="plan" element={<SelectPlan type="political" />} />
                <Route path="member" element={<MemberManagement />} />
                <Route path="updation" element={<PoliticianUpdation />} />
                <Route path="message" element={<Politician_Msg />} />
              </Route>

              {/* customer-portfolio Routeे  */}
              <Route path="/portfolio">
                <Route path="add" element={<AddPortfolio />} />
                <Route path="manage" element={<ManagePortfolio />} />
              </Route>

              {/* Staff Routes  */}
              <Route path="/staff">
                <Route path="add" element={<AddStaff />} />
                <Route path="updation" element={<StaffUpdation />} />
              </Route>

              {/* Associate Routes  */}
              <Route path="/associate">
                <Route path="add" element={<AddAssociate />} />
                <Route path="updation" element={<AssociateUpdation />} />
              </Route>

              {/* Associate Routes  */}
              <Route path="/associate">
                <Route path="add" element={<AddAssociate />} />
                <Route path="updation" element={<AssociateUpdation />} />
              </Route>

              {/* Account Routes  */}
              <Route path="/account">
                <Route path="staff-user-details" element={<StaffUserDetails />} />
                <Route path="staff-payout" element={<StaffPayout />} />
                <Route path="staff-payout-setting" element={<StaffPayoutSetting />} />
                <Route path="staff-history" element={<StaffHistory />} />

                <Route path="associate-user-details" element={<AssociateUserDetails />} />
                <Route path="associate-payout" element={<AssociatePayout />} />
                <Route path="associate-payout-setting" element={<AssociatePayoutSetting />} />
                <Route path="associate-history" element={<AssociateHistory />} />
                <Route path="reports" element={<AccountReport />} />
              </Route>

              <Route path='/notification' element={<Notification />} />
              <Route path='/configuration' element={<Configuration />} />
              <Route path='/create-plan' element={<CreatePlan />} />
              <Route path='/report' element={<Reports />} />
              <Route path='/enquiry' element={<Enquiry />} />






            </Route>
          </Route>
        </Routes>

        {/* <Index /> */}



        {/* Content Section with Top Padding to Prevent Overlapping */}
        {/* <div className="flex-grow p-4 pt-16">
          {activeContent === "home" && <Home />}
          {activeContent === "addPolitician" && <AddPolitician />}
          {activeContent === "employeeManagement" && <EmployeeManagement />}
          {activeContent === "memberManagement" && <MemberManagement />}
          {activeContent === "politicianUpdation" && <PoliticianUpdation />}
          {activeContent === "configuration" && <Configuration />}
          {activeContent === "notification" && <Notification />}
          {activeContent === "addCustomer" && <AddCustomer />}
          {activeContent === "customerUpdation" && <CustomerUpdation />}
          {activeContent === "selectPlan" && <SelectPlan />}
          {activeContent === "createPlan" && <CreatePlan />}
          {activeContent === "customerMsg" && <Customer_Msg />}
          {activeContent === "politicianMsg" && <Politician_Msg />}
          {activeContent === "reports" && <Reports />}
          {activeContent === "addStaff" && <AddStaff />}
          {activeContent === "addAssociate" && <AddAssociate />}
          {activeContent === "staffUpdation" && <StaffUpdation />}
          {activeContent === "associateUpdation" && <AssociateUpdation />}


            {activeContent === "associateUserDetails" && <AssociateUserDetails />}
            {activeContent === "associatePayout" && <AssociatePayout history={history} setHistory={setHistory} />}
            {activeContent === "associatePayoutsetting" && <AssociatePayoutSetting />}
            {activeContent === "accountReport" && <AccountReport />}
            {activeContent === "associateHistory" && <AssociateHistory history={history} />}
            {activeContent === "staffUserDetails" && <StaffUserDetails />}
            {activeContent === "staffPayoutsetting" && <StaffPayoutSetting />}
            {activeContent === "staffHistory" && <StaffHistory history={history} />}
            {activeContent === "staffPayout" && <StaffPayout history={history} setHistory={setHistory} />}
            {activeContent === "enquiry" && <Enquiry />}
          </div>  */}

        {/* </div> */}
        <ToastContainer position='top-right' autoClose={3000} theme='light' />

      </BrowserRouter >
    </>

  );
};

export default App;
