<template>
  <q-page
    class="w-full md:w-3/6 flex justify-center items-start relative h-full py-4"
  >
    <q-card class="p-8 w-full h-full">
      <div class="w-full text-center">
        <h1 class="uppercase font-extrabold  text-2xl pt-4" :class="[$theme.titleColor]">
          NailMinder
        </h1>
        <p class="pb-4 text-gray-800 text-lg">Verificação de Email</p>
      </div>
      <div class="flex justify-center items-center w-full h-full flex-col gap-4">
        <p class="uppercase font-bold  text-lg text-center" :class="[$theme.titleColor]">
          {{ message }}
        </p>
        <q-spinner  color="cyan-6" size="md" class="mx-auto mt-4" />
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useAuth } from "../../stores/auth";
import VOtpInput from "vue3-otp-input";
import { useUser } from 'src/stores/user';
export default {
  components: {
    VOtpInput,
  },
  data() {
    const $q = useQuasar();
    const auth = useAuth();
    const store = useUser()
    return {
      $q,
      auth,
      store,
      email: null,
      password: null,
      showPass: false,
      accept: false,
      loading: true,
      hasError: false,
      code: null,
      message: "Estamos verificando seu email...",
    };
  },
  computed:{
    $theme(){
      return this.store.theme
    }
  },
  async mounted() {
    const res = await this.auth.confirmEmail(this.$route.query.token);
    if (res.success && res.message) {
      this.auth.message = res.message + '. Faça Login';
      this.auth.email = res.data.email;
      this.$router.push({name:'login'})
    }
    else {
      this.auth.message = 'Link inválido ou expirado, solicite um novo link de confirmação fazendo login.';
      this.$router.push({name:'login'})
    }

  },
};
</script>

<style lang="scss" scoped></style>
