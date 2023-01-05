import passport, { initialize } from "passport";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GoogleStrategy from "passport-google-oidc";
import { Express, Request, Response } from "express";

const verify = (
  issuer: string,
  profile: { id: string; displayName: string; emails: [string] },
  done: any
) => {
  console.info("verify called with profile", profile);
  done(null, profile.emails[0]);
};

export function initAuth(app: Express): void {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL!,
      },
      verify
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user: any, done) {
    done(null, user);
  });

  app.get(
    "/auth/googlelogin*",
    passport.authenticate("google", { scope: ["email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login?failed=true",
      failureMessage: true,
    }),
    (req, res) => {
      res.redirect("/");
    }
  );
}
