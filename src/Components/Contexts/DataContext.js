import { createContext, useEffect, useState, useCallback } from "react";
import { auth } from "../firebase";
import { backendUrl } from "../../BackendUrl";
import axios from "axios";
import { toast } from "react-toastify";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [roadmapData, setRoadMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current authenticated user and user token
  const getCurrentUser = useCallback(() => {
    setLoading(true); // Start loading when fetching user
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
          if (user.displayName) {
            setUser(user); // Set user if displayName exists
          } else {
            const fetchedUsername = await fetchAccountName(token);
            setUser({ ...user, displayName: fetchedUsername }); // Update user with fetched name
          }
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      } else {
        setUser(null); // No logged-in user
      }
      setLoading(false); // End loading
    });
  }, []);

  useEffect(() => {
    getCurrentUser(); // Fetch user on mount
  }, [getCurrentUser]);

  useEffect(() => {
    if (user?.uid && idToken) {
      fetchRoadMap(user, idToken);
    }
  }, [user, idToken]);

  const fetchAccountName = async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/getUserName`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.data?.name || null;
    } catch (error) {
      console.error("Error fetching account name:", error);
      return null;
    }
  };

  const fetchRoadMap = async (userInfo, tokenInfo) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/getRoadMap`, {
        params: { uid: userInfo.uid },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenInfo}`,
        },
      });
      setRoadMapData(response.status === 200 ? response.data.data : null);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setIdToken("");
      setRoadMapData(null);
      toast.success("Logged out successfully!", {
        position: "top-center",
        autoClose: 10,
        hideProgressBar: false,
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout. Please try again.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        fetchRoadMap,
        roadmapData,
        user,
        logout,
        getCurrentUser,
        loading,
        idToken,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
