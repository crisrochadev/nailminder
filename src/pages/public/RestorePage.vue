<template>
  <q-page class="w-full md:w-3/6 flex justify-start items-start relative">
    <div class="w-full mb-2">
      <q-btn
        icon="keyboard_backspace"
        dense
        flat
        color="cyan-8"
        @click="$router.go(-1)"
      />
    </div>
    <q-card class="p-8 w-full">
      <div class="w-full text-center">
        <h1 class="uppercase font-extrabold text-cyan-600 text-2xl pt-4">
          NailMinder
        </h1>
        <p class="pb-4 text-gray-800 text-lg">Recuperar Senha</p>
        <p class="pb-4 text-gray-700">Enviaremos um código para seu email</p>
      </div>
      <q-form @submit="sendEmail" class="w-full flex flex-col gap-4 items-end">
        <q-input
          color="cyan-6"
          class="full-width"
          dense
          outlined
          label="Email"
          type="email"
          v-model="email"
          :rules="[
            (val) => (val && val.length > 0) || 'Por favor digite seu email',
            (val) =>
              (val.includes('@') && val.split('@')[1].includes('.')) ||
              'Por favor digite um email válido',
          ]"
        />
        <q-btn
          type="submit"
          outlined
          color="cyan-6"
          icon="login"
          label="Enviar"
          size="md"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
export default {
  data() {
    const $q = useQuasar();
    return {
      $q,
    };
  },
  methods: {
    sendEmail() {
      console.log("fazer login");
    },
  },
};
</script>

<style lang="scss" scoped></style>
