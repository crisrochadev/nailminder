<template>
  <q-layout view="lHh Lpr lFf">
    <q-header unelevated flat class="bg-white">
      <q-toolbar>
        <q-toolbar-title class="text-pink-8"> Nailminder </q-toolbar-title>

        <q-tabs
          v-model="tab"
          inline-label
          dense  
          class="bg-white text-pink-8"
        
        >
          <q-route-tab :to="{name:'home'}" dense name="home" icon="home" label="Inicio" />
          <q-route-tab :to="{name:'login'}" dense name="login" icon="login" label="Entrar" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container class="p-4 flex justify-center items-start h-screen border  overflow-hidden">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data(){
    return {
      tab:'home'
    }
  }
}
</script>