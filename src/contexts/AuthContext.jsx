import React, { createContext, useContext, useState, useEffect } from "react";
import {
  account,
  databases,
  DATABASE_ID,
  COLLECTION_ID_TEACHERS,
} from "../AppwriteConfig";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 52428800; // Maximum file size in Bytes
const TOTAL_STORAGE = 2147483648; // Total Storage In Bytes
const toastTimer = 1000;
const APP_NAME = "AcademicFileRelay";
const DomainURL = "https://academicfiles.netlify.app/";
const UrlsLimit = 10;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [User, setUser] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accountDetails = await account.get();
        setUser(accountDetails);
        CheckAdmin();
      } catch (error) {
        setUser(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogin = async (email, password) => {
    const toastId = toast.loading("Logging in...");
    try {
      await account.createEmailPasswordSession(email, password);
      setUser(true);
      toast.update(toastId, {
        render: "Logged in successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Invalid Credentials.",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(false);
      toast.info("Logged out successfully!", { autoClose: toastTimer });
    } catch (error) {
      toast.error("Failed to log out!", { autoClose: toastTimer });
    }
  };

  const CheckAdmin = async () => {
    try {
      const result = await account.getPrefs();
      setisAdmin(Object.keys(result).length === 1);
    } catch (error) {
      toast.error("Failed to fetch role!", { autoClose: toastTimer });
    }
  };

  const getUserPassword = async (documentId) => {
    try {
      const result = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentId
      );
      return result.password;
    } catch (error) {
      console.error("failed to get Password");
    }
  };

  const updatePassword = async (documentId, password) => {
    const toastId = toast.loading("Updating password...");
    try {
      await account.updatePassword(password, await getUserPassword(documentId));
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentId,
        { password }
      );
      toast.update(toastId, {
        render: "Password updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to update password!",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const updateEmail = async (documentId, email) => {
    const toastId = toast.loading("Updating email...");
    try {
      await account.updateEmail(email, await getUserPassword(documentId));
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentId,
        { email }
      );
      toast.update(toastId, {
        render: "Email updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to update email!",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const updateUsername = async (documentId, username) => {
    const toastId = toast.loading("Updating username...");
    try {
      await account.updateName(username);
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_TEACHERS,
        documentId,
        { username }
      );
      toast.update(toastId, {
        render: "Username updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to update username!",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };
  const blockAccount = async () => {
    const toastId = toast.loading("Blocking account...");
    try {
      await account.updateStatus();
      toast.update(toastId, {
        render: "Account blocked successfully!",
        type: "success",
        isLoading: false,
        autoClose: toastTimer,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to block account!",
        type: "error",
        isLoading: false,
        autoClose: toastTimer,
      });
    }
  };

  const contextValue = {
    MAX_FILE_SIZE,
    TOTAL_STORAGE,
    toastTimer,
    APP_NAME,
    DomainURL,
    UrlsLimit,
    User,
    handleLogin,
    handleLogout,
    isAdmin,
    updatePassword,
    updateEmail,
    updateUsername,
    blockAccount,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <Loader isMain={true} /> : children}
    </AuthContext.Provider>
  );
};
