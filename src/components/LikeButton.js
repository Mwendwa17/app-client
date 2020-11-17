import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'

function LikeButton({ user, project: { id, likes, likeCount } }) {

     const [liked, setLiked] = useState(false);

     useEffect(() => {
          if (user && likes.find((like) => like.username === user.username)) {
               setLiked(true)
          } else {
               setLiked(false)
          }
     }, [user, likes]);

     const [likeProject] = useMutation(LIKE_PROJECT_MUTATION, {
          variables: {projectId: id}
     });

     const likeButton = user ? (
          liked ? (
               <span style={{ color: 'deeppink', fontFamily: 'Richie Brusher', cursor: 'pointer' }}>liked</span>
          ) : (
               <span style={{ fontFamily: 'Richie Brusher', cursor: 'pointer' }}>like</span>
          )
     ) : (
          <Link to='/login'>
               <span style={{ fontFamily: 'Richie Brusher', cursor: 'pointer' }}>like</span>
          </Link>
     )

     return (
          <span style={{ fontSize: '20px' }} onClick={likeProject}>
               {likeButton}
               <span style={{ color: '#34495E', fontFamily: 'Roboto' }}>({likeCount}) </span>
          </span>
     )

}

const LIKE_PROJECT_MUTATION = gql`
     mutation likeProject($projectId: ID!){
          likeProject(projectId: $projectId){
               id
               likes{
                    id
                    username
               }
               likeCount
          }
     }
`

export default LikeButton;
