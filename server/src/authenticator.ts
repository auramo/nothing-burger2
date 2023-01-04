import passport, { initialize } from 'passport'
import { Strategy as GoogleStrategy, VerifyCallback, VerifyFunctionWithRequest } from 'passport-google-oauth2'
import { Express, Request, Response } from 'express'
import userRepository from './userRepository'
import { NextFunction } from 'express-serve-static-core'

const verify: VerifyFunctionWithRequest = async function(request, accessToken, refreshToken, profile: any, done) {
    const userFetchCallback = (user: string) =>
      user ? done(null, user) : done(null, false, {message: 'User not authorized'})
    try {
        const email = profile.emails[0].value.toLowerCase()
        const user = await userRepository.findUserByLogin(email)
        userFetchCallback(user)
    } catch (e) {
        console.log('Error occurred while authenticating', e)
        done(null, false, {message: 'Error occurred: ' + e})
    }
}

const authenticationFailed = (req: Request, res: Response) => {
    req.logout((err) => {
            if (err) console.error("Logout failed", err)
        })
    res.redirect('/login?failed=true')
  }

  const authenticationSuccessful = (req: Request, user: string, next: NextFunction, res: Response) => {
    //const redirectTo = req.session.desiredUrlAfterLogin ? req.session.desiredUrlAfterLogin : '/'
    console.info("Authentication successful", user)
    req.logIn(user, err => {
      if (err) {
        next(err)
      } else {
        console.info("saving session")
        req.session.user = user
        req.session.save(() => res.redirect("/"))
      }
    })
  }

export function initAuth (app: Express): void {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL!,
        passReqToCallback: true
    },
    verify
    ))
    
    passport.serializeUser(function(user, done) {
      done(null, user);
    })
  
    passport.deserializeUser(function(user: any, done) {
      done(null, user);
    })

    app.get('/auth/googlelogin*', (req, res) => {
      //req.session.desiredUrlAfterLogin = req.url.substr('/auth/googlelogin'.length)
        return passport.authenticate('google',
          {scope: [ 'email', 'profile']}
        )(req, res)
    })

    app.get('/auth/google/callback', (req, res, next) => {
        passport.authenticate('google', (err, user) => {
          if (err) {
            next(err)
          } else if (!user) {
            authenticationFailed(req, res)
          } else {
            authenticationSuccessful(req, user, next, res)
          }
        })(req, res, next)
      })
    /*
      app.post('/auth/logout', (req, res) => {
        req.logout()
        okResponse(res)
      })
      */
    
}
