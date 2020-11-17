import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AuthContext } from '../context/auth'

import { Card, Image } from 'semantic-ui-react'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

function ProjectCard({ project: { id, title, description, username, likes, likeCount, commentCount, createdAt } }) {

     const { user } = useContext(AuthContext);

     return (
          <Card fluid>
               <Card.Content as={Link} to={`/projects/${id}`}>
                    <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                    <Card.Description>
                         <h3>{title}</h3>
                         <p>{description}.</p>
                    </Card.Description>
               </Card.Content>
               <Card.Content extra>
                    <LikeButton user={user} project={{ id, likes, likeCount}} />
                    <span style={{ fontSize: '20px' }}>
                         <Link to={`/projects/${id}`}>
                              <span style={{ color: '#3498DB', fontFamily: 'Richie Brusher' }}>comments </span>
                              <span style={{ color: '#34495E', fontFamily: 'Roboto' }}>({commentCount})</span>
                         </Link>
                    </span>
                    { user && user.username === username && <DeleteButton projectId={id} /> }
               </Card.Content>
          </Card>
     )

}

export default ProjectCard;
