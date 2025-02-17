import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import HomePage from './view/HomePage.vue'
import AssetView from './view/AssetView.vue'
import NotFound from './view/NotFound.vue'

const routes = [
  { path: '/asset/:assetId', component: AssetView },
  { path: '/', component: HomePage },
{ path: '/:pathMatch(.*)*', component: NotFound },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
