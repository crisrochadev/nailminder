<template>
  <component
    v-for="item in items"
    :key="item.id"
    :is="item.element"
    :class="item.classe"
    :style="item.style"
  >
    <template v-if="item.content">
      {{ item.content }}
    </template>
    <template v-if="item.children">
      <dash-user :items="item.children" />
    </template>
  </component>
</template>

<script>
export default {
  props: ["items"],
  methods: {
 
  },
};
</script>

<style lang="scss" scoped></style>
