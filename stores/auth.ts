import { defineStore } from "pinia";
import { getCookie, deleteCookie } from "@/utils/cookie-utils";
import { AuthenticateSchema } from "./structs/auth_struct";
import { DataObjectLoginSchema } from "./structs/response_struct";
import { mask } from "superstruct";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("access_token"),
  }),
  getters: {
    getAccesToken: (state) => {
      state.accessToken = localStorage.getItem("access_token");
      return state.accessToken;
    },
    getAuthenticated: (state) => {
      state.accessToken = localStorage.getItem("access_token");
      return state.accessToken != null;
      // return false;
    },
  },
  actions: {
    async login(username: string, password: string): Promise<any> {
      // const res = await $fetch("/common/admin/auth", {
      //   baseURL: useRuntimeConfig().public.baseURL,
      //   method: "POST",
      //   body: JSON.stringify({ username: username, password: password }),

      //   onResponse({ request, response, options }) {
      //     console.log(response._data);
      //     console.log(response.headers.getSetCookie());

      //     response.headers.forEach((e) => console.log(e));
      //   },
      // });
      // const { data, pending, error, refresh } = await useAsyncData(
      //   "login",
      //   () =>
      //     $fetch(useRuntimeConfig().public.baseURL + "/common/admin/auth", {
      //       method: "POST",
      //       body: JSON.stringify({ username: username, password: password }),
      //       onResponse({ request, response, options }) {
      //         console.log("REQUEST");
      //         console.log(request);
      //         console.log("RESPONSE");
      //         console.log(response.headers.getSetCookie());
      //         response.headers.forEach((e) => console.log(e));
      //         console.log("OPTIONS");
      //         console.log(options.headers?.values);
      //       },
      //     })
      // );
      // console.log(data.value);

      const { data, error } = await useFetch("/common/admin/auth", {
        baseURL: useRuntimeConfig().public.baseURL,
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (data.value !== null) {
        const message = mask(data.value, DataObjectLoginSchema);
        var response = mask(message.data, AuthenticateSchema);
        this.accessToken = response.jwt_token;
        localStorage.setItem("access_token", this.accessToken);
        window.location.href = "/";
      } else if (error.value != null) {
        if (error._object[error._key].data.message == "admin_not_found")
          throw "Không tìm thấy tài khoản";
        else throw error._object[error._key].data.code;
      }
    },
    async refreshToken() {
      try {
        const jwtPayload = JSON.parse(
          window.atob(getCookie("admin_token") || "")
        );

        if (jwtPayload.exp < (new Date().getTime() + 1) / 1000) {
          const { data, error } = await useFetch("common/admin/refresh", {
            baseURL: useRuntimeConfig().public.baseURL,
            method: "POST",
          });

          if (data.value !== null) {
            const message = mask(data.value, DataObjectLoginSchema);
            var response = mask(message.data, AuthenticateSchema);
            this.accessToken = response.jwt_token;
            localStorage.setItem("access_token", this.accessToken);
          } else if (error.value != null) {
            throw error;
          }
        }
      } catch (error) {
        this.logout();
        throw error;
      }
    },
    async logout() {
      await useFetch("common/admin/logout", {
        baseURL: useRuntimeConfig().public.baseURL,
        method: "DELETE",
      });
      localStorage.removeItem("access_token");
      this.accessToken = "";
      deleteCookie("admin_token");
      return;
    },
  },
});
