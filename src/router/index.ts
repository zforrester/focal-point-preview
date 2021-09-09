import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'

const history = createWebHistory()

const routes = [
    {
        path: '/focal-point',
        component: Home,
    },
    {
        path: '/focalpoint',
        component: Home,
    },
    {
        path: '/',
        component: Home,
    },
]

const router = createRouter({ history, routes })

export default router
