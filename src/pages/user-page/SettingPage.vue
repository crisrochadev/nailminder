<template>
  <q-page class="w-full p-4 h-full overflow-y-auto">
    <q-stepper
      v-model="step"
      ref="stepper"
      color="cyan-6"
      animated
      inactive-color="grey-8"
      done-icon="chevron_right"
      done-color="cyan-6"
      active-color="cyan-6"
      error-color="red-6"
      flat
      :vertical="$q.screen.xs"
    >
      <q-step :name="1" title="Inicio" icon="settings" :done="step > 1">
        <div class="w-full h-full">
          <q-img src="/images/website.png" class="w-1/4"></q-img>
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold text-cyan-6"
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
            class="uppercase text-md font-bold text-cyan-6"
          >
            Comece escolhendo o endereço da sua página
          </h1>
          <p class="text-grey-8 font-semibold text-sm uppercase">
            Um slug, é o nome que aparece depois da / no endereço, por exemplo:
            https://nailminder.com/<span class="font-semibold text-cyan-6"
              >melhormanicure</span
            >, [<span class="font-semibold text-cyan-6">melhormanicure</span>] é
            o slug.
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
            color="cyan-6"
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

      <q-step
        :name="3"
        title="Configuração das informações da página"
        icon="assignment"
      >
        <div class="w-full h-full space-y-4">
          <q-img src="/images/info.png" class="w-1/4"></q-img>
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold text-cyan-6"
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
            color="cyan-6"
            hint="O nome da sua empresa, seu nome, ex: Manicure Legal"
          />
          <q-input
            dense
            outlined
            label="digite a descrição da sua página"
            v-model="page.description"
            color="cyan-6"
            hint="Descreva seus serviços, como funciona seu atendimento ou coloque qualquer informção que você acredite importante para descrever seu trabalho."
          />
        </div>
      </q-step>

      <q-step :name="4" title="Escolha um layout" icon="layout">
        <div class="w-full space-y-4 h-auto">
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold text-cyan-6"
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
              v-for="item in layouts"
              :key="item.id"
              class="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]"
              :class="[
                layoutSelected.id && layoutSelected.id === item.id
                  ? 'border-8 border-cyan-600'
                  : '',
              ]"
            >
              <q-img :src="item.url_image" />
            </q-item>
          </div>
        </div>
      </q-step>
      <q-step :name="5" title="Escolha um layout" icon="layout">
        <div class="w-full space-y-4 h-auto">
          <h1
            style="line-height: 30px"
            class="uppercase text-md font-bold text-cyan-6"
          >
            Agora visualize usa página
          </h1>
          <q-btn :label="'Veja '+page.title" :to="{path:'/'+user.slug}" color="cyan-6" />
        </div>
      </q-step>


      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="updateUser"
            color="cyan-6"
            :label="step === 5 ? 'Salvar e Finalizar' : 'Salvar e Continuar'"
            :loading="nextLoading"
            class="px-4"
            dense
          />
          <q-btn
            v-if="step > 1"
            flat
            color="cyan-6"
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
      },
      layouts: [
        {
          id: 1,
          layoutName: "Nailminder 1",
          url_image:
            "https://res.cloudinary.com/dte7upwcr/image/upload/blog/blog2/modelos-de-sites/image_10-modelos-de-sites-futurio.jpg",
        },
        {
          id: 2,
          layoutName: "Nailminder 2",
          url_image:
            "data:image/jpeg;base64,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",
        },
        {
          id: 3,
          layoutName: "Nailminder 3",
          url_image:
            "https://lh6.googleusercontent.com/CI5GIDq7gUJheLrNIxSELTHIAShxLSCKVNSArfIu_a6Cqx5N2Cwc4zcosw4aOusoXgr43sL4YB7fVAls4OYzwZbK_fMZmkk-DU5PN6d2pq4QWmIyr5iLf5GN99Ec_mXApXzjDsZf",
        },
        {
          id: 4,
          layoutName: "Nailminder 4",
          url_image:
            "https://www.projetowebsite.com.br/template/images/modelos-de-site/sites-prontos-padrao-modernos-responsivo.jpg",
        },
      ],
      layoutSelected: {
        id: 0,
      },
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
      this.nextLoading = false;
      this.$refs.stepper.next();
    },
  },
};
</script>

<style></style>
