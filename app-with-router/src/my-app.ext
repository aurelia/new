import { route } from '@aurelia/router';

@route({
  routes: [
    {
      path: ['', 'welcome'],
      component: import('./welcome-page'),
      title: 'Welcome',
    },
    {
      path: 'about',
      component: import('./about-page'),
      title: 'About',
    },
  ],
  fallback: import('./missing-page'),
})
export class MyApp {
}
