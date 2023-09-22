<template>
  <q-page class="w-full grid md:grid-cols-2 gap-4 p-4 h-full overflow-y-auto">
    <q-card class="p-2 md:p-8">
      <h2 class="font-bold uppercase text-md" :class="[$theme.titleColor]">
        Configuraçõs da página pública
      </h2>
      <q-form v-if="apiIsReady" class="space-y-4" @submit.prevent="savePage">
        <q-input outlined dense v-model="page.slug" label="Slug da página" />
        <q-input
          outlined
          dense
          v-model="page.title"
          label="Titulo da página pública"
        />
        <q-input
          outlined
          dense
          v-model="page.description"
          label="Titulo da página pública"
        />

        <div>
          <q-input
            readonly
            dense
            outlined
            v-model="page.layout.name"
            label="layout da página"
          >
            <template #append>
              <q-btn dense :color="$theme.buttomColor" label="trocar" flat>
                <q-menu>
                  <q-card>
                    <q-table
                      flat
                      bordered
                      grid
                      title="Layouts"
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      :filter="filter"
                      hide-header
                      hide-bottom
                    >
                      <template v-slot:item="props">
                        <q-item class="w-2/4 relative">
                          <q-item-section>
                            <div
                              v-close-popup
                              @click="page.layout = props.row"
                              class="full-width relative h-11/12 p-0"
                              outline
                              :class="[
                                page.layout.id === props.row.id
                                  ? 'border-4 border-'+$theme.buttomColor
                                  : '',
                              ]"
                            >
                              <q-img
                                :src="props.row.thumbnail"
                                class="w-full h-full"
                              />
                            </div>
                            <router-link
                              :class="[$theme.titleColor]"
                              class="w-full text-right uppercase text-xs font-bold cursor-pointer hover:text-cyan-800 p-2"
                              :to="'/' + props.row.name"
                              target="_blank"
                              >Preview</router-link
                            >
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-table>
                  </q-card>
                </q-menu>
              </q-btn>
            </template>
          </q-input>
        </div>
        <div class="w-full flex justify-end items-center px-2">
          <q-btn dense :color="$theme.buttomColor" type="submit">
            <div class="w-28 flex justify-start gap-4 px-2">
              <q-icon dense name="save" />
              <span>Salvar</span>
            </div>
          </q-btn>
        </div>
      </q-form>
    </q-card>
    <q-card class="p-2 md:p-8">
      <h2 class="font-bold uppercase text-md " :class="$theme.titleColor">
        Configuraçõs da página administrativa
      </h2>
      <q-select
        :options="userStore.themes"
        v-model="userStore.theme"
        option-label="title"
        outlined
        dense
        label="Tema de cores"
      >
        <template #selected>
          <div class="w-full flex justify-start items-center px-2 gap-2">
            <span
              class="block rounded-full w-4 h-4"
              :class="[$theme.bgColor]"
            ></span>
            <span :class="[$theme.titleColor, 'font-bold']">{{
              $theme.title
            }}</span>
          </div>
        </template>
        <template v-slot:option="{ itemProps, opt }">
          <q-item v-bind="itemProps" dense>
            <q-item-section>
              <q-item-label :class="opt.titleColor">{{
                opt.title
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <span
                class="block rounded-full w-4 h-4"
                :class="[opt.bgColor]"
              ></span>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card>
  </q-page>
</template>

<script>
import { usePublic } from "src/stores/public";
import { useUser } from "src/stores/user";
import { useQuasar } from "quasar";
export default {
  data() {
    const store = usePublic();
    const userStore = useUser();
    const $q = useQuasar();
    return {
      $q,
      page: {
        title: "",
        description: "",
        layout: {
          id: 1,
          title: "",
        },
      },
    

      defaultPage: {},
      userStore,
      store,
      user: null,
      apiIsReady: false,
      rows: [],
      columns: [
        {
          label: "",
          field: "name",
          name: "name",
        },
        {
          label: "",
          field: "thumbnail",
          name: "thumbnail",
        },
      ],

      filter: "",
    };
  },
  computed:{
    $theme(){
      return this.userStore.theme
    }
  },
  async mounted() {
    console.log(this.$theme);
    this.user = this.$route.meta.user;
    const res = await this.store.getLayoutBySlug(this.user.slug);
    console.log(res.data);
    if (res.success) {
      this.page["id"] = res.data.page.id;
      this.page["slug"] = this.user.slug;
      this.page["title"] = res.data.page.title;
      this.page["layout"] = res.data.page.layout;
      this.page["description"] = res.data.page.description;

      this.defaultPage["id"] = res.data.page.id;
      this.defaultPage["slug"] = this.user.slug;
      this.defaultPage["title"] = res.data.page.title;
      this.defaultPage["layout"] = res.data.page.layout;
      this.defaultPage["description"] = res.data.page.description;
    }
    const resLayout = await this.userStore.getLayoutsPage();
    if (resLayout) {
      this.rows = this.userStore.layouts;
    }
    console.log(this.rows);
    this.apiIsReady = true;
  },

  methods: {

    async savePage() {
      if (Object.keys(this.defaultPage).length > 0) {
        let saveUser = {};
        if (this.page.slug !== this.defaultPage.slug)
          saveUser["slug"] = this.page.slug;
        if (Object.keys(saveUser).length > 0) {
          const res = this.userStore.updateUser(saveUser);
          console.log(res);
          if (res) {
            this.$q.notify({
              message: "Slug alterado com sucesso!",
              color: "green-6",
              icon: "done",
              timeout: 1500,
            });
          } else {
            this.$q.notify({
              message:
                "Slug não pode ser alterado, tente novamente mais tarde ou contate o suporte!",
              color: "red-6",
              icon: "info",
              timeout: 1500,
            });
          }
        }
        let savePage = {};
        if (this.page.title !== this.defaultPage.title)
          savePage["title"] = this.page.title;
        if (this.page.description !== this.defaultPage.description)
          savePage["description"] = this.page.description;

        savePage["layout_id"] = this.page.layout.id;

        if (Object.keys(savePage).length > 0) {
          console.log(this.page.id);
          const res = this.userStore.updatePage(this.page.id, savePage);
          console.log(res);
          if (res) {
            this.$q.notify({
              message: "Informações da página alteradas com sucesso!",
              color: "green-6",
              icon: "done",
              timeout: 1500,
            });
          } else {
            this.$q.notify({
              message:
                "Dados não foram alterados, tente novamente mais tarde ou contate o suporte!",
              color: "red-6",
              icon: "info",
              timeout: 1500,
            });
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
