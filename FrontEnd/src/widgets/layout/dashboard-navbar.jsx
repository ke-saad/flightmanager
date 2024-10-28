import { Navbar, Button, IconButton } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar } = controller;

  const { authState, logout } = useContext(AuthContext);
  const username = authState.username;  // Ensure this correctly maps to your user data structure

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/50"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex justify-between items-center w-full">
        {/* Logo Section */}
        <img src="/public/img/Logo2.png" alt="Site Logo" className="h-16" />

        {/* Enhanced Welcome Message and Username */}
        <div className="flex-grow">
          <div className="flex justify-center items-center cursor-pointer">
            <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-600 dark:text-blue-400 transition duration-300 ease-in-out transform hover:scale-110 hover:text-blue-800">
              Welcome, <span className="text-blue-700 dark:text-blue-300 font-bold">{username || 'Guest'}</span>!
            </span>
          </div>
        </div>

        {/* Right Section with User and Settings Icons */}
        <div className="flex items-center gap-4">
          {/* Log Out Button */}
          <Button
            variant="filled"
            color="lightBlue"
            className="hidden items-center gap-2 px-4 xl:flex normal-case hover:bg-red-700"
            onClick={() => logout()}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-5 w-5" />
            Log Out
          </Button>
          {/* Responsive Icon Button for Logout */}
          <IconButton
            variant="filled"
            color="lightBlue"
            className="grid xl:hidden hover:bg-blue-700"
            onClick={() => logout()}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-5 w-5" />
          </IconButton>
          {/* Settings Icon Button */}
          <IconButton
            variant="filled"
            color="lightBlue"
            className="hover:bg-blue-700"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
