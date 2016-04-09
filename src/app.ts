import {enableProdMode} from 'angular2/core';
enableProdMode();

import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {CardViewerApp} from './app/card-viewer-app';

bootstrap(CardViewerApp, [HTTP_PROVIDERS, ROUTER_PROVIDERS])
.catch(err => console.error(err));
