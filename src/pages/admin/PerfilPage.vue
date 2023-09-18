<template>
  <q-page class="w-full grid md:grid-cols-2 gap-4 p-4 h-full overflow-y-auto">
    <q-card v-if="user" class="p-2 md:p-8">
      <h2
        class="uppercase border-b border-cyan-600 mb-4 p-0 text-cyan-6 font-bold"
      >
        Dados Cadastrais
      </h2>
      <q-form
        class="flex flex-col justify-start items-end w-full gap-4"
        @submit.prevent="saveData"
      >
        <q-input
          label="Nome Completo"
          dense
          outlined
          class="full-width"
          color="cyan-6"
          v-model="user.name"
        >
        </q-input>
        <q-input
          label="Empresa"
          dense
          outlined
          class="full-width"
          color="cyan-6"
          v-model="user.username"
        >
        </q-input>
        <q-input
          type="email"
          label="Email"
          dense
          outlined
          class="full-width"
          color="cyan-6"
          v-model="user.email"
        >
        </q-input>
        <q-input
          type="text"
          label="Telefone"
          dense
          outlined
          class="full-width"
          color="cyan-6"
          mask="(##) #####-####"
          v-model="user.phone"
        ></q-input>
        <q-expansion-item
          label="cadastrar endereço"
          icon="contact_mail"
          class="full-width"
          flat
          header-class="text-cyan-6 uppercase text-sm"
          expand-icon-class="text-cyan-6"
        >
          <div class="space-y-4">
            <q-input
              autofocus
              label="Cep"
              class="full-width mt-4"
              outlined
              dense
              color="cyan-6"
              mask="#####-###"
              @blur="checkCep"
              :loading="ceploading"
              v-model="user.address_cep"
            />
            <q-select
              label="Estado"
              class="full-width"
              :options="ufs"
              option-label="nome"
              option-value="sigla"
              outlined
              dense
              color="cyan-6"
              options-dense
              use-input
              @input-value="filterOptionState"
              v-model="user.address_state"
              @update:model-value="getCities"
            />

            <q-select
              label="Cidade"
              class="full-width"
              outlined
              dense
              use-input
              @input-value="filterOptionCity"
              :options="cities"
              options-dense
              :disable="!ufSelected"
              color="cyan-6"
              v-model="user.address_city"
            />
            <q-input
              label="Rua"
              class="full-width"
              outlined
              dense
              color="cyan-6"
              v-model="user.address_street"
            />
            <q-input
              label="Numero"
              class="full-width"
              outlined
              dense
              color="cyan-6"
              v-model="user.address_number"
            />
            <q-input
              label="Bairro"
              class="full-width"
              outlined
              dense
              color="cyan-6"
              v-model="user.address_district"
            />
            <q-input
              label="Complemento"
              class="full-width"
              outlined
              dense
              color="cyan-6"
              v-model="user.address_complement"
            />
          </div>
        </q-expansion-item>
        <q-btn type="submit" icon="save" label="salvar" color="cyan-6" />
      </q-form>
    </q-card>
    <q-card v-if="user" class="px-4 py-2 md:p-8">
      <h2
        class="uppercase border-b border-cyan-600 mb-4 p-0 text-cyan-6 font-bold"
      >
        Carregar Imagens
      </h2>
      <q-form
        class="flex flex-col justify-start items-end w-full gap-4"
        @submit.prevent="saveImages"
      >
        <div
          class="w-full flex justify-between items-center gap-3 flex-col md:flex-row"
        >
          <label for="avatar" class="relative">
            <span
              class="absolute z-20 bg-white p-1 uppercase text-gray-400 text-xs"
              >Imagem de perfil</span
            >
            <q-avatar
              square
              size="200px"
              class="border border-cyan-500 cursor-pointer hover:bg-cyan-50 transition-all delay-100 opacity-80 hover:opacity-100"
            >
              <q-tooltip>Carregar imagem de perfil</q-tooltip>
              <q-img v-if="user.avatar" :src="user.avatar" />
              <q-icon v-else name="person" color="cyan" />
            </q-avatar>
          </label>
          <input
            type="file"
            id="avatar"
            class="hidden"
            @change="(evt) => uploadImage(evt, 'avatar')"
          />
          <label for="logo" class="md:flex-1 relative w-full md:w-auto">
            <span
              class="absolute z-20 bg-white p-1 uppercase text-gray-400 text-xs"
              >Imagem para Logomarca</span
            >
            <q-avatar
              square
              size="200px"
              class="border full-width border-cyan-500 cursor-pointer hover:bg-cyan-50 transition-all delay-100 opacity-80 hover:opacity-100"
            >
              <q-tooltip>Carregar logotipo</q-tooltip>
              <q-img v-if="user.logo" :src="user.logo" />
              <q-icon
                v-else
                name="img:/icons/favicon-128x128.png"
                color="cyan"
              />
            </q-avatar>
          </label>
          <input
            type="file"
            id="logo"
            class="hidden"
            @change="(evt) => uploadImage(evt, 'logo')"
          />
          <!-- <q-uploader
          url="http://localhost:4444/upload"
          label="Foto de perfil"
          color="cyan"
          square
          flat
          bordered
          style="max-width: 260px"
        />
        <q-uploader
          url="http://localhost:4444/upload"
          label="Logo da empresa"
          color="cyan"
          square
          flat
          bordered
          style="max-width: 260px"
        /> -->
        </div>
        <q-btn
          type="submit"
          icon="save"
          label="Salvar Imagens"
          color="cyan-6"
          :loading="imageLoading"
        />
      </q-form>
      <h2
        class="uppercase border-b border-cyan-600 mb-4 p-0 text-cyan-6 font-bold"
      >
        Alterar Senha
      </h2>
      <q-form
        class="flex flex-col justify-start items-end w-full gap-4"
        @submit.prevent="saveNewPass"
      >
        <div class="w-full relative h-10">
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
          <div class="absolute top-full z-50 bg-white" v-show="showMenuPass">
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
        <q-btn type="submit" icon="save" label="Alterar Senha" color="cyan-6" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import AuthUser from "src/services/authUser";
