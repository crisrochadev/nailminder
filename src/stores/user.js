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
    };
  },
  actions: {
    async updateUser(user) {
      const res = await api_auth
        .put("/user", user)
        .then((res) => res.data)
        .catch((error) => error);

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
        return true;
      }
    },
    async uploadImage(data) {
      console.log(data);
      const res = await api_auth
        .post("/image", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data)
        .catch((error) => error);

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
      const res = await api_auth
        .put("/user/password", {
          email,
          password,
          password_confirmation,
        })
        .then((res) => res.data)
        .catch((error) => error);

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
  },
});
