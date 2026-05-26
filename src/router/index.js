import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/splash',
    name: 'Splash',
    component: () => import('../views/SplashView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../views/CategoryView.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/CartView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/product/:id?',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: { hideNav: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/OrderListView.vue'),
    meta: { hideNav: true }
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/AddressView.vue'),
    meta: { hideNav: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { hideNav: true }
  },
  {
    path: '/payment/:orderNo',
    name: 'Payment',
    component: () => import('../views/PaymentView.vue'),
    meta: { hideNav: true }
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: () => import('../views/PaymentSuccessView.vue'),
    meta: { hideNav: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Splash guard: redirect to splash on first visit
router.beforeEach((to, from, next) => {
  if (to.path !== '/splash' && !sessionStorage.getItem('hasSeenSplash')) {
    next('/splash')
  } else {
    next()
  }
})

export default router
