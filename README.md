# nexus-plugin-firebase <!-- omit in toc -->

**Contents**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Example Usage](#example-usage)
- [What is nexus-plugin-firebase](#what-is-nexus-plugin-firebase)
- [Worktime Contributions](#worktime-contributions)
- [Runtime Contributions](#runtime-contributions)
- [Testtime Contributions](#testtime-contributions)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation

```
npm install nexus-plugin-firebase
```


## Example Usage
> Ensure the GOOGLE_APPLICATION_CREDENTIALS env is set

```js
import { firebase } from 'nexus-plugin-firebase';

use(prisma());
use(
  firebase({
    databaseURL: 'https://my-firebase-project.firebaseio.com',
  })
);

/* ... */

schema.mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        firstName: schema.stringArg({ nullable: false }),
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      resolve: async (
        _parent,
        { firstName, email, password },
        ctx
      ) => {
          ctx.admin.auth().createUser({
            email,
            emailVerified: false,
            password,
            displayName: `${firstName}`,
            disabled: false,
          }).then(function(userRecord) {
            console.log('Successfully created new user:', userRecord.uid);
          }).catch(function(error) {
            console.log('Error creating new user:', error);
          });
      },
    });
  }
});
```


## What is nexus-plugin-firebase

The quickest and easiest way to get started with Firebase and Nexus. This plugin is a wrapper around the firebase-admin package. It exposes the Firebase admin object through resolver context, providing full access to the firebase-admin API.


## Worktime Contributions

TODO

## Runtime Contributions

TODO

## Testtime Contributions

TODO


## Links

https://nexusjs.org

https://firebase.google.com/docs/auth/admin