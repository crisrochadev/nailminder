import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const usePublic = defineStore("public", {
  state() {
    return {
      layout: null,
    };
  },
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async getLayoutBySlug(slug) {
      const res = await api
        .get("/public/user-layout/" + slug)
        .then((res) => res.data)
        .catch((error) => error);
        console.log(res)
      if (res.success) {
        const page = await  api
          .get("/public/page/" + res.data.id)
          .then((res) => res.data)
          .catch((error) => error);
          console.log(page)
        return page;
      } else {
        return {
          error:true,
          message:res.response.data.message
        };
      }
    },
  },
});
