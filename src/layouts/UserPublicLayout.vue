<template>
  <q-layout view="lHh Lpr lFf">
    <q-header unelevated flat class="bg-white"> </q-header>

    <q-page-container
      class="p-4 flex justify-center items-start h-screen border overflow-hidden"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      tab: "home",
    };
  },
};
</script>
