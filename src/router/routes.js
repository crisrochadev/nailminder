
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'home', component: () => import('pages/IndexPage.vue') },
      { path: 'login', name:'login', component: () => import('pages/public/LoginPage.vue') },
      { path: 'register', name:'register', component: () => import('pages/public/RegisterPage.vue') },
      { path: 'restore', name:'restore', component: () => import('pages/public/RestorePage.vue') },
      { path: '/auth/confirmar-email', name:'check-code', component: () => import('pages/public/CheckCodePage.vue') },
    ]
  },
  {
    path: '/:slug',
    component: () => import('layouts/UserPublicLayout.vue'),
    name:'userPage',
    children: [
      { path: '', name:'UserPublic', component: () => import('pages/user-page/UserPublicPage.vue') },
    ]
  },
  {
    path: '/admin',
    meta:{
      protected:true
    },
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', name:'admin', component: () => import('pages/admin/DashboardPage.vue') },
      { path: 'agenda', name:'schedule', component: () => import('pages/admin/SchedulePage.vue') },
      { path: 'perfil', name:'perfil', component: () => import('pages/admin/PerfilPage.vue') },
      { path: 'configuracoes', name:'settingsPage', component: () => import('pages/admin/SettingsPage.vue') },
      
      { path: 'configuracao-pagina', name:'settingPage', component: () => import('pages/user-page/SettingPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
