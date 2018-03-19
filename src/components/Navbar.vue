<template>
  <v-toolbar class="primary" dark>
    <v-tooltip bottom>
      <router-link to="/" slot="activator">
        <v-icon>home</v-icon>
      </router-link>
      <span>Home</span>
    </v-tooltip>
    <v-toolbar-title>Todo</v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  name: 'navbar'
}
</script>
