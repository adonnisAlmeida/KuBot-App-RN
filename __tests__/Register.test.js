/**
 * @format
 */

import 'react-native';
import React from 'react';
//import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import RegisterScreen from '../app/screens/login/RegisterScreen';
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { URL_API } from '../app/constants/Other';
//import App from '../App'

function Apollo({children}) {
  //const user_state = useSelector(user)
  //const user_token = useSelector(userToken)

  /* const authLink = setContext((_, { headers }) => {
      //const token = user_state.token
      return {
          headers: {
              ...headers,
              authorization: user_token ? `JWT ${user_token}` : '',
          },
      }
  })

  const httpLink = createHttpLink({
      uri: URL_API,
  }) */

  const uploadLink = createUploadLink({
      uri: URL_API,
  })


  const client = new ApolloClient({
      link: ApolloLink.from([
          uploadLink,
      ]),
      cache: new InMemoryCache(),
  })
  //const client = new ApolloClient({
  //    link: createUploadLink({ URL_API }),
  //    cache: new InMemoryCache(),
  //})
  //const client = new ApolloClient({
  //    link: authLink.concat(uploadLink),
  //    cache: new InMemoryCache(),
  //})

  return (
      <ApolloProvider client={client}>
          {children}
      </ApolloProvider>
  )
}


it('renders correctly Registerrrr', () => {
  console.log("Testtt")
  renderer.create(<Apollo><RegisterScreen /></Apollo>);
});
