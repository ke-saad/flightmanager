import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import routes from "@/routes";

export function Auth() {
  const navbarRoutes = [
    {
      name: "dashboard",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    },
    {
      name: "profile",
      path: "/dashboard/home",
      icon: UserIcon,
    },
    {
      name: "sign up",
      path: "/auth/sign-up",
      icon: UserPlusIcon,
    },
    {
      name: "sign in",
      path: "/auth/sign-in",
      icon: ArrowRightOnRectangleIcon,
    },
    {
      name: "forgot password",
      path: "/auth/forgotpassword",
      icon: EnvelopeOpenIcon, // The icon imported above, or whichever icon you choose
    },
    {
      name: "reset password",
      path: "/auth/resetpassword",
      icon: EnvelopeOpenIcon, // The icon imported above, or whichever icon you choose
    },
  ];

  return (
    
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(({ layout, pages }) => {
          console.log(layout, pages); // Check layout and pages
          return layout === "auth" && pages.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ));
        })}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
