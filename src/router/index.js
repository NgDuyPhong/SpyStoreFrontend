import Vue from 'vue'
import VueRouter from 'vue-router'
import SearchPage from "@/SearchPage";
import SearchResults from "@/SearchResults";
import SearchErrors from "@/SearchErrors";
import Users from "@/components/Users";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'search-page',
    component: SearchPage
  },
  {
    path: '/search-results',
    name: 'search-results',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: SearchResults
  },
  {
    path: '/search-errors',
    name: 'search-errors',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: SearchErrors
  },
  {
    path: '/users',
    name: 'users',
    component: Users
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
