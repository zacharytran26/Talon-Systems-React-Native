import React, {createContext, useState, useContext, useEffect} from 'react';
    const AuthContext = createContext({});
    

export function fAuthContext() {   

    return AuthContext;
}


export function AuthProvider({children}) {
    const [authUser, setAuthUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [url, setUrl] = useState('');

    const value = {
        url, setUrl,authUser, setAuthUser, isLoggedIn, setIsLoggedIn//, ssourl, setSsourl,
    };

    return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
    );

};


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }  
    return context;
}









