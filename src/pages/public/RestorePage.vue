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
        <h1 class="uppercase font-extrabold  text-2xl pt-4" :class="[$theme.titleColor]">
          NailMinder
        </h1>
        <p class="pb-4 text-gray-800 text-lg">Recuperar Senha</p>
        <p v-if="typeCode && !restorePass" class="pb-4 text-gray-700">
          Digite o <span>código</span> que enviamos para seu email email
        </p>
        <p v-else-if="!restorePass" class="pb-4 text-gray-700">
          Enviaremos um código para seu email
        </p>
        <p v-else class="pb-4 text-gray-700">Crie uma nova senha</p>
      </div>
      <div
        v-if="typeCode && !restorePass"
        class="w-full relative flex justify-center"
      >
        <q-spinner v-if="loadingCode" size="lg" color="cyan-6"></q-spinner>
        <div v-else class="w-full">
          <q-input
            color="cyan-6"
            v-model="auth.email"
            :outlined="typed || !auth.email || auth.email === ''"
            :flat="!typed"
            dense
            class="my-2"
            @update:model-value="typed = true"
            :readonly="!typed && auth.email && auth.email.length > 0"
          >
            <template #append>
              <q-btn
                dense
                flat
                v-if="auth.email && auth.email.length > 0"
                @click="typed = !typed"
                >{{ typed ? "X" : "alterar" }}</q-btn
              >
            </template>
          </q-input>
          <v-otp-input
            ref="otpInput"
            class="grid grid-cols-6 gap-1 w-full h-14 justify-center"
            v-model:value="code"
            :input-classes="['h-full w-[40px] focus:bg-cyan-300 rounded  border border-cyan-600 text-center outline-none text-[30px] font-bold', $theme.titleColor]"
            separator=""
            :num-inputs="6"
            :should-auto-focus="true"
            input-type="letter-numeric"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
          />
        </div>
      </div>
      <q-form
        v-else-if="!restorePass"
        @submit="sendEmail"
        class="w-full flex flex-col gap-4 items-end"
      >
        <q-input
          color="cyan-6"
          class="full-width"
          dense
          outlined
          label="Email"
          type="email"
          v-model="auth.email"
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
          :loading="loading"
        />
      </q-form>
      <q-form
        v-else
        @submit="resetPass"
        class="w-full flex flex-col gap-4 items-end"
      >
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
                    <q-item-label class="uppercase " :class="[$theme.titleColor]"
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
          icon="login"
          label="Salvar"
          size="md"
          :loading="loading"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useAuth } from "src/stores/auth";
import VOtpInput from "vue3-otp-input";
export default {
  components: { VOtpInput },
  data() {
    const $q = useQuasar();
    const auth = useAuth();
    return {
      $q,
      auth,
      loading: false,
      typeCode: false,
      code: "",
      typed: false,
      loadingCode: false,
      restorePass: false,
      passVal: {
        num: false,
        min: false,
        max: false,
        length: false,
        special: false,
      },
      confirm_password: "",
      showPass: false,
      password: "",
      showMenuPass: false,
      errorsPass: {},
      withoutError: false,
    };
  },
  methods: {
    checkValues(val) {
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
        this.passVal.length = false;
      } else {
        this.passVal.length = true;
      }
      if (this.errorsPass.error_min) {
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
        this.passVal.num = false;
      } else {
        this.passVal.num = true;
      }
      if (this.errorsPass.error_special) {
        this.passVal.special = false;
      } else {
        this.passVal.special = true;
      }

      this.withoutError = Object.values(this.errorsPass).every(
        (v) => v === false
      );
      this.showMenuPass = !this.withoutError;
    },
    async resetPass() {
      this.loading = true;
      const res = await this.auth.updatePassword(
        this.auth.email,
        this.code,
        this.password,
        this.confirm_password
      );
      console.log(res);
      if (res.success) {
        this.$q.notify({
          message: res.message,
          color: "cyan-6",
          icon: "send",
          position: "center",
          timeout: "100000",
          iconSize: "md",
          classes: "uppercase font-bold",
          timeout: 3500,
          actions: [
            {
              label: "Confirmar",
              color: "white",
              handler: () => {
                this.typeCode = false;
                this.restorePass = false;
                this.$router.push("/login");
              },
            },
          ],
          onDismiss: () => {
            this.typeCode = false;
            this.restorePass = false;
            this.$router.push("/login");
          },
        });
      } else {
        this.$q.notify({
          message:
            res.response && res.response.data.message && res.response.data
              ? this.translate(res.response.data.message)
              : res.message
              ? res.message
              : "Ocorreu um erro no envio, tente mais tarde, ou entre em contato com os canais de atendimento.",
          color: "red-6",
          icon: "info",
          position: "center",
          timeout: "100000",
          iconSize: "md",
          classes: "uppercase font-bold",
          timeout: 3500,
        });
      }
      this.loading = false;
    },
    translate(text) {
      console.log(text);
      if (text.includes("The email field is required."))
        return "O campo email é obrigatório";
      else return text;
    },
    async sendEmail() {
      this.loading = true;
      const res = await this.auth.resetPass(this.auth.email);
      if (res.success) {
        this.$q.notify({
          message: res.message,
          color: "cyan-6",
          icon: "send",
          position: "center",
          timeout: "100000",
          iconSize: "md",
          classes: "uppercase font-bold",
          timeout: 3500,
          actions: [
            {
              label: "Confirmar",
              color: "white",
              handler: () => {
                this.typeCode = true;
              },
            },
          ],
          onDismiss: () => {
            this.typeCode = true;
          },
        });
      } else {
        this.$q.notify({
          message:
            res.response && res.response.data.message && res.response.data
              ? this.translate(res.response.data.message)
              : res.message
              ? res.message
              : "Ocorreu um erro no envio, tente mais tarde, ou entre em contato com os canais de atendimento.",
          color: "red-6",
          icon: "info",
          position: "center",
          timeout: "100000",
          iconSize: "md",
          classes: "uppercase font-bold",
          timeout: 3500,
        });
      }
      this.loading = false;
    },
    sendCode() {},
    handleOnChange(val) {
      this.code = val;
    },
    async handleOnComplete(code) {
      this.loadingCode = true;
      const res = await this.auth.checkCode(this.auth.email, code);
      console.log(res);
      if (res.success) {
        this.$q.notify({
          message: res.message,
          color: "cyan-6",
          icon: "send",
          position: "center",
          timeout: "100000",
          iconSize: "md",
          classes: "uppercase font-bold",
          timeout: 3500,
          actions: [
            {
              label: "Confirmar",
              color: "white",
              handler: () => {
                this.restorePass = true;
              },
            },
          ],
          onDismiss: () => {
            this.restorePass = true;
          },
        });
      } else {
        this.$q.notify({
          message:
            res.response && res.response.data.message && res.response.data
              ? this.translate(res.response.data.message)
              : "Ocorreu um erro, tente mais tarde, ou entre em contato com os canais de atendimento.",
          color: "red-6",
          icon: "info",
          position: "center",
          timeout: "100000",
          iconSize: "md",
          classes: "uppercase font-bold",
          timeout: 3500,
        });
      }
      this.loadingCode = false;
    },
  },
};
</script>

<style>
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
