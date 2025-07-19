import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import { useUserPlan } from '../hooks/useUser';
import { formatDate } from '../utility/formatDate';
import { usePlan } from '../hooks/usePlan';
import { useAssociate } from '../hooks/useAssociate';
import { useGetRefCount, useStaff } from '../hooks/useStaffRef';
// import { useState } from 'react';

// Register Chart.js components and the datalabels plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Home = () => {


  const [expiringCustomers, setExpiringCustomers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("business");
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({
    totalUser: 0,
    advancePlanUserCnt: 0,
    basicPlanUserCnt: 0,

    businessCount: 0,
    basicPlanBUserCnt: 0,
    advancePlanBUserCnt: 0,

    politicalCount: 0,
    basicPlanPUserCnt: 0,
    advancePlanPUserCnt: 0,

    totalPlans: 0,
    advanceCount: 0,
    basicCount: 0,
    assoicateCount: 0,
    staffCount: 0,

  })

  const { data: customerData } = useUserPlan(null);
  const { data: planData } = usePlan();
  const { data: associateData } = useAssociate();
  const { data: staffData } = useStaff()
  const { data: staffRefCnt } = useGetRefCount(null, "staff");
  const { data: associateRefCnt } = useGetRefCount(null, "associate");

  // Load user data
  useEffect(() => {
    if (customerData?.data) {
      setUsers(customerData.data);
    }
  }, [customerData]);

  // useEffect(() => {

  //   const businessCount = users.filter(user => user.type === 'business' && user.role==='user').length;

  //   const politicalCount = users.filter(user => user.type === 'political' && user.role==='user').length;
  //   const basicPlanUserCnt = users.filter(user => user?.userPlans?.planDetails?.type === 'basic').length;
  //   const advancePlanUserCnt = users.filter(user => user?.userPlans?.planDetails?.type === 'advance').length;
  //   const basicPlanBUserCnt = users.filter(user => user.type === 'business' && user?.userPlans?.planDetails?.type === 'basic').length;
  //   const advancePlanBUserCnt = users.filter(user => user.type === 'business' && user?.userPlans?.planDetails?.type === 'advance').length;
  //   const basicPlanPUserCnt = users.filter(user => user.type === 'political' && user?.userPlans?.planDetails?.type === 'basic').length;
  //   const advancePlanPUserCnt = users.filter(user => user.type === 'political' && user?.userPlans?.planDetails?.type === 'advance').length;



  //   setCounts(prev => ({
  //     ...prev,
  //     totalUser: users.filter(user=>user.role==='user').length,
  //     businessCount: businessCount,
  //     politicalCount: politicalCount,
  //     basicPlanUserCnt: basicPlanUserCnt,
  //     advancePlanUserCnt: advancePlanUserCnt,
  //     basicPlanBUserCnt: basicPlanBUserCnt,
  //     advancePlanBUserCnt: advancePlanBUserCnt,
  //     basicPlanPUserCnt: basicPlanPUserCnt,
  //     advancePlanPUserCnt: advancePlanPUserCnt,
  //   }))
  // }, [users])
  useEffect(() => {
    let totalUser = 0;
    let businessCount = 0;
    let politicalCount = 0;

    let basicPlanUserCnt = 0;
    let advancePlanUserCnt = 0;

    let basicPlanBUserCnt = 0;
    let advancePlanBUserCnt = 0;

    let basicPlanPUserCnt = 0;
    let advancePlanPUserCnt = 0;

    users.forEach(user => {
      const isUser = user.role === 'user';
      const type = user.type;
      const planType = user?.userPlans?.planDetails?.type;

      if (isUser) {
        totalUser++;

        if (type === 'business') {
          businessCount++;
        } else if (type === 'political') {
          politicalCount++;
        }
      }

      if (planType === 'basic') {
        basicPlanUserCnt++;

        if (type === 'business') {
          basicPlanBUserCnt++;
        } else if (type === 'political') {
          basicPlanPUserCnt++;
        }
      } else if (planType === 'advance') {
        advancePlanUserCnt++;

        if (type === 'business') {
          advancePlanBUserCnt++;
        } else if (type === 'political') {
          advancePlanPUserCnt++;
        }
      }
    });

    setCounts(prev => ({
      ...prev,
      totalUser,
      businessCount,
      politicalCount,
      basicPlanUserCnt,
      advancePlanUserCnt,
      basicPlanBUserCnt,
      advancePlanBUserCnt,
      basicPlanPUserCnt,
      advancePlanPUserCnt,
    }));
  }, [users]);


  useEffect(() => {
    if (planData?.data.length > 0) {
      const advanceCount = planData.data.filter(plan => plan.type === 'advance').length;
      const basicCount = planData.data.filter(plan => plan.type === 'basic').length;
      setCounts(prev => ({
        ...prev,
        totalPlans: planData.data.length,
        advanceCount: advanceCount,
        basicCount: basicCount

      }))
    }
  }, [planData])

  useEffect(() => {
    if (associateData?.data.length > 0) {
      setCounts(prev => ({
        ...prev,
        assoicateCount: associateData.data.length,
      }))
    }
  }, [associateData])

  useEffect(() => {
    if (staffData?.data.length > 0) {
      setCounts(prev => ({
        ...prev,
        staffCount: staffData.data.length,
      }))
    }
  }, [staffData])

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    const upcomingExpirations = users
      .filter((user) => {
        if (user.type !== selectedCategory) return false;

        const expiryDate = user.userPlans?.endDate ? new Date(user.userPlans.endDate) : null;
        return expiryDate && expiryDate >= today;
      })
      .sort((a, b) => new Date(a.userPlans?.endDate) - new Date(b.userPlans?.endDate)); // Sort by expiry date

    setExpiringCustomers(upcomingExpirations);
  }, [selectedCategory, users]);


  // Function to determine expiry date color
  const getExpiryColor = (expiryDate) => {
    if (!expiryDate) return "text-gray-500";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expDate = new Date(expiryDate);
    if (isNaN(expDate)) return "text-gray-500"; // Handle invalid date

    const daysRemaining = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 7) return "text-red-500 font-bold"; // Urgent (red)
    if (daysRemaining <= 28) return "text-yellow-500 font-semibold"; // Warning (yellow)
    return "text-green-500 font-medium"; // Safe (green)
  };

  const pieChartData = {
    labels: ['Basic Plan', 'Advanced Plan'],
    datasets: [
      {
        data: [counts.basicCount, counts.advanceCount], // Example data (40 for Basic, 20 for Advanced)
        backgroundColor: ['#BE5985', '#36A2EB'], // Colors for the pie chart
        hoverBackgroundColor: ['#BE5985', '#36A2EB'],
        borderWidth: 2, // Add border to the chart
        borderColor: '#fff', // Border color
      },
    ],
  };

  return (
    <>
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="rounded-lg shadow-lg p-6 flex flex-col" style={{ backgroundImage: 'linear-gradient(-225deg, #E100FF, #7F00FF)', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
            <div className="flex items-center justify-between mx-1 mt-2">
              <img src="../../total_users (6).png" alt="Total Users" className="h-18 w-18 mr-2" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Total Users</h2>
                <p className="text-4xl font-bold text-yellow-500 text-center" style={{ textShadow: "3px 3px 10px rgba(80, 20, 56, 1)" }}>{counts.totalUser}</p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              {/* <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Current Month</p>
                <p className="text-2xl text-white font-bold">60</p>
              </div> */}
              <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Basic Plan</p>
                <p className="text-2xl text-white font-bold">{counts.basicPlanUserCnt}</p>
              </div>
              <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Advanced Plan</p>
                <p className="text-2xl text-white font-bold">{counts.advancePlanUserCnt}</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg shadow-lg p-6 flex flex-col" style={{ backgroundImage: 'linear-gradient(-225deg, #ed6ea0 0%, #ec8c69 100%)', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
            <div className="flex items-center justify-between mx-1 mt-2">
              <img src="../../business_user (2).png" alt="Total Users" className="h-20 w-19 mr-2" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Business</h2>
                <p className="text-4xl font-bold text-yellow-500 text-center" style={{ textShadow: "3px 3px 10px rgba(80, 20, 56, 1)" }}>{counts.businessCount}</p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              {/* <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Current Month</p>
                <p className="text-2xl text-white font-bold">40</p>
              </div> */}
              <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Basic Plan</p>
                <p className="text-2xl text-white font-bold">{counts.basicPlanBUserCnt}</p>
              </div>
              <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Advanced Plan</p>
                <p className="text-2xl text-white font-bold">{counts.advancePlanBUserCnt}</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg shadow-lg p-6 flex flex-col" style={{ backgroundImage: 'linear-gradient(-225deg, #4481eb 0%, #04befe 100%)', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
            <div className="flex items-center justify-between mx-1 mt-2">
              <img src="../../politician_user (2).png" alt="Total Users" className="h-20 w-22 mr-2" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Politician</h2>
                <p className="text-4xl font-bold text-yellow-500 text-center" style={{ textShadow: "3px 3px 10px rgba(80, 20, 56, 1)" }}>{counts.politicalCount}</p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              {/* <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Current Month</p>
                <p className="text-2xl text-white font-bold">80</p>
              </div> */}
              <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Basic Plan</p>
                <p className="text-2xl text-white font-bold">{counts.basicPlanPUserCnt}</p>
              </div>
              <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Advanced Plan</p>
                <p className="text-2xl text-white font-bold">{counts.advancePlanPUserCnt}</p>
              </div>
            </div>
          </div>

          {/* Card 4 - Pie Chart */}
          <div className="rounded-lg shadow-lg p-6 flex flex-col" style={{ background: 'linear-gradient(-225deg, #CB356B, #BD3F32)', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
            <div className="flex justify-center items-center h-full relative">
              <div className="w-45 h-48">
                <Doughnut
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%', // Adjust this value to change the size of the hole
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          font: {
                            size: 14,
                            weight: 'bold',
                          },
                          color: '#fff', // Legend text color
                        },
                      },
                      tooltip: {
                        backgroundColor: '#333',
                        titleFont: { size: 16 },
                        bodyFont: { size: 14 },
                        footerFont: { size: 12 },
                        padding: 10,
                      },
                      datalabels: {
                        color: '#fff', // Label text color
                        font: {
                          size: 14,
                          weight: 'bold',
                        },
                        formatter: (value) => {
                          return `${value}`; // Display the value (e.g., 40, 20)
                        },
                      },
                    },
                    elements: {
                      arc: {
                        borderWidth: 2,
                        borderColor: '#fff', // Border color for the arcs
                      },
                    },
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-200 font-bold text-sm text-center pb-14">
                  {`Plans: ${counts.totalPlans}`}
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-span-full flex justify-center gap-5 mt-5">
            <div className="rounded-lg shadow-lg p-6 flex flex-col" style={{ backgroundImage: 'linear-gradient(-225deg, #06beb6, #48b1bf)', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
              <div className="flex items-center justify-between mx-1 mt-2">
                <img src="../../associates (2).png" alt="Total Users" className="h-20 w-20 mr-2" />
                <div>
                  <p>Referenced by -</p>
                  <h2 className="text-2xl font-bold text-white mb-2">Associates</h2>
                  <p className="text-4xl font-bold text-yellow-500 text-center" style={{ textShadow: "3px 3px 10px rgba(80, 20, 56, 1)" }}>{associateRefCnt?.totalReferrals || 0}</p>
                </div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="rounded-lg shadow-lg p-6 flex flex-col" style={{ backgroundImage: 'linear-gradient(-225deg, #F2994A, #F2994A)', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
              <div className="flex items-center justify-between mx-1 mt-2">
                <img src="../../staff.png" alt="Total Users" className="h-18 w-18 mr-2" />
                <div>
                  <p>Referenced by -</p>
                  <h2 className="text-2xl font-bold text-white mb-2">Staff</h2>
                  <p className="text-4xl font-bold text-yellow-500 text-center" style={{ textShadow: "3px 3px 10px rgba(80, 20, 56, 1)" }}>{staffRefCnt?.totalReferrals || 0}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Card 1 */}
          {/* <div className="rounded-lg shadow-lg p-6 flex flex-col" style={{ backgroundImage: 'linear-gradient(-225deg, #2f9933, #45B649)', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
            <div className="flex items-center justify-between mx-1 mt-2">
              <img src="../../payout (2).png" alt="Total Users" className="h-20 w-18 mr-2 mt-3" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Payouts</h2>
                <p className="text-4xl font-bold text-yellow-500" style={{ textShadow: "3px 3px 10px rgba(80, 20, 56, 1)" }}>300k</p>
              </div>
            </div> */}
          {/* <div className="flex justify-center mt-14"> */}
          {/* <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Current Month</p>
                <p className="text-2xl text-white font-bold">60</p>
              </div> */}
          {/* <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Total Paid</p>
                <p className="text-2xl text-white font-bold">40</p>
              </div>
              <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Total Unpaid</p>
                <p className="text-2xl text-white font-bold">20</p>
              </div> */}
          {/* </div> */}
          {/* </div> */}

          {/* Card 1 */}
          {/* <div className="rounded-lg shadow-lg p-6 flex flex-col" style={{ backgroundImage: 'linear-gradient(-225deg, #2980b9, #2c3e50)', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}> */}
          {/* <div className="flex items-center justify-between mx-1 mt-2">
              <img src="../../total_sell.png" alt="Total Users" className="h-18 w-18 mr-2" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Total Sell</h2>
                <p className="text-4xl font-bold text-yellow-500" style={{ textShadow: "3px 3px 10px rgba(80, 20, 56, 1)" }}>800k</p>
              </div>
            </div> */}
          {/* <div className="flex justify-center mt-14"> */}
          {/* <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Current Month</p>
                <p className="text-2xl text-white font-bold">60</p>
              </div> */}
          {/* <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Business Users</p>
                <p className="text-2xl text-white font-bold">40</p>
              </div>
              <div className="flex flex-col items-center mx-4">
                <p className="font-semibold text-white text-center">Politician Users</p>
                <p className="text-2xl text-white font-bold">20</p>
              </div> */}
          {/* </div> */}
          {/* </div> */}


        </div>
      </div>

      <div className="Form p-6 mx-auto rounded-lg">

        {/* Dropdown for category selection */}
        <div className="mb-4 text-center">
          <label className="mr-2 font-extrabold text-[#92157d] uppercase">Select Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="business">Business</option>
            <option value="political">Politician</option>
          </select>
        </div>

        {expiringCustomers.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#b017a8] text-white uppercase text-sm leading-normal">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Mobile</th>
                <th className="border p-3 text-left">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {expiringCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-[#f1d5ef]">
                  <td className="border p-3">{customer.name}</td>
                  <td className="border p-3">{customer.email}</td>
                  <td className="border p-3">{customer.mobile}</td>
                  <td className={`border p-3 ${getExpiryColor(customer?.userPlans.endDate)}`}>{formatDate(customer?.userPlans?.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">No expiring plans found.</p>
        )}
      </div>

    </>
  );
};

export default Home;