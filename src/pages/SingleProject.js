import React, { useContext, useRef, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import moment from 'moment'

import { AuthContext } from '../context/auth'

import { Card, Form, Grid, Image } from 'semantic-ui-react'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'

function SingleProject(props) {

     const projectId = props.match.params.projectId;
     const { user } = useContext(AuthContext);

     const commentInputRef = useRef(null);

     const [comment, setComment] = useState('');

     const { data: { getProject } = {} } = useQuery(FETCH_PROJECT_QUERY, {
          variables: {
               projectId
          }
     })

     const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
          update(){
               setComment('')
               commentInputRef.current.blur();
          },
          variables: {
               projectId,
               body: comment
          }
     })

     function deleteProjectCallback() {
          props.history.push('/');
     }

     let projectMarkup;

     if (!getProject) {
          projectMarkup = <p>loading...</p>
     } else {
          const { id, title, description, username, createdAt, likes, likeCount, comments, commentCount} = getProject;
          projectMarkup = (
               <Grid>
                    <Grid.Row>
                         <Grid.Column width={2}>
                              <Image floated='right' size='small' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                         </Grid.Column>
                         <Grid.Column width={10}>
                              <Card fluid>
                                   <Card.Content>
                                        <Card.Header>{username}</Card.Header>
                                        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                        <h2>{title}</h2>
                                        <Card.Description>{description}</Card.Description>
                                   </Card.Content>
                                   <hr/>
                                   <Card.Content extra>
                                        <LikeButton user={user} project={{ id, likes, likeCount}} />
                                        <span style={{ fontSize: '20px' }}>
                                             <span style={{ color: '#3498DB', fontFamily: 'Richie Brusher' }}>comments </span>
                                             <span style={{ color: '#34495E', fontFamily: 'Roboto' }}>({commentCount})</span>
                                        </span>
                                        {user && user.username === username && (
                                             <DeleteButton projectId={id} callback={deleteProjectCallback} />
                                        )}
                                   </Card.Content>
                              </Card>
                              {user && (
                                   <Card fluid>
                                        <Card.Content>
                                             <p>Add comment</p>
                                             <Form>
                                                  <div className='ui action input fluid'>
                                                       <input type='text' placeholder='comment' name='comment' value={comment} onChange={event => setComment(event.target.value)} ref={commentInputRef} />
                                                       <button type='submit' disabled={comment.trim() === ''}
                                                            onClick={submitComment} style={{ background: comment.trim() === '' ? '#d6dbdf' : '#007bff', color: '#fff', border: 'none', padding: '0.4375rem 1.25rem', fontSize: '24px', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer' }}>
                                                            submit
                                                       </button>
                                                  </div>
                                             </Form>
                                        </Card.Content>
                                   </Card>
                              )}
                              {comments.map(comment => (
                                   <Card fluid key={comment.id}>
                                        <Card.Content>
                                             {user &&  user.username === comment.username && (
                                                  <DeleteButton projectId={id} commentId={comment.id} />
                                             )}
                                             <Card.Header>{comment.username}</Card.Header>
                                             <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                             <Card.Description>{comment.body}</Card.Description>
                                        </Card.Content>
                                   </Card>
                              ))}
                         </Grid.Column>
                    </Grid.Row>
               </Grid>
          )
     }

     return projectMarkup;

}

const SUBMIT_COMMENT_MUTATION = gql`
     mutation($projectId: ID!, $body: String!){
          createComment(projectId: $projectId, body: $body){
               id
               comments{
                    id user username body createdAt
               }
               commentCount
          }
     }
`

const FETCH_PROJECT_QUERY = gql`
     query($projectId: ID!){
          getProject(projectId: $projectId){
               id title description username createdAt
               likes{
                    username
               }
               likeCount
               comments{
                    id username body createdAt
               }
               commentCount
          }
     }
`

export default SingleProject;
