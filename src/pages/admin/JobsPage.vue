<template>
  <q-page class="w-full h-full overflow-hidden">
    <q-scroll-area class="w-full h-full pr-2">
      <div
        class="sticky top-0 z-40 w-full flex justify-between items-center p-2 gap-4"
        :class="[userStore.theme.bgColor]"
      >
        <h2
          class="w-full md:w-auto uppercase text-lg font-bold flex justify-between items-center gap-4"
          :class="[userStore.theme.titleColor]"
        >
          <q-btn
            icon="add"
            label="Novo"
            dense
            :color="userStore.theme.buttomColor"
            @click="openCreateOrEditJob = !openCreateOrEditJob"
          />
          Meus Trabalhos
        </h2>
        <div
          class="flex justify-center md:justify-end items-center gap-4 flex-1"
        >
          <div class="w-full md:w-2/6">
            <q-input
              :color="userStore.theme.buttomColor"
              v-model="search"
              label="Filtrar trabalhos"
              dense
              outlined
              class="full-width"
            >
              <template #after>
                <q-btn-group :color="userStore.theme.buttomColor">
                  <q-btn
                    label="-"
                    :color="userStore.theme.buttomColor"
                    @click="changeSize('minus')"
                  />
                  <q-btn
                    label="+"
                    :color="userStore.theme.buttomColor"
                    @click="changeSize('more')"
                  />
                </q-btn-group>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div
        class="w-full grid justify-center items-start gap-4 px-4 pb-14"
        :class="gridCols"
      >
        <q-card
          class="w-full relative"
          flat
          bordered
          v-for="(job, index) in jobs"
          :key="job.id"
        >
          <q-btn
            flat
            round
            :color="userStore.theme.buttomColor"
            icon="delete"
            class="absolute z-30"
          >
            <q-menu>
              <q-card>
                <q-card-section class="uppercase text-negative font-bold">
                  Tem certeza que deseja deletar esse trabalho?
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn
                    flat
                    label="Cancelar"
                    outline
                    icon="close"
                    color="gray-8"
                    v-close-popup
                  />
                  <q-btn
                    flat
                    label="Deletar"
                    icon="delete"
                    color="negative"
                    @click="jobs.splice(index, 1)"
                  />
                </q-card-actions>
              </q-card>
            </q-menu>
          </q-btn>
          <q-img :src="job.image" class="w-full h-[350px]">
            <div class="absolute-bottom text-subtitle2 text-center">
              {{ job.title }}
            </div></q-img
          >
          <q-card-actions align="left" class="">
            <div class="w-full flex justify-between items-center">
              <q-btn
                flat
                color="red"
                icon="favorite"
                :label="job.whishes_users.length"
              >
                <q-menu>
                  <q-card>
                    <q-card-section>
                      <q-list dense>
                        <q-item
                          dense
                          :clickable="user.client"
                          v-for="user in job.users_wishes"
                          :key="user.id"
                          @click="
                            () => {
                              if (user.client) {
                                $router.push({
                                  name: 'clientPage',
                                  params: { userId: user.id },
                                });
                              }
                            }
                          "
                        >
                          <q-item-section avatar dense round>
                            <q-icon round :name="`img:${user.avatar}`" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label
                              :class="[
                                user.client
                                  ? userStore.theme.titleColor
                                  : 'text-gray-6',
                              ]"
                              >{{ user.name }}</q-item-label
                            >
                          </q-item-section>
                          <q-item-section side caption>
                            <q-icon
                              :color="
                                user.client
                                  ? userStore.theme.buttomColor
                                  : 'gray-6'
                              "
                              :name="user.client ? 'done' : 'close'"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-menu>
              </q-btn>
              <div>
                <q-btn
                  flat
                  round
                  :color="userStore.theme.buttomColor"
                  icon="edit"
                  @click="handleEditJob(job)"
                />
              </div>
            </div>
          </q-card-actions>
        </q-card>
      </div>

      <!-- Paginação -->
      <div
        class="fixed bottom-0 z-40 w-full flex justify-center md:justify-between items-center p-2 gap-4"
        :class="[userStore.theme.bgColor]"
      >
        <div class="flex justify-end items-center gap-2">
          <q-btn-group class="flex justify-end items-center gap-2" rounded>
            <q-btn
              size="xs"
              :flat="!item.active"
              round
              :color="userStore.theme.buttomColor"
              v-for="item in store.jobsPagination.links"
              :key="item.label"
              class="flex justify-center items-center"
              @click="store.getJobsByLink(item)"
            >
              <p v-if="item.label && item.label.includes('&')">
                <q-icon
                  size="xs"
                  v-if="item.label.toLowerCase().includes('next')"
                  name="arrow_forward_ios"
                />
                <q-icon size="xs" v-else name="arrow_back_ios" />
              </p>
              <p v-else>{{ item.label }}</p>
            </q-btn>
          </q-btn-group>
          <q-btn-dropdown
            :label="store.jobsPagination.per_page"
            rounded
            size="sm"
            :color="userStore.theme.buttomColor"
          >
            <q-list dense class="full-width">
              <q-item clickable @click="store.changePagination(5)">5</q-item>
              <q-item clickable @click="store.changePagination(10)">10</q-item>
              <q-item clickable @click="store.changePagination(15)">15</q-item>
              <q-item clickable @click="store.changePagination(20)">20</q-item>
              <q-item clickable @click="store.changePagination(25)">25</q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <q-btn-dropdown
          size="sm"
          :color="userStore.theme.buttomColor"
          :label="'Ordenar por:' + orderType"
        >
          <q-list dense>
            <q-item
              clickable
              size="xs"
              v-close-popup
              @click="orderBy('recent_post', 'Postados recentemente')"
            >
              <q-item-section>
                <q-item-label>Postados recentemente</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="orderBy('recent_update', 'Atualizados recentemente')"
            >
              <q-item-section>
                <q-item-label>Atualizados recentemente</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="orderBy('wishes', 'Mais curtidos')"
            >
              <q-item-section>
                <q-item-label>Mais curtidos</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="orderBy('alpha', 'Ordem alfabética')"
            >
              <q-item-section>
                <q-item-label>Ordem alfabética</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <q-dialog v-model="openCreateOrEditJob">
        <q-card class="w-11/12 md:w-4/6">
          <q-card-section
            header
            class="w-full flex justify-start items-center gap-4 px-4"
          >
            <q-icon
              :name="editJob ? 'edit' : 'add'"
              dense
              :color="userStore.theme.buttomColor"
            />
            <p :class="['uppercase font-bold p-0', userStore.theme.titleColor]">
              {{ editJob ? job.title : "Adicionar Trabalho" }}
            </p>
          </q-card-section>
          <q-card-section
            class="flex flex-col justify-center items-center gap-4 py-4"
          >
            <q-input
              v-model="job.title"
              label="Titulo do trabalho"
              outlined
              dense
              class="full-width"
              :color="userStore.theme.buttomColor"
            ></q-input>
            <label
              for="image"
              class="w-[350px] h-[350px] border relative overflow-x-hidden cursor-pointer hover:opacity-90"
            >
              <div
                class="absolute top-0 left-0 p-2 flex justify-start items-center flex-nowrap bg-[rgba(255,255,255,.25)] w-full"
              >
                <q-icon
                  :name="imagename ? 'download_done' : 'upload'"
                  size="lg"
                  :color="userStore.theme.buttomColor"
                />
                <span
                  class="uppercase text-sm font-bold"
                  :class="[userStore.theme.titleColor]"
                  >{{
                    imagename
                      ? imagename.length > 25
                        ? "..." + limitarString(imagename, 25)
                        : "" + limitarString(imagename, 25)
                      : "Carregar Imagem"
                  }}</span
                >
              </div>
              <input
                type="file"
                id="image"
                class="hidden"
                label="Imagem"
                @change="uploadImage"
                :color="userStore.theme.buttomColor"
                accept="image/jpeg, image/jpg, image/png"
              />
              <div
                class="w-full h-full bg-cover"
                :style="{ backgroundImage: 'url(' + image + ')' }"
              ></div>
              <span class="block mx-1 absolute bottom-1 left-1"
                >clique na imagem para trocar</span
              >
            </label>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              label="cancelar"
              outline
              icon="close"
              dense
              :color="userStore.theme.buttomColor"
              v-close-popup
            />
            <q-btn
              label="salvar"
              icon="save"
              dense
              :color="userStore.theme.buttomColor"
              :loading="loading"
              @click="saveJob"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-scroll-area>
    <div class="invisible">
      <div class="grid-cols-1"></div>
      <div class="grid-cols-2"></div>
      <div class="grid-cols-3"></div>
      <div class="grid-cols-4"></div>
      <div class="grid-cols-5"></div>
      <div class="grid-cols-6"></div>
      <div class="grid-cols-7"></div>
      <div class="grid-cols-8"></div>
      <div class="grid-cols-9"></div>
      <div class="grid-cols-10"></div>
      <div class="grid-cols-11"></div>
      <div class="grid-cols-12"></div>
    </div>
  </q-page>
