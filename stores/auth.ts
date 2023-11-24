import { defineStore } from "pinia";
import { getCookie, deleteCookie } from "@/utils/cookie-utils";
import { AuthenticateSchema } from "./structs/auth_struct";
import { DataObjectSchema } from "./structs/response_struct";
import { mask } from "superstruct";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: "",
  }),
  getters: {
    getAccesToken: (state) => {
      state.accessToken = localStorage.getItem("access_token") ?? "";
      return state.accessToken;
    },
    getAuthenticated: (state) => {
      return state.accessToken != "" && getCookie("admin_token") != null;
      // return false;
    },
  },
  actions: {
    async login(username: string, password: string) {
      try {
        // const { data, pending, error, refresh } =
        const { data, error } = await useFetch("/common/admin/auth", {
          baseURL: useRuntimeConfig().public.baseURL,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        if (data.value != null) {
          this.accessToken = data.value.data.jwt_token;
          localStorage.setItem("access_token", data.value.data.jwt_token);
          localStorage.setItem("auth_doctor", "1");

          return navigateTo("/");
        } else if (error.value != null) {
          console.log(error.value);
          throw error;
        }
        // if (data.value !== null) {

        //   const message = mask(data.value, DataObjectSchema);
        //   var response = mask(message.data, AuthenticateSchema);
        //   this.accessToken = response.jwt_token;
        //   localStorage.setItem("access_token", this.accessToken);
        //   return navigateTo("/");
        // } else if (error.value != null) {
        //   console.log(error.value);
        //   throw error;
        // }
      } catch (error) {
        throw error;
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
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (data.value !== null) {
            const message = mask(data.value, DataObjectSchema);
            var response = mask(message.data, AuthenticateSchema);
            this.accessToken = response.jwt_token;
            localStorage.setItem("access_token", this.accessToken);
          } else if (error.value != null) {
            console.log(error.value);
            this.logout();
            throw error;
          }
        }
      } catch (error) {
        this.logout();
        throw error;
      }
    },
    async logout() {
      try {
        await useFetch("common/admin/logout", {
          baseURL: useRuntimeConfig().public.baseURL,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((res) => {
            localStorage.removeItem("access_token");
            this.accessToken = "";
            deleteCookie("admin_token");
            navigateTo("/");
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        throw error;
      }
    },
  },
});
