import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyBJRWjQZxDRhD5KMGrbsFLPRuiZqTDXD3A",
  authDomain: "flightapp-68956.firebaseapp.com",
  projectId: "flightapp-68956",
  storageBucket: "flightapp-68956.firebasestorage.app",
  messagingSenderId: "439722432249",
  appId: "1:439722432249:web:98c17168c565c0ffd77428"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideHttpClient(),                 
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
