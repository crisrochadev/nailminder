<template>
  <q-layout view="lHh Lpr lFf">
    <q-header unelevated flat class="bg-white">
      <q-toolbar>
        <q-toolbar-title
          class="text-pink-8 uppercase font-bold text-cyan-8 text-sm"
        >
          <q-avatar size="md" >
            <q-icon :name="logo" class="full-width full-height" />
          </q-avatar>
          <span class="ml-2" :class="[isMobile ? 'hidden' : 'inline-block']">{{ user && user.username ? user.username : "NailMinder" }}</span>
        </q-toolbar-title>

        <q-btn color="white" text-color="cyan-6" dense flat>
          <q-avatar size="md">
            <q-icon :name="avatar" class="full-width full-height" />
          </q-avatar>
          <span class=" ml-2" :class="[isMobile ? 'hidden' : 'inline-block']">{{ username }}</span>
          <q-menu fit anchor="bottom start" self="top left">
            <q-list dense>
              <q-item clickable @click="$router.push({ name: 'perfil' })">
                <q-item-section>
                  <q-item-avatar>
                    <q-icon
                      color="cyan-6"
                      text-color="cyan-6"
                      dense
                      flat
                      :name="avatar"
                    />
                  </q-item-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="uppercase text-cyan-6"
                    >Perfil</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item clickable @click="$router.push(pageName )">
                <q-item-section>
                  <q-item-avatar>
                    <q-icon
                      color="cyan-6"
                      text-color="cyan-6"
                      dense
                      flat
                      :name="logo"
                    />
                  </q-item-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="uppercase text-cyan-6"
                    >Página</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item clickable @click="logout">
                <q-item-section>
                  <q-item-avatar>
                    <q-icon
                      color="cyan-6"
                      text-color="cyan-6"
                      dense
                      flat
                      name="logout"
                    />
                  </q-item-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="uppercase text-cyan-6"
                    >Sair</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container
      class="p-4 flex justify-center items-start h-screen border overflow-hidden"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useAuth } from "src/stores/auth";
import { useQuasar } from 'quasar';
export default {
  data() {
    const auth = useAuth();
    const $q = useQuasar();
    return {
      auth,
      $q,
      tab: "home",
      avatar: "person",
      username: "Nome de Usuario",
      user: null,
      logo: "img:/icons/favicon-128x128.png",
      pageName:null
    };
  },
  mounted() {
    this.user = this.$route.meta.user;
    console.log(this.user)
    this.username = this.user.name;
    this.avatar = this.user.avatar ? "img:" + this.user.avatar : "person";
    this.pageName = this.user.slug ? {path:`/${this.user.slug}`}: {name:'settingPage'}
    this.logo = this.user.logo
      ? "img:" + this.user.logo
      : "img:/icons/favicon-128x128.png";
  },
  methods: {
    logout() {
      this.auth.access_token = null;
      this.$router.push({ name: "login" });
    },
  },
  computed:{
    isMobile(){
      console.log(this.$q.screen)
      return this.$q.screen.xs
    },
  }
};
</script>