import { useUser } from "src/stores/user";
import useGetCityForUf from "src/composables/getCityForUF";
export default {
  data() {
    const userStore = useUser();
    const { getCity, findUF } = useGetCityForUf();
    return {
      userStore,
      email: null,
      getCity,
      findUF,
      password: "",
      name: null,
      username: null,
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
      changeAddress: false,
      user: null,
      defaultUser: null,
      avatar: null,
      logo: null,
      imageLoading: false,
      ceploading: false,
      DefaultUfs: [
        { nome: "Acre", sigla: "AC" },
        { nome: "Alagoas", sigla: "AL" },
        { nome: "Amapá", sigla: "AP" },
        { nome: "Amazonas", sigla: "AM" },
        { nome: "Bahia", sigla: "BA" },
        { nome: "Ceará", sigla: "CE" },
        { nome: "Distrito Federal", sigla: "DF" },
        { nome: "Espírito Santo", sigla: "ES" },
        { nome: "Goiás", sigla: "GO" },
        { nome: "Maranhão", sigla: "MA" },
        { nome: "Mato Grosso", sigla: "MT" },
        { nome: "Mato Grosso do Sul", sigla: "MS" },
        { nome: "Minas Gerais", sigla: "MG" },
        { nome: "Pará", sigla: "PA" },
        { nome: "Paraíba", sigla: "PB" },
        { nome: "Paraná", sigla: "PR" },
        { nome: "Pernambuco", sigla: "PE" },
        { nome: "Piauí", sigla: "PI" },
        { nome: "Rio de Janeiro", sigla: "RJ" },
        { nome: "Rio Grande do Norte", sigla: "RN" },
        { nome: "Rio Grande do Sul", sigla: "RS" },
        { nome: "Rondônia", sigla: "RO" },
        { nome: "Roraima", sigla: "RR" },
        { nome: "Santa Catarina", sigla: "SC" },
        { nome: "São Paulo", sigla: "SP" },
        { nome: "Sergipe", sigla: "SE" },
        { nome: "Tocantins", sigla: "TO" },
      ],
      ufs: [
        { nome: "Acre", sigla: "AC" },
        { nome: "Alagoas", sigla: "AL" },
        { nome: "Amapá", sigla: "AP" },
        { nome: "Amazonas", sigla: "AM" },
        { nome: "Bahia", sigla: "BA" },
        { nome: "Ceará", sigla: "CE" },
        { nome: "Distrito Federal", sigla: "DF" },
        { nome: "Espírito Santo", sigla: "ES" },
        { nome: "Goiás", sigla: "GO" },
        { nome: "Maranhão", sigla: "MA" },
        { nome: "Mato Grosso", sigla: "MT" },
        { nome: "Mato Grosso do Sul", sigla: "MS" },
        { nome: "Minas Gerais", sigla: "MG" },
        { nome: "Pará", sigla: "PA" },
        { nome: "Paraíba", sigla: "PB" },
        { nome: "Paraná", sigla: "PR" },
        { nome: "Pernambuco", sigla: "PE" },
        { nome: "Piauí", sigla: "PI" },
        { nome: "Rio de Janeiro", sigla: "RJ" },
        { nome: "Rio Grande do Norte", sigla: "RN" },
        { nome: "Rio Grande do Sul", sigla: "RS" },
        { nome: "Rondônia", sigla: "RO" },
        { nome: "Roraima", sigla: "RR" },
        { nome: "Santa Catarina", sigla: "SC" },
        { nome: "São Paulo", sigla: "SP" },
        { nome: "Sergipe", sigla: "SE" },
        { nome: "Tocantins", sigla: "TO" },
      ],
      ufSelected: false,
      cities: [],
    };
  },
  async mounted() {
    const res = await AuthUser();
    this.user = res.user;
    if (this.user.address_state) {
      this.user.address_state = this.findUF(this.user.address_state);
      this.ufSelected = true;
    }
    console.log(res.user);
    this.defaultUser = { ...res.user };
  },

  methods: {
    filterOptionState(val) {
      this.ufs = this.DefaultUfs.filter((opt) =>
        opt.nome.toLowerCase().includes(val.toLowerCase())
      );
    },
    filterOptionCity(val) {
      console.log(this.user.address_state);
      this.cities = this.getCity(this.user.address_state.sigla).filter((opt) =>
        opt.toLowerCase().includes(val.toLowerCase())
      );
    },
    async saveData() {
      this.user.address_state = this.user.address_state.sigla;
      if (
        this.user.address_city !== "" &&
        this.user.address_city !== null &&
        this.user.address_street !== "" &&
        this.user.address_street !== null &&
        this.user.address_state !== "" &&
        this.user.address_state !== null &&
        (this.user.address_cep === "" || this.user.address_cep === null)
      ) {
        const res = await this.userStore.getCep(
          this.user.address_city,
          this.user.address_street,
          this.user.address_state
        );
        if (res.success) {
          this.user.address_cep = res.data[0].cep;
        } else {
          return;
        }
      }

      let userToUpdate = {
        changed: false,
        dataChanged: {},
      };
      Object.entries(this.user).forEach(([key, value]) => {
        Object.entries(this.defaultUser).forEach(
          ([keyDefault, valueDefault]) => {
            if (value !== valueDefault) {
              userToUpdate.changed = true;
              userToUpdate.dataChanged[key] = value;
            }
          }
        );
      });
      console.log(this.defaultUser);
      if (userToUpdate.changed) {
        console.log(userToUpdate.dataChanged);
        const res = await this.userStore.updateUser(userToUpdate.dataChanged);
        console.log(res);
      }
    },
    async uploadImage(evt, type) {
      let input = evt.target;
      this[type] = input.files[0];

      let result = new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(input.files[0]);
      });
      this.user[type] = await result;
    },
    async saveImages() {
      this.imageLoading = true;
      if (this.avatar) {
        await this.userStore.uploadImage({
          type: "avatar",
          image: this.avatar,
        });
      }
      if (this.logo) {
        await this.userStore.uploadImage({
          type: "logo",
          image: this.logo,
        });
      }

      this.imageLoading = false;
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
    async saveNewPass() {
      const res = await this.userStore.saveNewPass(
        this.user.email,
        this.password,
        this.confirm_password
      );
      if (res) {
        this.password = "";
        this.confirm_password = "";
      }
    },
    async checkCep() {
      if (this.user.address_cep !== "" && this.user.address_cep !== null) {
        this.ceploading = true;
        const res = await this.userStore.checkCep(this.user.address_cep);
        console.log(res);
        if (res.success) {
          this.user.address_street = res.data.logradouro;
          this.user.address_city = res.data.localidade;
          this.user.address_state = this.findUF(res.data.uf);
          this.ufSelected = true;
          this.user.address_district = res.data.bairro;
        }
        this.ceploading = false;
      }
    },
    getCities(val) {
      console.log(val);
      if (val !== null && val !== "") {
        this.cities = this.getCity(val.sigla);
        this.ufSelected = true;
      } else {
        this.cities = [];
        this.ufSelected = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
