import React from 'react'
import { gql, useMutation } from '@apollo/client'

import { Form } from 'semantic-ui-react'
import { useForm } from '../utils/hooks'
import { FETCH_PROJECTS_QUERY } from '../utils/graphql'

function PostProject() {

     const { values, onChange, onSubmit } = useForm(createProjectCallback, {
          title: '',
          description: ''
     });

     const [createProject, { error }] = useMutation(CREATE_PROJECT, {
          variables: values,
          update(proxy, result){
               const data = proxy.readQuery({
                    query: FETCH_PROJECTS_QUERY
               })
               // data.getProjects = [result.data.createProject, ...data.getProjects];
               proxy.writeQuery({
                    query: FETCH_PROJECTS_QUERY,
                    data: {
                         getProjects: [result.data.createProject, ...data.getProjects]
                    }
               });
               values.title = '';
               values.description = '';
          },
          onError(err) {
               return err;
          },
     });

     function createProjectCallback() {
          createProject()
     }

     return (
          <>
               <Form onSubmit={onSubmit}>
                    <h2>Create a project</h2>
                    <Form.Field>
                         <Form.Input
                              placeholder='project title'
                              name='title'
                              onChange={onChange}
                              value={values.title}
                              error={error ? true : false}
                         />
                         <Form.Input
                              placeholder='project description'
                              name='description'
                              onChange={onChange}
                              value={values.description}
                              error={error ? true : false}
                         />
                         <button type='submit' style={{ background: '#48C9B0', color: '#fff', border: 'none', padding: '0.4375rem 1.25rem', fontSize: '24px', borderRadius: '10px', marginBottom: '20px' }}>Submit</button>
                    </Form.Field>
               </Form>
               {error && (
                    <div className='ui error message' style={{ marginBottom: '20px' }}>
                         <ul>
                              <li>{error.graphQLErrors[0].message}</li>
                         </ul>
                    </div>
               )}
          </>
     )

}

const CREATE_PROJECT = gql`
     mutation createProject(
          $title: String!
          $description: String!
     ) {
          createProject(
               title: $title description: $description
          ) {
               id
               title
               description
               createdAt
               username
               likes {
                    id createdAt
               }
               likeCount
               comments {
                    id body createdAt
               }
               commentCount
          }
     }
`

export default PostProject;
