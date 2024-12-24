import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { DataContext } from "../Contexts/DataContext";
import LoadSpinner from "../LoadSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(DataContext);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  useEffect(() => {
    if (!loading) {
      setHasCheckedUser(true);
    }
  }, [loading]);

  if (loading) {
    return <LoadSpinner text="loading" />;
  }

  if (!hasCheckedUser) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
