<template>
  <q-page class="w-full md:w-3/6 flex justify-center items-center h-full relative">
   <div class="w-full mb-2" >
    <q-btn icon="keyboard_backspace" dense flat color="cyan-8" @click="$router.go(-1)"/>
   </div>
    <q-card class="p-8 w-full h-[calc(100%_-_100px)]">
      <div class="w-full text-center">
        <h1 class="uppercase font-extrabold text-cyan-600 text-2xl pt-4">
          NailMinder
        </h1>
        <p class="pb-4 text-gray-800 text-lg">Cadastrar no sistema</p>
      </div>
      <q-form @submit="register" class="w-full flex flex-col gap-4 items-end">
        <q-input
          color="cyan-6"
          class="full-width"
          dense
          outlined
          label="Nome Completo"
          type="text"
          v-model="name"
          :rules="[
            (val) => (val && val.length > 0) || 'Por favor digite seu nome',
            (val) =>
              (val.includes(' ') && /[A-Z]/.test(val)) ||
              'Por favor digite seu nome completo',
          ]"
        >
          <template #after>
            <q-icon
              size="16px"
              color="blue-8"
              class="cursor-pointer absolute q-p-0"
              name="priority_high"
            >
              <q-tooltip> Campo Obrigatório</q-tooltip>
            </q-icon>
          </template>
        </q-input>
        <q-input
          color="cyan-6"
          class="full-width mb-4"
          dense
          outlined
          label="Nome da empresa"
          type="text"
          v-model="username"
        >
          <template #after>
            <p class="absolute"></p>
          </template>
        </q-input>
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
        >
          <template #after>
            <q-icon
              size="16px"
              color="blue-8"
              class="cursor-pointer absolute q-p-0"
              name="priority_high"
            >
              <q-tooltip> Campo Obrigatório</q-tooltip>
            </q-icon>
          </template>
        </q-input>
        <div class="w-full relative h-10 mb-4">
          <q-input
            color="cyan-6"
            class="full-width"
            ref="pass_value"
            dense
            outlined
            @update:model-value="checkValues"
            label="Senha"
            :type="showPass ? 'text' : 'password'"
            v-model="password"
            :rules="[
              (val) => (val && val.length > 0) || 'Por favor digite sua senha',
            ]"
          >
            <template #after>
              <q-icon
                size="16px"
                color="blue-8"
                class="cursor-pointer absolute q-p-0"
                name="priority_high"
              >
                <q-tooltip> Campo Obrigatório</q-tooltip>
              </q-icon>
            </template>
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
          <div class="absolute top-full" v-show="showMenuPass">
            <q-card>
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label class="uppercase text-cyan-6"
                      >Sua senha precisa ter:</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item :class="passVal.num ? 'text-green-8' : 'text-red-8'">
                  <q-item-section side>
                    <q-icon
                      :color="passVal.num ? 'green-8' : 'red-8'"
                      :name="passVal.num ? 'check_box' : 'square'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Ao menos um número</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item :class="passVal.min ? 'text-green-8' : 'text-red-8'">
                  <q-item-section side>
                    <q-icon
                      :color="passVal.min ? 'green-8' : 'red-8'"
                      :name="passVal.min ? 'check_box' : 'square'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Ao menos uma letra minúscula</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item :class="passVal.max ? 'text-green-8' : 'text-red-8'">
                  <q-item-section side>
                    <q-icon
                      :color="passVal.max ? 'green-8' : 'red-8'"
                      :name="passVal.max ? 'check_box' : 'square'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Ao menos uma letra maiúscula</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  :class="passVal.special ? 'text-green-8' : 'text-red-8'"
                >
                  <q-item-section side>
                    <q-icon
                      :color="passVal.special ? 'green-8' : 'red-8'"
                      :name="passVal.special ? 'check_box' : 'square'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Ao menos um caracteres epecial</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item :class="passVal.length ? 'text-green-8' : 'text-red-8'">
                  <q-item-section side>
                    <q-icon
                      :color="passVal.length ? 'green-8' : 'red-8'"
                      :name="passVal.length ? 'check_box' : 'square'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Entre 6 e 40 caracteres</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
        <q-input
          color="cyan-6"
          class="full-width"
          ref="pass_value"
          dense
          outlined
          label="Senha"
          :type="showPass ? 'text' : 'password'"
          v-model="confirm_password"
          :rules="[(val) => val === password || 'As senhas não são iguais']"
        >
          <template #after>
            <q-icon
              size="16px"
              color="blue-8"
              class="cursor-pointer absolute q-p-0"
              name="priority_high"
            >
              <q-tooltip> Campo Obrigatório</q-tooltip>
            </q-icon>
          </template>
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
        <q-btn
          type="submit"
          outlined
          color="cyan-6"
          icon="how_to_reg"
          label="Cadastrar"
          size="md"
        />
      </q-form>
      <p class="w-full text-center pt-8">
        Já tem cadastro ?
        <q-btn
          dense
          flat
          color="white"
          label="Entrar"
          text-color="cyan-6"
          :to="{ name: 'login' }"
        />
      </p>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useAuth } from 'src/stores/auth';
export default {
  data() {
    const $q = useQuasar();
    const auth = useAuth();
    return {
      $q,
      auth,
      email: null,
      password: null,
      name:null,
      username:null,
      confirm_password: null,
      showPass: false,
      accept: false,
      passVal: {
        num: false,
        min: false,
        max: false,
        length: false,
        special: false,
      },
      showMenuPass: false,
      errorsPass: {},
      withoutError: false,
    };
  },
  methods: {
   async register() {
      if(this.withoutError){
        const res = await this.auth.register({
            name:this.name,
            username:this.username,
            email:this.email,
            password:this.password,
            password_confirmation:this.confirm_password
        });

        if(res.success){
           this.$q.notify({
            message:res.data.message,
            color: "cyan-6",
            icon: "send",
            position: "center",
            timeout: "100000",
            iconSize:'md',
            classes:'uppercase font-bold'
           })
        }
      }
    },
    checkValues(val) {
      console.log("digitando....");

      this.showMenuPass = true;
      this.errorsPass["error_length"] =
        val !== null && val !== "" && (val.length < 6 || val.length > 40);
      this.errorsPass["error_min"] =
        val !== null && val !== "" && !/[a-z]/.test(val);
      this.errorsPass["error_max"] =
        val !== null && val !== "" && !/[A-Z]/.test(val);
      this.errorsPass["error_num"] =
        val !== null && val !== "" && !/[0-9]/.test(val);
      this.errorsPass["error_special"] =
        val !== null && val !== "" && !/[!@#$%¨&*"^{`~}]/.test(val);
      if (this.errorsPass.error_length) {
        console.log(val);
        this.passVal.length = false;
      } else {
        this.passVal.length = true;
      }
      if (this.errorsPass.error_min) {
        console.log(this.password);
        this.passVal.min = false;
      } else {
        this.passVal.min = true;
      }
      if (this.errorsPass.error_max) {
        console.log(this.password);
        this.passVal.max = false;
      } else {
        this.passVal.max = true;
      }
      if (this.errorsPass.error_num) {
        console.log(this.password);
        this.passVal.num = false;
      } else {
        this.passVal.num = true;
      }
      if (this.errorsPass.error_special) {
        console.log(this.password);
        this.passVal.special = false;
      } else {
        this.passVal.special = true;
      }

      this.withoutError = Object.values(this.errorsPass).every(
        (v) => v === false
      );
      this.showMenuPass = !this.withoutError;
    },
  },
};
</script>

<style lang="scss" scoped></style>
