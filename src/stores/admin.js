import moment from "moment/moment";
import { defineStore } from "pinia";
import { useQuasar } from "quasar";
import { api_auth } from "src/boot/axios";
export const useAdmin = defineStore("admin", {
  state() {
    const $q = useQuasar();
    return {
      jobs: [],
      $q,
      jobsPagination: {
        current_page: 1,
        first_page_url: "https://nailminderapi-production.up.railway.app/api/user/jobs?page=1",
        from: 1,
        last_page: 2,
        last_page_url: "https://nailminderapi-production.up.railway.app/api/user/jobs?page=2",
        links: [
          {
            url: null,
            label: "&laquo; Previous",
            active: false,
          },
          {
            url: "https://nailminderapi-production.up.railway.app/api/user/jobs?page=1",
            label: "1",
            active: true,
          },
          {
            url: "https://nailminderapi-production.up.railway.app/api/user/jobs?page=2",
            label: "2",
            active: false,
          },
          {
            url: "https://nailminderapi-production.up.railway.app/api/user/jobs?page=2",
            label: "Next &raquo;",
            active: false,
          },
        ],
        next_page_url: "https://nailminderapi-production.up.railway.app/api/user/jobs?page=2",
        path: "https://nailminderapi-production.up.railway.app/api/user/jobs",
        per_page: 15,
        prev_page_url: null,
        to: 15,
        total: 18,
      },
      jobsLoading: false,
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
    async getJobs(endpoint = "/user/jobs?page=1") {
      this.jobsLoading = true;
      const res = await this.apiAction(
        "get",
        endpoint + "&perPage=" + this.jobsPagination.per_page
      );
      console.log(res);
      if (res.success) {
        this.jobs = res.data.jobs.data;
        Object.entries(res.data.jobs).forEach(([key, value]) => {
          if (key !== "data") {
            this.jobsPagination[key] = value;
          }
        });
      } else {
        this.$q.notify({
          message:
            "Não foi possivel recuperar seus trabalhos, tente mais tarde ou entre em contato com o adminitrador do sistema.",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
      }
      this.jobsLoading = false;
    },
    async getJobsByLink(item) {
      if (item.url) {
        let url = item.url.split("api")[1];
        let page = parseInt(item.url.split("page=")[1]);
        if (page) this.jobsPagination.current_page = page;
        await this.getJobs(url);
      }
    },
    async changePagination(perPage) {
      this.jobsPagination.per_page = parseInt(perPage);
      await this.getJobs("/user/jobs?page=" + this.jobsPagination.current_page);
    },
    async saveJob(data) {
      const res = await this.apiAction("post", "/user/jobs", data, {
        "Content-Type": "multipart/form-data",
      });

      if (res.success) {
        const resJob = await this.apiAction(
          "get",
          "/user/jobs/" + res.data.job_id
        );

        console.log(resJob);
        this.jobs.push(resJob.data.job);
      } else {
        this.$q.notify({
          message:
            "Não foi possivel salvar esse trabalho, tente mais tarde ou entre em contato com o adminitrador do sistema.",
          color: "red-8",
          textColor: "white",
          icon: "warning",
        });
      }
      return res;
    },
    async updateJob(data){
        console.log(data)
        const res = await this.apiAction("put", "/user/jobs/"+data.id, data, {
            "Content-Type": "multipart/form-data",
          });
    
          if (res.success) {
            const resJob = await this.apiAction(
              "get",
              "/user/jobs/" + res.data.job_id
            );
    
            console.log(resJob);
            this.jobs.push(resJob.data.job);
          } else {
            this.$q.notify({
              message:
                "Não foi possivel salvar esse trabalho, tente mais tarde ou entre em contato com o adminitrador do sistema.",
              color: "red-8",
              textColor: "white",
              icon: "warning",
            });
          }
          return res;
    }
  },
});
