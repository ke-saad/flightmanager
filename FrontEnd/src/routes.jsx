import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUsers, faPlane, faMapMarkerAlt, faClipboardList, faUserCircle, faCalculator } from "@fortawesome/free-solid-svg-icons";
import { Home, Profile,Tables, UserManagement, AccountingManagement, AirportManagement, BookingManagement, FlightManagement } from "@/pages/dashboard";
import AircraftManagement from './pages/dashboard/AircraftManagement';
import { SignIn, SignUp, ForgotPassword } from "@/pages/auth";
import ResetPassword from '@/pages/auth/ResetPassword';

const icon = {
  className: "w-5 h-5 text-inherit",
};

const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <FontAwesomeIcon icon={faHome} {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <FontAwesomeIcon icon={faUsers} {...icon} />,
        name: "User Management",
        path: "/user-management",
        element: <UserManagement />,
      },
      {
        icon: <FontAwesomeIcon icon={faPlane} {...icon} />,
        name: "Aircraft Management",
        path: "/aircraft-management",
        element: <AircraftManagement />,
      },
      {
        icon: <FontAwesomeIcon icon={faMapMarkerAlt} {...icon} />,
        name: "Airport Management",
        path: "/airport-management",
        element: <AirportManagement />,
      },
      {
        icon: <FontAwesomeIcon icon={faClipboardList} {...icon} />,
        name: "Flight Management",
        path: "/flight-management",
        element: <FlightManagement />,
      },
      {
        icon: <FontAwesomeIcon icon={faUsers} {...icon} />,
        name: "Booking Management",
        path: "/booking-management",
        element: <BookingManagement />,
      },
      {
        icon: <FontAwesomeIcon icon={faCalculator} {...icon} />,
        name: "Accounting Management",
        path: "/accounting-management",
        element: <AccountingManagement />,
      },
      {
        icon: <FontAwesomeIcon icon={faUserCircle} {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <FontAwesomeIcon icon={faUsers} {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        icon: <FontAwesomeIcon icon={faUserCircle} {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <FontAwesomeIcon icon={faUserCircle} {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <FontAwesomeIcon icon={faUserCircle} {...icon} />,
        name: "forgot password",
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        icon: <FontAwesomeIcon icon={faUserCircle} {...icon} />,
        name: "reset password",
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
];

export default routes;
