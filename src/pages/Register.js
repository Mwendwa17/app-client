import React, { useContext, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Form } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import { useForm } from '../utils/hooks'

function Register(props) {

     const context = useContext(AuthContext);
     const [errors, setErrors] = useState({});

     const { onChange, onSubmit, values } = useForm(registerUser, {
          email: '',
          username: '',
          password: '',
          confirmPassword: ''
     })

     const [addUser, { loading }] = useMutation(REGISTER_USER, {
          update(_, { data: { register: user_data} } ){
               context.login(user_data);
               props.history.push('/');
          },
          onError(err){
               setErrors(err.graphQLErrors[0].extensions.exception.errors);
          },
          variables: values
     })

     function registerUser() {
          addUser()
     }

     return (
          <div className='form-container'>
               <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                    <h1>Register Page</h1>
                    <Form.Input label='Email' placeholder='Email' type='email' name='email' value={values.email} error={errors.email ? true : false} onChange={onChange} />
                    <Form.Input label='Username' placeholder='Username' type='text' name='username' value={values.username} error={errors.username ? true : false} onChange={onChange} />
                    <Form.Input label='Password' placeholder='Password' type='password' name='password' value={values.password} error={errors.password ? true : false} onChange={onChange} />
                    <Form.Input label='Confirm Password' placeholder='Confirm Password' type='password' name='confirmPassword' value={values.confirmPassword} error={errors.confirmPassword ? true : false} onChange={onChange} />
                    <button type="submit" style={{color: '#fff', background: '#007bff', border: 'none', padding: '0.4375rem 1.25rem', fontSize: '24px' }}>Register</button>
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

const REGISTER_USER = gql`
     mutation register(
          $email: String!
          $username: String!
          $password: String!
          $confirmPassword: String!
     ) {
          register(
               registerInput: {
                    email: $email
                    username: $username
                    password: $password
                    confirmPassword: $confirmPassword
               }
          ) {
               id email username createdAt token
          }
     }
`

export default Register;
