import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

//
// TODO get rid of this hardcoded API_ENDPOINT, make it configurable !
//
// Note: the standard Feathers config approach doesn't work because this is next.js, so it has to work both on client and server
// (that's "universal Javascript" biting us again - really complicating a lot of things!) - an approach we could use is this:
//
// https://github.com/zeit/next.js/tree/canary/examples/with-universal-configuration-runtime
//
const API_ENDPOINT = 'http://localhost:3030'

// "forceNew": https://github.com/feathersjs/authentication/issues/662
const socket = io(API_ENDPOINT, {transports: ['websocket'], forceNew: true})

// We don't configure JWT storage, the next.js app (which is separate from the Feathers backend) manages the JWT via a cookie
const options = {}

const client = feathers()
  .configure(socketio(socket))
  .configure(auth(options))

client.service('/users')
client.service('/counters')

export default client