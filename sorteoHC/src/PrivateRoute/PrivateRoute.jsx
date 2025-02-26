import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext.jsx";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/Login" />;
};

export default PrivateRoute;
