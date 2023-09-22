import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import callApi from "src/composables/call_api";

export const useAuth = defineStore("auth", {
  state: () => ({
    user: null,
    access_token: useStorage("nail_token", null),
    email:null,
    message:null
  }),

  actions: {
    async login(user) {
      const res = await callApi("post", "/auth/login", user);

      if (res.success) {
        this.user = res.user;
        this.access_token = res.access_token;
      }
      return res;
    },
    async register(user) {
      const res = await callApi("post", "/auth/register", user);

      if (res.success) {
        this.user = res.data.user;
        this.message = res.data.message;
      }
      console.log(res);
      return res;
    },
    async checkCode(code) {
      const res = await callApi("post", "/auth/check-code", {
        email: this.user.email,
        code,
      });

      if (res.success) {
        this.user = res.user;
      }
      return res;
    },
    async confirmEmail(token) {
      const res = await callApi("post", "/auth/email-verify",{code:token});

      if (res.success) {
        this.user = res.user;
      }
      return res;
    },
    async resetPass(email){
      const res = await callApi("post", "/auth/reset-pass",{email});

      
      return res;
    },
    async checkCode(email,code){
      const res = await callApi("post", "/auth/check-code",{email,code});

      
      return res;
    },
    async updatePassword(email,code,password,password_confirmation){
      const res = await callApi("put", "/auth/update-pass",{email,code,password,password_confirmation});

      
      return res;
    }
  },
});
