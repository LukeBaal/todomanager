<template>
  <v-toolbar class="primary" dark>
    <v-tooltip bottom>
      <router-link to="/" slot="activator">
        <v-icon>home</v-icon>
      </router-link>
      <span>Home</span>
    </v-tooltip>
    <v-toolbar-title>
      {{new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
        })
      }}
    </v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  name: 'navbar'
}
</script>
