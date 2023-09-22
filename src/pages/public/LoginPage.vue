<template>
  <q-page class="w-full md:w-3/6 flex justify-center items-center relative">
    <q-card class="p-8 w-full">
      <div class="w-full text-center">
        <h1 class="uppercase font-extrabold  text-2xl pt-4" :class="[$theme.titleColor]">
          NailMinder
        </h1>
        <p class="pb-4 text-gray-800 text-lg">Entrar no sistema</p>
        <p class="mb-4 text-red-600">{{ auth.message }}</p>
      </div>
      <q-form @submit="login" class="w-full flex flex-col gap-4 items-end">
        <q-input
          color="cyan-6"
          class="full-width"
          dense
          outlined
          label="Email"
          type="email"
          :error="hasError"
          v-model="email"
          :rules="[
            (val) => (val && val.length > 0) || 'Por favor digite seu email',
            (val) =>
              (val.includes('@') && val.split('@')[1].includes('.')) ||
              'Por favor digite um email válido',
          ]"
        />
        <q-input
          color="cyan-6"
          class="full-width"
          dense
          outlined
          :error="hasError"
          label="Senha"
          :type="showPass ? 'text' : 'password'"
          v-model="password"
          :rules="[
            (val) => (val && val.length > 0) || 'Por favor digite sua senha',
          ]"
        >
          <template #append>
            <q-btn
              :icon="showPass ? 'visibility_off' : 'visibility'"
              dense
              round
              size="sm"
              flat
              color="cyan-6"
              @click="showPass = !showPass"
            />
          </template>
        </q-input>
        <p class="w-full flex justify-center items-center gap-4">
          Esqueceu a senha ?
          <q-btn
            dense
            flat
            color="white"
            label="Recuperar"
            size="md"
            text-color="cyan-6"
            :to="{ name: 'restore' }"
          />
        </p>

        <q-btn
          type="submit"
          outlined
          color="cyan-6"
          icon="login"
          label="Entrar"
          size="md"
          :loading="loading"
        />
      </q-form>
      <p class="w-full text-center pt-8">
        Ainda não tem cadastro ?
        <q-btn
          dense
          flat
          color="white"
          label="Cadastrar"
          text-color="cyan-6"
          :to="{ name: 'register' }"
        />
      </p>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useAuth } from "../../stores/auth";
import { useUser } from 'src/stores/user';
export default {
  data() {
    const $q = useQuasar();
    const auth = useAuth();
    const store = useUser();
    return {
      $q,
      auth,
      store,
      email: null,
      password: null,
      showPass: false,
      accept: false,
      loading: false,
      hasError: false,
    };
  },
  mounted() {
    this.email = this.auth.email;
  },
  computed:{
    $theme(){
      return this.store.theme
    }
  },
  methods: {
    async login() {
      this.loading = true;
      const res = await this.auth.login({
        email: this.email,
        password: this.password,
      });
      this.loading = false;
      if (!res.success) {
        this.$q.notify({
          message: res.message,
          color: "red-7",
          icon: "error",
          position: "top",
        });
        this.hasError = true;
      } else {
        console.log(res);
        if (res.user) {
          this.$router.push({ name: "admin" });
        } else if (res.data && !res.data.emailVerified) {
          this.$q.notify({
            message: res.data.message,
            color: "cyan-6",
            icon: "send",
            position: "center",
            timeout: "100000",
            iconSize: "md",
            classes: "uppercase font-bold",
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
