
import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { auth0Key, auth0Domain } from '../config/superSecretKeys';
import { Router } from '@angular/router';

let Auth0Lock = require('auth0-lock').default;
let Auth0 = require('auth0-js').WebAuth;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock(auth0Key, auth0Domain, {});
  auth0 = new Auth0({clientID: auth0Key, domain: auth0Domain});

  // Store profile object in auth class
  userProfile: any;

  constructor(private router: Router) {
    // Set userProfile attribute if already saved profile
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          console.log(error);
          return;
        }
        this.handleRedirectWithHash();
        profile.user_metadata = profile.user_metadata || {};
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
      });
    });
  }

  private handleRedirectWithHash() {
    // From https://github.com/auth0-samples/auth0-angularjs2-systemjs-sample/issues/40#issuecomment-265170465
    this.router.events.take(1).subscribe(event => {
      if (/access_token/.test(event.url) || /error/.test(event.url)) {

        let authResult = this.auth0.parseHash(window.location.hash);

        if (authResult && authResult.idToken) {
          this.lock.emit('authenticated', authResult);
        }

        if (authResult && authResult.error) {
          this.lock.emit('authorization_error', authResult);
        }
      }
    });
  }


  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    this.userProfile = undefined;
  }
}
