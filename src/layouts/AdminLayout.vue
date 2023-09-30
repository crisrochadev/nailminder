<template>
  <q-layout view="hHh Lpr lFf" :class="$theme.bgColor">
    <q-header
      unelevated
      flat
      class="bg-white"
      :class="['bg-' + $theme.buttomColor]"
    >
      <q-toolbar>
        <q-toolbar-title class="uppercase font-bold text-cyan-8 text-sm">
          <q-avatar size="md">
            <q-btn
              :icon="logo"
              class="full-width full-height"
              @click="drawerLeft = !drawerLeft"
            />
          </q-avatar>
          <span
            class="ml-2"
            :class="[
              isMobile ? 'hidden' : 'inline-block',

              'text-' + getLightColor($theme.bgColor),
            ]"
            >{{
              store.user && store.user.username
                ? store.user.username
                : "NailMinder"
            }}</span
          >
        </q-toolbar-title>

        <q-btn
          color="white"
          :text-color="getLightColor($theme.bgColor)"
          dense
          flat
        >
          <q-avatar size="md">
            <q-icon :name="avatar" class="full-width full-height" />
          </q-avatar>
          <span class="ml-2" :class="[isMobile ? 'hidden' : 'inline-block']">{{
            username
          }}</span>
          <q-menu fit anchor="bottom start" self="top left">
            <q-list dense>
              <q-item clickable @click="$router.push({ name: 'perfil' })">
                <q-item-section side>
                  <q-item-avatar>
                    <q-icon
                      :color="$theme.buttomColor"
                      :text-color="$theme.buttomColor"
                      dense
                      flat
                      :name="avatar"
                    />
                  </q-item-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="uppercase" :class="[$theme.titleColor]"
                    >Perfil</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item clickable @click="$router.push({ name: 'settingPage' })">
                <q-item-section side>
                  <q-item-avatar>
                    <q-icon
                      :color="$theme.buttomColor"
                      :text-color="$theme.buttomColor"
                      dense
                      flat
                      :name="logo"
                    />
                  </q-item-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="uppercase" :class="[$theme.titleColor]"
                    >Página</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item clickable @click="$router.push({ name: 'settingsPage' })">
                <q-item-section side>
                  <q-item-avatar>
                    <q-icon
                      :color="$theme.buttomColor"
                      :text-color="$theme.buttomColor"
                      dense
                      flat
                      name="settings"
                    />
                  </q-item-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="uppercase" :class="[$theme.titleColor]"
                    >Configurações</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item clickable @click="logout">
                <q-item-section side>
                  <q-item-avatar>
                    <q-icon
                      :color="$theme.buttomColor"
                      :text-color="$theme.buttomColor"
                      dense
                      flat
                      name="logout"
                    />
                  </q-item-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="uppercase" :class="[$theme.titleColor]"
                    >Sair</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer  v-model="drawerLeft" side="left" bordered overlay>
      <q-scroll-area class="fit">
        <q-list>
          <q-item
            v-for="item in menu"
            :key="item.id"
            clickable
            v-close-popup
            :to="{ name: item.to }"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" :color="store.theme.buttomColor" />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="[store.theme.titleColor]">{{
                item.title
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container
      class="p-4 flex justify-center items-start h-screen border overflow-hidden"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useAuth } from "src/stores/auth";
import { useQuasar } from "quasar";
import AuthUser from "src/services/authUser";
import { useUser } from "src/stores/user";
export default {
  data() {
    const auth = useAuth();
    const store = useUser();
    const $q = useQuasar();
    return {
      auth,
      $q,
      store,
      tab: "home",
      avatar: "person",
      username: "Nome de Usuario",
      logo: "img:/icons/favicon-128x128.png",
      drawerLeft: false,
      menu: [
        {
          id: 1,
          icon: "calendar_month",
          title: "Agenda",
          to: "schedule",
        },
        {
          id: 2,
          icon: "image",
          title: "Meus trabalhos",
          to: "jobs",
        },
      ],
    };
  },
  async mounted() {
    this.store.user = (await AuthUser()).user;

    console.log(this.store.user);
    this.username = this.store.user.name;
    this.avatar = this.store.user.avatar
      ? "img:" + this.store.user.avatar
      : "person";

    this.logo = this.store.user.logo
      ? "img:" + this.store.user.logo
      : "img:/icons/favicon-128x128.png";
  },
  methods: {
    logout() {
      this.auth.access_token = null;
      this.$router.push({ name: "login" });
    },
    getLightColor(color) {
      return color.replace("bg-", "");
    },
  },
  computed: {
    isMobile() {
      console.log(this.$q.screen);
      return this.$q.screen.xs;
    },
    $theme() {
      return this.store.theme;
    },
  },
};
</script>
