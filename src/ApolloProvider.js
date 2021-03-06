import React from 'react'
import App from './App'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
     uri: 'https://tranquil-reaches-89499.herokuapp.com/'
});

const authLink = setContext(() => {
     const token = localStorage.getItem('authenticate');
     return {
          headers: {
               Authorization: token ? `Bearer ${token}` : ''
          }
     }
})

const client = new ApolloClient({
     link: authLink.concat(httpLink),
     cache: new InMemoryCache()
});

export default (
     <ApolloProvider client={client}>
          <App />
     </ApolloProvider>
);
