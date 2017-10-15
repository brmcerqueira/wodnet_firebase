// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAoLfIRbb5LbT3S1wEevhoV59gagCJ45qo',
    authDomain: 'shining-heat-9395.firebaseapp.com',
    databaseURL: 'https://shining-heat-9395.firebaseio.com',
    projectId: 'shining-heat-9395',
    storageBucket: '',
    messagingSenderId: '598741181525'
  },
  iceServers: [
    { urls: 'stun:stun.services.mozilla.com'},
    { urls: 'stun:stun.l.google.com:19302'},
    { urls: 'turn:numb.viagenie.ca', credential: 'webrtc', username: 'websitebeaver@mail.com'}
  ]
};
