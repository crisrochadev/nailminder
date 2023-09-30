<template>
  <q-layout view="lHh Lpr lFf">
    <q-header unelevated flat class="bg-white">
      <q-toolbar>
        <q-toolbar-title class="text-pink-8"> Nailminder </q-toolbar-title>

        <q-tabs v-model="tab" inline-label dense class="bg-white text-pink-8">
          <q-route-tab
            :to="{ name: 'home' }"
            dense
            name="home"
            icon="home"
            label="Inicio"
          />

          <q-route-tab
            :to="{ name: store.user ? 'admin' : 'login' }"
            dense
            name="login"
          >
            <q-avatar size="md" v-if="store.user">
              <q-icon :name="avatar" class="full-width full-height" />
            </q-avatar>
            <q-avatar size="md" v-else>
              <q-icon name="login" class="full-width full-height" />
            </q-avatar>
          </q-route-tab>
        </q-tabs>
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
import AuthUser from "src/services/authUser";
import { useUser } from "src/stores/user";
export default {
  data() {
    const store = useUser();
    return {
      store,
      tab: "home",
      avatar: null,
      username: null,
    };
  },
  async mounted() {
    this.store.user = (await AuthUser()).user;
    this.username = this.store.user.name;
    this.avatar = this.store.user.avatar
      ? "img:" + this.store.user.avatar
      : "person";
  },
};
</script>
