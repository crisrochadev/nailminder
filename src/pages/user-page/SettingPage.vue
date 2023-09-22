<template>
  <q-page class="w-full p-4 h-full overflow-y-auto">
    <q-stepper
      v-if="apiIsReady"
      v-model="step"
      ref="stepper"
      :color="$theme.buttomColor"
      animated
      inactive-color="grey-8"
      done-icon="chevron_right"
      done-:color="$theme.buttomColor"
      active-:color="$theme.buttomColor"
      error-color="red-6"
      flat
      :vertical="$q.screen.xs"
    >
      <q-step :name="1" title="Inicio" icon="settings" :done="step > 1">
        <div class="w-full h-full">
          <q-img src="/images/website.png" class="w-1/4"></q-img>
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold"
            :class="[$theme.titleColor]"
          >
            Vamos criar a sua página inicial
          </h1>
          <p class="text-grey-8 font-semibold text-sm uppercase">
            Com uma página criada, seus clientes podem acompanhar seu trabalho,
            agendar horário, enviar mensagens e compartilhar suas experiências
            com seu atendimento.
          </p>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Criar endereço da página"
        caption="Obrigatório"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div class="w-full h-full space-y-4">
          <q-img src="/images/url.png" class="w-1/4"></q-img>
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold"
            :class="[$theme.titleColor]"
          >
            Comece escolhendo o endereço da sua página
          </h1>
          <p class="text-grey-8 font-semibold text-sm uppercase">
            Um slug, é o nome que aparece depois da / no endereço, por exemplo:
            https://nailminder.com/<span
              class="font-semibold"
              :class="[$theme.titleColor]"
              >melhormanicure</span
            >, [<span class="font-semibold" :class="[$theme.titleColor]"
              >melhormanicure</span
            >] é o slug.
          </p>
          <p class="text-grey-7">
            Um slug não pode contér espaços, acentos e nem caracteres especias,
            se seu slug tem mais de uma palavra. consifere usar hífen(-) ou
            travessão(_), para separar as palavras, e apesar de permitido, não
            recomendamos usar letras maiúsculas
          </p>
          <q-input
            dense
            outlined
            label="digite seu slug aqui"
            v-model="user.slug"
            :color="$theme.buttomColor"
            :rules="[
              (val) =>
                !/[^a-zA-Z-0-9_\s]/g.test(val) ||
                'Verifique as regras acima para seu slug 😉',
              (val) =>
                !val.includes(' ') ||
                'Verifique as regras acima para seu slug 😉',
            ]"
          />
        </div>
      </q-step>

      <q-step :name="3" title="Escolha um layout" icon="layout">
        <div class="w-full space-y-4 h-auto">
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold"
            :class="[$theme.titleColor]"
          >
            Definir Layout
          </h1>
          <p class="text-grey-8 font-semibold text-sm uppercase">
            Escolha entre as opçoes abaixo como deve ser a aparência da sua
            página, e não se preocupe, você poderá editar o layout escolhido na
            página de configurações.
          </p>
          <div class="flex flex-wrap gap-4 justify-center items-center mt-4">
            <q-item
              clickable
              @click="layoutSelected = item"
              v-for="item in store.layouts"
              :key="item.id"
              class="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]"
              :class="[
                layoutSelected.id && layoutSelected.id === item.id
                  ? 'border-8 border-'+$theme.buttomColor
                  : '',
              ]"
            >
              <q-img :src="item.thumbnail" />
            </q-item>
          </div>
        </div>
      </q-step>
      <q-step
        :name="4"
        title="Configuração das informações da página"
        icon="assignment"
      >
        <div class="w-full h-full space-y-4">
          <q-img src="/images/info.png" class="w-1/4"></q-img>
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold"
            :class="[$theme.titleColor]"
          >
            Configure o titulo e a descrição da página.
          </h1>
          <p class="text-grey-8 font-semibold text-sm uppercase">
            Esses são os dados que aparecerão no cabeçalho, e no rodapé da sua
            página pública.
          </p>
          <q-input
            dense
            outlined
            label="digite o titulo da sua página"
            v-model="page.title"
            :color="$theme.buttomColor"
            hint="O nome da sua empresa, seu nome, ex: Manicure Legal"
            required
            :rules="[
              (val) =>
                (val && val !== '') || 'O titulo da página é obrigatório',
            ]"
          />
          <q-input
            dense
            outlined
            label="digite a descrição da sua página"
            v-model="page.description"
            :color="$theme.buttomColor"
            hint="Descreva seus serviços, como funciona seu atendimento ou coloque qualquer informção que você acredite importante para descrever seu trabalho."
          />
        </div>
      </q-step>
      <q-step :name="5" title="Escolha um layout" icon="layout">
        <div class="w-full space-y-4 h-auto">
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold"
            :class="[$theme.titleColor]"
          >
            Agora visualize usa página
          </h1>
          <q-btn
            :label="'Veja ' + page.title"
            :to="{ path: '/' + user.slug }"
            :color="$theme.buttomColor"
          />
        </div>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="updateUser"
            :color="$theme.buttomColor"
            :label="step === 5 ? 'Salvar e Finalizar' : 'Salvar e Continuar'"
            :loading="nextLoading"
            class="px-4"
            dense
          />
          <q-btn
            v-if="step > 1"
            flat
            :color="$theme.buttomColor"
            @click="$refs.stepper.previous()"
            label="Voltar"
            class="q-ml-sm px-4"
            dense
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>
<script>
import { useUser } from "src/stores/user";
import AuthUser from "src/services/authUser";
import useGetCityForUf from "src/composables/getCityForUF";
import { useQuasar } from "quasar";

