import { defineNuxtPlugin } from "#app";
import { setup } from "@css-render/vue3-ssr";

export default defineNuxtPlugin((nuxtApp) => {
  // 仅在服务端收集样式，避免 css-render 直接访问 document.head
  if (process.server) {
    const { collect } = setup(nuxtApp.vueApp);

    nuxtApp.hook("app:rendered", () => {
      const styleText = collect();
      if (styleText && nuxtApp.ssrContext) {
        // Nuxt 3 在 ssrContext.teleports.head 中插入样式
        const teleports = nuxtApp.ssrContext.teleports || (nuxtApp.ssrContext.teleports = {});
        teleports.head = (teleports.head || "") + `<style>${styleText}</style>`;
      }
    });
  }
});