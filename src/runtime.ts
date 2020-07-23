import { RuntimePlugin } from 'nexus/plugin'
import { Settings } from './settings'

import * as admin from 'firebase-admin'

export const plugin: RuntimePlugin<Settings, 'required'> = (settings) => (
  project
) => {
  const { databaseURL, refreshToken, serviceAccount } = settings
  let isAuthenticated: boolean = false
  let token: string | null = null
  let userInfo: { uid: string } | null = null

  const credentialsFromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (refreshToken) {
    admin.initializeApp({
      credential: admin.credential.refreshToken(refreshToken),
      databaseURL,
    })
  } else if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL,
    })
  } else if (credentialsFromEnv) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL,
    })
  } else {
    // TODO: Throw warning if FIREBASE_CONFIG env is missing
    admin.initializeApp()
  }

  return {
    context: {
      create: async (_req: any) => {
        if (_req?.headers?.authorization?.split(' ')[0] === 'Bearer') {
          token = _req?.headers?.authorization?.split(' ')[1]
        }
        if (token) {
          userInfo = await admin.auth().verifyIdToken(token)
          isAuthenticated = !!userInfo?.uid
        }

        return {
          admin,
          isAuthenticated,
          token,
          userInfo,
        }
      },
      typeGen: {
        fields: {
          admin: 'any',
          isAuthenticated: 'boolean',
          token: 'string | null',
          userInfo: 'object | null',
        },
      },
    },
  }
}
