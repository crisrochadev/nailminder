<template>
  <q-page v-if="apiIsReady" class="w-full border">
    <div v-if="pageNotFound">
      <h1>{{ pageNotFoundMessage }}</h1>
    </div>
    <dash-user v-else :items="page.layout.items" />
  </q-page>
</template>

<script>
import { usePublic } from "src/stores/public";
import DashUser from "src/components/dash-user/DashUser.vue";
export default {
  components: { DashUser },
  data() {
    const store = usePublic();
    return {
      store,
      page: null,
      apiIsReady: false,
      pageNotFound: false,
      pageNotFoundMessage: null,
    };
  },
  async mounted() {
    const res = await this.store.getLayoutBySlug(this.$route.params.slug);
    console.log(res);
    if (!res.error) {
      this.page = res.data.page;
      console.log(this.page);
    } else {
      console.log(res.response);
      this.pageNotFound = res.error;
      this.pageNotFoundMessage = res.message;
    }
    this.apiIsReady = true;
  },
};
</script>

<style></style>