</template>

<script>
import { useAdmin } from "src/stores/admin";
import { useUser } from "src/stores/user";
import moment from "moment";
import { useQuasar } from "quasar";

export default {
  data() {
    const store = useAdmin();
    const userStore = useUser();
    const $q = useQuasar();
    return {
      store,
      userStore,
      search: "",
      orderType: "",
      image: null,
      imagename: null,
      openCreateOrEditJob: false,
      editJob: false,
      job: {
        title: null,
        image: null,
      },
      loading: false,
      $q,
      cols: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
      lg: 4,
      md: 3,
      xs: 1,
    };
  },
  async mounted() {
    await this.store.getJobs();
  },
  computed: {
    jobs: {
      get() {
        return this.store.jobs.filter((job) =>
          job.title.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      set(newvalue) {
        this.store.jobs = newvalue;
      },
    },
    gridCols() {
      return `grid-cols-${this.xs} md:grid-cols-${this.md} lg:grid-cols-${this.lg}`;
    },
    height() {
      return `h-[${250 * this.xs}px] md:h-[${250 * this.md}px] h-[${
        250 * this.lg
      }px]`;
    },
  },
  methods: {
    handleEditJob(job) {
      this.job.title = job.title;
      this.job.image = job.image;
      this.image = job.image;
      this.job["id"] = job.id;
      this.job["old_image"] = job.image;
      this.editJob = true;
      this.openCreateOrEditJob = true;
    },
    orderBy(type, orderName) {
      switch (type) {
        case "recent_post":
          this.jobs = this.jobs.sort((a, b) =>
            moment(b.created_at, "YYYY-DD-MMTHH:mm").diff(
              moment(a.created_at, "YYYY-DD-MMTHH:mm")
            )
          );
          break;
        case "recent_update":
          this.jobs = this.jobs.sort((a, b) =>
            moment(b.updated_at, "YYYY-DD-MMTHH:mm").diff(
              moment(a.updated_at, "YYYY-DD-MMTHH:mm")
            )
          );
          break;
        case "alpha":
          this.jobs = this.jobs.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "wishes":
          this.jobs = this.jobs.sort(
            (a, b) => b.whishes_users.length - a.users_wishes.length
          );
          break;
        default:
          console.error("Tipo de ordenação não reconhecido:", type);
          break;
      }
      this.orderType = orderName;
    },
    async saveJob() {
      if (!this.job.title || this.job.title.length === 0) {
        this.$q.notify({
          message: "Você precisa adicionar um titulo pare seu trabalho",
          color: "red-8",
          textColor: "white",
          icon: "warning",
          timeout: 2000,
        });
      } else if (!this.job.image || this.job.image.length === 0) {
        this.$q.notify({
          message: "O seu trabalho precisa de uma imagem",
          color: "red-8",
          textColor: "white",
          icon: "warning",
          timeout: 2000,
        });
      } else {
        this.loading = true;

        if (this.editJob) {
          const res = await this.store.updateJob(this.job);
          console.log(res);
          this.openCreateOrEditJob = false;
        } else {
          console.log(this.job);
          const res = await this.store.saveJob(this.job);
          console.log(res);
          this.openCreateOrEditJob = false;
        }
        this.loading = false;
        this.editJob = false;
        this.job = {
          title: "",
          image: "",
        };
      }
    },
    async uploadImage(event) {
      const file = event.target.files[0]; // Captura o primeiro arquivo selecionado

      if (file) {
        this.job.image = file;
        this.imagename = file.name;
        const base64String = await await this.resizeImage(file);
        this.image = base64String;
      }
    },
    limitarString(string, limite) {
      if (string.length > limite) {
        return string.slice(-limite);
      }
      return string;
    },
    resizeImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Define as novas dimensões desejadas
            const maxWidth = 800;
            const maxHeight = 600;

            let newWidth = img.width;
            let newHeight = img.height;

            if (img.width > maxWidth) {
              newWidth = maxWidth;
              newHeight = (img.height * maxWidth) / img.width;
            }

            if (newHeight > maxHeight) {
              newWidth = (img.width * maxHeight) / img.height;
              newHeight = maxHeight;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Desenha a imagem redimensionada no canvas
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Converte o canvas de volta para base64
            const base64String = canvas.toDataURL("image/jpeg", 0.7); // 0.7 é a qualidade da imagem (de 0 a 1)

            resolve(base64String);
          };
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    },
    changeSize(type) {
      if (type === "minus") {
        if (this.lg < 8) this.lg++;
        if (this.md < 6) this.md++;
        if (this.xs < 2) this.xs++;
      } else {
        if (this.lg > 1) this.lg--;
        if (this.md > 1) this.md--;
        if (this.xs > 1) this.xs--;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
