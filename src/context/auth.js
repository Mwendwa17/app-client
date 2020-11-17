import React, { createContext, useReducer } from 'react'
import jwtDecode from 'jwt-decode'

const initialState = {
     user: null
}

if (localStorage.getItem('authenticate')) {
     const decoded_token = jwtDecode(localStorage.getItem('authenticate'));
     if (decoded_token.exp * 1000 < Date.now()) {
          localStorage.removeItem('authenticate')
     } else {
          initialState.user = decoded_token;
     }
}

const AuthContext = createContext({
     user: null,
     login: (user_data) => {},
     logout: () => {}
})

function authReducer(state, action) {

     switch (action.type) {
          case 'LOGIN':
               return {
                    ...state,
                    user: action.payload
               }
          case 'LOGOUT':
               return {
                    ...state,
                    user: null
               }
          default:
               return state
     }

}

function AuthProvider(props) {

     const [state, dispatch] = useReducer(authReducer, initialState)
     function login(user_data) {
          localStorage.setItem('authenticate', user_data.token);
          dispatch({
               type: 'LOGIN',
               payload: user_data
          })
     }

     function logout() {
          localStorage.removeItem('authenticate');
          dispatch({
               type: 'LOGOUT'
          })
     }

     return (
          <AuthContext.Provider
               value={{ user: state.user, login, logout }}
               {...props}
          />
     )

}

export { AuthContext, AuthProvider }
