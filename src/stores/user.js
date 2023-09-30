import { useStorage } from "@vueuse/core";
import axios from "axios";
import { defineStore } from "pinia";
import { useQuasar } from "quasar";
import { api_auth } from "src/boot/axios";

export const useUser = defineStore("user", {
  state() {
    const $q = useQuasar();
    return {
      user: {},
      $q,
      layouts: [],
      theme: useStorage("nailminder.theme", {
        id: 1,
        title: "Tema Aqua",
        titleColor: "text-cyan-6",
        titleColor2: "text-cyan-6",
        titleColor3: "text-cyan-5",
        titleColor4: "text-cyan-5",
        textColor: "text-gray-8",
        buttomColor: "cyan-6",
        bgColor: "bg-cyan-1",
        var_primary: "#00BCD4",
        var_secondary: "#26C6DA",
        var_accent: "#616161",
        var_light: "#E0F7FA",
      }),
      themes: [
        {
          id: 1,
          title: "Tema Aqua",
          titleColor: "text-cyan-6",
          titleColor2: "text-cyan-6",
          titleColor3: "text-cyan-5",
          titleColor4: "text-cyan-5",
          textColor: "text-gray-8",
          buttomColor: "cyan-6",
          bgColor: "bg-cyan-1",
          var_primary: "#00BCD4",
          var_secondary: "#26C6DA",
          var_accent: "#616161",
          var_light: "#E0F7FA",
        },
        {
          id: 2,
          title: "Tema Rosa",
          titleColor: "text-pink-6",
          titleColor2: "text-pink-6",
          titleColor3: "text-pink-5",
          titleColor4: "text-pink-5",
          textColor: "text-gray-8",
          buttomColor: "pink-6",
          bgColor: "bg-pink-1",
          var_primary: "#E91E63",
          var_secondary: "#EC407A",
          var_accent: "#616161",
          var_light: "#FCE4EC",
        },
        {
          id: 3,
          title: "Tema Azul",
          titleColor: "text-indigo-6",
          titleColor2: "text-indigo-6",
          titleColor3: "text-indigo-5",
          titleColor4: "text-indigo-5",
          textColor: "text-gray-8",
          buttomColor: "indigo-6",
          bgColor: "bg-indigo-1",
          var_primary: "#3F51B5",
          var_secondary: "#5C6BC0",
          var_accent: "#616161",
          var_light: "#E8EAF6",
        },
        {
          id: 4,
          title: "Tema lilás",
          titleColor: "text-purple-6",
          titleColor2: "text-purple-6",
          titleColor3: "text-purple-5",
          titleColor4: "text-purple-5",
          textColor: "text-gray-8",
          buttomColor: "purple-6",
          bgColor: "bg-purple-1",
          var_primary: "#9C27B0",
          var_secondary: "#AB47BC",
          var_accent: "#616161",
          var_light: "#F3E5F5",
        },
        {
          id: 5,
          title: "Tema Verde",
          titleColor: "text-light-green-6",
          titleColor2: "text-light-green-6",
          titleColor3: "text-light-green-5",
          titleColor4: "text-light-green-5",
          textColor: "text-gray-8",
          buttomColor: "light-green-6",
          bgColor: "bg-light-green-1",
          var_primary: "#8BC34A",
          var_secondary: "#9CCC65",
          var_accent: "#616161",
          var_light: "#F1F8E9",
        },
        {
          id: 6,
          title: "Tema Laranja",
          titleColor: "text-orange-6",
          titleColor2: "text-orange-6",
          titleColor3: "text-orange-5",
          titleColor4: "text-orange-5",
          textColor: "text-gray-8",
          buttomColor: "orange-6",
          bgColor: "bg-orange-1",
          var_primary: "#FF9800",
          var_secondary: "#FFA726",
          var_accent: "#616161",
          var_light: "#FFF3E0",
        },
      ],
    };
  },
  actions: {
    async apiAction(method, endpoint, body = {}, headers = {}) {
      return await api_auth[method](endpoint, body, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("nail_token"),
          ...headers,
        },
      })
        .then((res) => res.data)
        .catch((error) => ({ error }));
    },
    async updateUser(user) {
      const res = await this.apiAction("put", "/user", user);
      console.log(res);
      if (!res.success) {
        this.$q.notify({
          message:
            "Não foi possivel salvar a alteração, tente mais tarde ou entre em contato com o adminitrador do sistema.",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
        this.user = res.data;
        return null;
      } else {
        this.$q.notify({
          message: res.message,
          color: "green-8",
          textColor: "white",
          icon: "done",
        });
        return true;
      }
    },
    async uploadImage(data) {
      console.log(data);
      const res = await this.apiAction("post", "/image", data, {
        "Content-Type": "multipart/form-data",
      });

      console.log(res)
      if (!res.success) {
        this.$q.notify({
          message:
            "Não foi possivel salvar a alteração, tente mais tarde ou entre em contato com o adminitrador do sistema.",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
        return null;
      } else {
        this.$q.notify({
          message: res.message,
          color: "green-8",
          textColor: "white",
          icon: "done",
        });
        return res.data.url;
      }
    },
    async saveNewPass(email, password, password_confirmation) {
      const res = await this.apiAction("put", "/user/password", {
        email,
        password,
        password_confirmation,
      });

      if (!res.success) {
        this.$q.notify({
          message:
            "Não foi possivel atualizar a senha, tente mais tarde ou entre em contato com o adminitrador do sistema.",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
        return null;
      } else {
        this.$q.notify({
          message: res.message,
          color: "green-8",
          textColor: "white",
          icon: "done",
        });
        return true;
      }
    },
    async checkCep(cep) {
      const newcep = cep.replace("-", "");

      const res = await axios
        .get(`https://viacep.com.br/ws/${newcep}/json`)
        .then((res) => ({ success: true, data: res.data }))
        .catch((error) => error);
      if (res.data.erro) {
        this.$q.notify({
          message: "Cep não encontrado",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
        return { success: false };
      }
      return res;
    },
    async getCep(city, street, state) {
      const res = await axios
        .get(`https://viacep.com.br/ws/${state}/${city}/${street}/json`)
        .then((res) => ({ success: true, data: res.data }))
        .catch((error) => ({ error }));
      console.log(res);
      if ((res.data && res.data.erro) || res.error) {
        this.$q.notify({
          message:
            "Tentamos consultar o cep pelo endereço, mas não foi possivel.Por Favor digite o cep",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
        return { success: false };
      }
      return res;
    },
    async createPage(data) {
      console.log(data);
      let newdata = { ...data };
      if (!data.description || data.description === "")
        newdata["description"] = "";
      console.log(newdata);
      const res = await this.apiAction("post", "/user/page", newdata);
      console.log(res);
      if (!res.success) {
        this.$q.notify({
          message:
            "Não foi possivel salvar a alteração, tente mais tarde ou entre em contato com o adminitrador do sistema.",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
        return false;
      } else {
        return res;
      }
    },
    async getLayoutsPage() {
      const res = await this.apiAction("get", "/user/layout-pages", {});
      console.log(res);
      if (!res.success) {
        this.$q.notify({
          message:
            "Não foi possivel buscar os layouts, tente mais tarde ou entre em contato com o adminitrador do sistema.",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
        return null;
      } else {
        this.layouts = res.data.data;
        return true;
      }
    },
    async getPageByUserId(id) {
      const res = await this.apiAction("get", "/user/page/" + id, {});
      console.log(res);
      if (!res.success) {
        this.$q.notify({
          message:
            "Não foi possivel buscar os layouts, tente mais tarde ou entre em contato com o adminitrador do sistema.",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
        return false;
      } else {
        return res;
      }
    },
    async updatePage(id, data) {
      const res = await this.apiAction("put", "/user/page/" + id, data);
      console.log(res);
      if (!res.success) {
        return false;
      } else {
        return res;
      }
    },
    async updateLayout(id, data) {
      const res = await this.apiAction(
        "put",
        "/user/layout-page/page/" + id,
        data
      );
      console.log(res);
      if (!res.success) {
        return false;
      } else {
        return res;
      }
    },
  },
});
