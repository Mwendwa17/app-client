import { gql } from '@apollo/client'

export const FETCH_PROJECTS_QUERY = gql`
     {
          getProjects{
               id title description username createdAt likeCount commentCount
               comments{
                    id body createdAt
               }
               likes{
                    id createdAt
               }
          }
     }
`
