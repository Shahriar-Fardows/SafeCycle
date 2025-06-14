import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile,sendEmailVerification} from "firebase/auth";

import PropTypes from "prop-types";
import { auth } from "../Firebase/Firebase";

export const Contexts = createContext();

const Context = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication state observer
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  // Google login
  const provider = new GoogleAuthProvider();
  const google = () => {
    setLoading(true);
    return signInWithPopup(auth, provider).finally(() => setLoading(false));
  };

  // Name, Email, and Password Register
  const createUser = (name, email, password) => {
  setLoading(true);
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Update display name
      return updateProfile(user, { displayName: name }).then(() => {
        // Send email verification
        return sendEmailVerification(user);
      });
    })
    .catch((error) => {
      console.error("Registration Error:", error.message);
      throw error;
    })
    .finally(() => setLoading(false));
};



  // Email and Password Login
  const loginUser = (email, password) => {
  setLoading(true);
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }
      return userCredential;
    })
    .finally(() => setLoading(false));
};


  // Forgot password
  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Log out
  const LogOut = () => {
    setLoading(true);
    return signOut(auth)
      .then(() => setUser(null))
      .finally(() => setLoading(false));
  };

  // Context value
  const info = {
    user,
    loading,
    google,
    createUser,
    loginUser,
    forgotPassword,
    LogOut,
  };

  return <Contexts.Provider value={info}>{children}</Contexts.Provider>;
};

Context.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Context;