import React, { useContext, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Form } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import { useForm } from '../utils/hooks'

function Login(props) {

     const context = useContext(AuthContext);
     const [errors, setErrors] = useState({});

     const { onChange, onSubmit, values } = useForm(loginUserCallback, {
          username: '',
          password: ''
     })

     const [loginUser, { loading }] = useMutation(LOGIN_USER, {
          update(_, { data: { login: user_data } } ){
               context.login(user_data);
               props.history.push('/');
          },
          onError(err){
               setErrors(err.graphQLErrors[0].extensions.exception.errors);
          },
          variables: values
     })

     function loginUserCallback() {
          loginUser()
     }

     return (
          <div className='form-container'>
               <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                    <h1>Login Page</h1>
                    <Form.Input label='Username' placeholder='Username' type='text' name='username' value={values.username} error={errors.username ? true : false} onChange={onChange} />
                    <Form.Input label='Password' placeholder='Password' type='password' name='password' value={values.password} error={errors.password ? true : false} onChange={onChange} />
                    <button type="submit" style={{color: '#fff', background: '#007bff', border: 'none', padding: '0.4375rem 1.25rem', fontSize: '24px' }}>Login</button>
               </Form>
               {Object.keys(errors).length > 0 && (
                    <div className='ui error message'>
                         <ul className='list'>
                              {Object.values(errors).map((value) => (
                                   <li key={value}>{value}</li>
                              ))}
                         </ul>
                    </div>
               )}
          </div>
     )
}

const LOGIN_USER = gql`
     mutation login(
          $username: String!
          $password: String!
     ) {
          login(
                    username: $username password: $password
          ) {
               id email username createdAt token
          }
     }
`

export default Login;
