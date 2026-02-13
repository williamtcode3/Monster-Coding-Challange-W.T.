import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';

export const formGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise(resolve => {
    onAuthStateChanged(auth, user => {
      if (user && user.emailVerified) {
        resolve(true);
      } else {
        router.navigateByUrl('/');
        resolve(false);
      }
    });
  });
};
