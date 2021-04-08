import React, {useState, useEffect, useContext, createContext} from 'react';
import {createUser} from '@/lib/db';
import firebase from '@/lib/firebase';

const authContext = createContext();

export function AuthProvider({children}) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>
    {children}
  </authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser(rawUser);

      createUser(user.uid, user);
      setUser(user);
      return user;
    } else {
      setUser(false);
      return false;
    }
  };

  const signInWithGithub = async () => {
    setLoading(true);
    const response = await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GithubAuthProvider());
    return handleUser(response.user);
  };

  const signInWithGoogle = async (redirect) => {
    setLoading(true);
    const response = await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());
    handleUser(response.user);
    if (redirect) {
      Router.push(redirect);
    }
  };

  const signout = () => {
    return firebase
        .auth()
        .signOut()
        .then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    signInWithGithub,
    signInWithGoogle,
    signout,
  };
}

const formatUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  };
};
