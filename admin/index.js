const admin = require('firebase-admin');

// export GOOGLE_APPLICATION_CREDENTIALS="/Users/phoqe/Downloads/react-material-ui-firebase-firebase-adminsdk-ected-b81d61fd5e.json"

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://react-material-ui-firebase.firebaseio.com'
});

const auth = admin.auth();

setRoles = (uid, roles) => {
  auth.setCustomUserClaims(uid, {
    roles: roles
  }).then((value) => {
    console.log(`${uid}: ${roles}`);
  }).catch((reason) => {
    console.log(reason);
  });
};

setRoles('XlzQsnTab6bXGpUp7N7CP6Q5RPa2', [ 'admin', 'premium' ]);
