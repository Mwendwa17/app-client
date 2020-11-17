import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import ProjectCard from '../components/ProjectCard'
import PostProject from '../components/PostProject'

import { FETCH_PROJECTS_QUERY } from '../utils/graphql'

function Home() {

     const { user } = useContext(AuthContext);
     const { loading, data: { getProjects: projects } ={} } = useQuery(FETCH_PROJECTS_QUERY);

     return (
          <Grid columns={3} divided>
               <Grid.Row>
                    <h1>Recent Projects</h1>
               </Grid.Row>
               <Grid.Row>
                    {user && (
                         <Grid.Column>
                              <PostProject>

                              </PostProject>
                         </Grid.Column>
                    )}
                    {loading ? (
                         <h1>loading projects...</h1>
                    ) : (
                         <Transition.Group>
                              {
                                   projects && projects.map(project => (
                                        <Grid.Column key={project.id} style={{marginBottom: 20}}>
                                             <ProjectCard project={project}/>
                                        </Grid.Column>
                                   ))
                              }
                         </Transition.Group>
                    )}
               </Grid.Row>
          </Grid>
     )
}

export default Home;