export default {
  data() {
    const store = useUser();
    const { getCity, findUF } = useGetCityForUf();
    const $q = useQuasar();
    return {
      user: null,
      $q,
      step: 1,
      store,
      getCity,
      findUF,
      nextLoading: false,
      defaultUser: null,
      page: {
        title: null,
        description: null,
        layout_id: null,
        active: "Y",
      },
      layoutSelected: {
        id: 0,
      },
      apiIsReady: false,
    };
  },
  async mounted() {
    const res = await AuthUser();
    await this.store.getLayoutsPage();
    const page = await this.store.getPageByUserId(res.user.id);

    if (page) {
      if (res.user.slug) this.$router.push("/" + res.user.slug);
    } else {
      this.$q.notify({
        message: `Houve um erro ao buscar informações, por favor contate o suporte: código <span class="font-bold uppercase">eusid${res.user.id}</span>`,
        timeout: 3000,
        html: true,
        color: "red-8",
        icon: "info",
      });
      return;
    }
    this.user = res.user;
    if (this.user.address_state) {
      this.user.address_state = this.findUF(this.user.address_state);
      this.ufSelected = true;
    }
    console.log(res.user);
    this.defaultUser = { ...res.user };
    this.apiIsReady = true;
  },
  computed: {
    $theme() {
      return this.store.theme;
    },
  },
  methods: {
    async updateUser() {
      this.nextLoading = true;
      if (this.step === 2) {
        if (this.user.slug !== "" && this.user.slug !== null) {
          if (this.user.slug !== this.defaultUser.slug) {
            const res = await this.store.updateUser({ slug: this.user.slug });
            console.log(res);
            if (res) {
              this.defaultUser.slug = this.user.slug;
            } else return;
          }
        } else {
          this.nextLoading = false;
          if (this.user.slug !== this.defaultUser.slug) return;
        }
      }

      if (this.step === 3) {
        this.page.layout_id = this.layoutSelected.id;
      }
      if (this.step === 4) {
        console.log(this.user);
        const res = await this.store.createPage(
          {
            ...this.page,
            user_id: this.user.id,
          },
          this.page.layout_id
        );
        if (!res) {
          this.nextLoading = false;
          return;
        }
      }
      this.nextLoading = false;
      this.$refs.stepper.next();
    },
  },
};
</script>

<style></style>
