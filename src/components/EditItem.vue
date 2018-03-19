<template>
  <v-container>
    <v-layout>
      <v-flex sm10 offset-sm1 md8 offset-md-2>
        <v-form>
          <v-text-field
            label="Name"
            v-model="name"
            required>
          </v-text-field>
          <v-layout>
            <v-flex xs-6>
              <v-menu
                ref="datemenu"
                lazy
                :close-on-content-click="false"
                v-model="datemenu"
                transition="scale-transition"
                :return-value.sync="date">
                <v-text-field
                  slot="activator"
                  label="Pick date"
                  v-model="date"
                  prepend-icon="event"
                  readonly
                  required>
                </v-text-field>
                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.datemenu.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs-6>
              <v-menu
                ref="timemenu"
                lazy
                :close-on-content-click="false"
                v-model="timemenu"
                transition="scale-transition"
                :return-value.sync="time">
                <v-text-field
                  slot="activator"
                  label="Pick time"
                  v-model="time"
                  prepend-icon="access_time"
                  readonly
                  required>
                </v-text-field>
                <v-time-picker
                  v-model="time"
                  @change="$refs.timemenu.save(time)">
                </v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-spacer></v-spacer>
          <v-btn @click="editItem(item_id)" color="primary">Submit</v-btn>
          <v-btn to="/" color="grey lighten-2">Cancel</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PouchDB from 'pouchdb'
const db = new PouchDB('http://admin:admin@localhost:5984/todo', {
  skip_setup: true
})
export default {
  name: 'editItem',
  data () {
    return {
      item_id: null,
      name: null,
      datemenu: false,
      date: null,
      timemenu: false,
      time: null
    }
  },
  beforeRouteEnter (to, from, next) {
    db.get(to.params.item_id)
      .then(doc => {
        next(vm => {
          vm.item_id = doc._id
          vm.name = doc.name
          vm.date = doc.date.slice(0, 10)
          vm.time = doc.date.slice(11, 16)
        })
      })
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      db.get(this.$route.params.item_id)
        .then(doc => {
          this.item_id = doc._id
          this.name = doc.name
          this.date = doc.date.slice(0, 10)
          this.time = doc.date.slice(11, 16)
        })
    },
    editItem (id) {
      db.get(id)
        .then(doc => {
          doc.name = this.name
          doc.date = `${this.date}T${this.time}:00.000Z`

          return db.put(doc)
        })
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err))
    }
  }
}
</script>
