import React, { useEffect, useState } from "react";
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

import { Route, Routes, BrowserRouter, NavLink, useLocation } from 'react-router';
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
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import SMSConfiguration from "./components/SMSConfiguration";
import SmsTemplete from "./components/SmsTemplete";
import OtpList from "./components/OtpList";

const App = () => {


  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const setCurrentLoggedInUser = async () => {
    try {
      const responce = await getloggedInUser();
      if (responce?.data) {
        dispatch(setUserData(responce.data))
        dispatch(showToast({ message: `Welcome Back ${responce.data.role || 'User'}` }))
      }

    } catch (error) {

      if (error.response?.status === 401) {
        if (location.pathname !== '/login') {
          window.location.replace('/login');
        }
      }

      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";

      dispatch(showToast({ message: errorMessage, type: 'error' }));
      // window.alert(errorMessage);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const isPublicRoute =
      location.pathname.startsWith('/portfolio') || location.pathname === '/404';

    if (!isPublicRoute) {
      setCurrentLoggedInUser();
    } else {
      setLoading(false)
    }
  }, []);
  if (loading) {
    return <div className="w-screen h-screen flex justify-center items-center text-lg font-medium">Loading...</div>;
  }


  return (

    <>
      {/* <div className="flex h-screen"> */}
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path='/login' element={<Login />} />
        </Route>

        <Route path="/portfolio/:userName" element={<Portfolio />} />
        <Route path="/404" element={<NotFound />} />

        <Route element={<ProtededRoute />}>
          <Route path="/" element={<Index />}>
            <Route path="/" element={<Home />} />

            {/* Business Routes  */}
            <Route element={<ProtededRoute allowedPermission="business" />}>
              <Route path="/business">
                <Route path="add" element={<AddCustomer />} />
                <Route path="plan" element={<SelectPlan type="business" />} />
                <Route path="member" element={<EmployeeManagement />} />
                <Route path="updation" element={<CustomerUpdation />} />
                <Route path="message" element={<Customer_Msg />} />
              </Route>
            </Route>

            {/* Plolitician Routes  */}
            <Route element={<ProtededRoute allowedPermission="politician" />}>
              <Route path="/politician">
                <Route path="add" element={<AddPolitician />} />
                <Route path="plan" element={<SelectPlan type="political" />} />
                <Route path="member" element={<MemberManagement />} />
                <Route path="updation" element={<PoliticianUpdation />} />
                <Route path="message" element={<Politician_Msg />} />
              </Route>
            </Route>

            {/* customer-portfolio Route  */}
            <Route element={<ProtededRoute allowedPermission="portfolio" />}>
              <Route path="/portfolio">
                <Route path="add" element={<AddPortfolio />} />
                <Route path="manage" element={<ManagePortfolio />} />
              </Route>
            </Route>

            {/* Staff Routes  */}
            <Route element={<ProtededRoute allowedPermission="staff" />}>
              <Route path="/staff">
                <Route path="add" element={<AddStaff />} />
                <Route path="updation" element={<StaffUpdation />} />
              </Route>
            </Route>

            {/* Associate Routes  */}
            <Route element={<ProtededRoute allowedPermission="associate" />}>
              <Route path="/associate">
                <Route path="add" element={<AddAssociate />} />
                <Route path="updation" element={<AssociateUpdation />} />
              </Route>
            </Route>

            {/* Associate Routes  */}
            {/* <Route element={<ProtededRoute allowedPermission="associate" />}>

            <Route path="/associate">
              <Route path="add" element={<AddAssociate />} />
              <Route path="updation" element={<AssociateUpdation />} />
            </Route> */}

            {/* Account Routes  */}
            <Route element={<ProtededRoute allowedPermission="account" />}>
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
            </Route>

            <Route element={<ProtededRoute allowedPermission="notification" />}>
              <Route path='/notification' element={<Notification />} />
            </Route>

            <Route element={<ProtededRoute allowedPermission="configuration" />}>
              {/* <Route path='/configuration' element={<Configuration />} /> */}
              <Route path="/configuration">
                <Route path='sms-configuration' element={<SMSConfiguration />} />
                <Route path='sms-templete' element={<SmsTemplete />} />
                <Route path='otp' element={<OtpList />} />
                
              </Route>
            </Route>

            <Route element={<ProtededRoute allowedPermission="plan" />}>
              <Route path='/create-plan' element={<CreatePlan />} />
            </Route>

            <Route element={<ProtededRoute allowedPermission="report" />}>
              <Route path='/report' element={<Reports />} />
            </Route>

            <Route element={<ProtededRoute allowedPermission="enquiry" />}>
              <Route path='/enquiry' element={<Enquiry />} />
            </Route>



          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes >

      <ToastContainer position='top-right' autoClose={3000} theme='light' />

    </>

  );
};

export default App;
