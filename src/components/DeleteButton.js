import React from 'react'
import { gql, useMutation } from '@apollo/client'

import { FETCH_PROJECTS_QUERY } from '../utils/graphql'

function DeleteButton({ projectId, commentId, callback }) {

     // const [confirmOpen, setConfirmOpen ] = useState(false);
     const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_PROJECT_MUTATION;
     const [deleteProjectOrComment] = useMutation(mutation, {
          update(proxy){
               // setConfirmOpen(false)
               if (!commentId) {
                    const data = proxy.readQuery({
                         query: FETCH_PROJECTS_QUERY
                    })
                    // data.getProjects = data.getProjects.filter(p => p.id !== projectId);
                    const newdata = data.getProjects.filter(p => p.id !== projectId);
                    proxy.writeQuery({
                         query: FETCH_PROJECTS_QUERY,
                         data: {
                              getProjects: [...newdata]
                         }
                    })
               }
               if (callback) {
                    callback();
               }
          },
          variables: {
               projectId,
               commentId
          }
     })

     return (
          <span style={{ fontSize: '20px', color: '#E74C3C', fontFamily: 'Roboto Condensed Light', float: 'right', cursor: 'pointer' }} onClick={deleteProjectOrComment}>delete</span>
     )
}

const DELETE_PROJECT_MUTATION = gql`
     mutation deleteProject($projectId: ID!){
          deleteProject(projectId: $projectId)
     }
`

const DELETE_COMMENT_MUTATION = gql`
     mutation deleteComment($projectId: ID!, $commentId: ID!){
          deleteComment(projectId: $projectId, commentId: $commentId){
               id
               comments{
                    id user username body createdAt
               }
               commentCount
          }
     }
`

export default DeleteButton;
