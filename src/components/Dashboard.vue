<template>
  <v-container align-center>
    <v-layout>
      <v-flex sm8 offset-sm2 md6 offset-md-3>
        <v-card>
          <v-card-text>
            <v-list two-line subheader>
              <div v-for="(item, index) in items" :key="item._id">
                <v-divider v-if="today !== null && today !== 0 && index === today"></v-divider>
                <v-subheader v-if="today !== null && index === today">Today</v-subheader>
                <div v-if="tomorrow !== null && index === tomorrow">
                  <v-divider></v-divider>
                  <v-subheader>Tomorrow</v-subheader>
                </div>
                <div v-if="future !== null && index === future">
                  <v-divider></v-divider>
                  <v-subheader>Future</v-subheader>
                </div>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ item.name }}
                    </v-list-tile-title>
                      {{ (today != null && index > today) ? item.date+',' : ''}} {{ item.time }}
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-tooltip bottom>
                      <router-link
                        icon
                        ripple
                        slot="activator"
                        :to="{ name: 'editItem', params: {item_id: item._id}}">
                          <v-icon>edit</v-icon>
                      </router-link>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <v-btn class="red--text" icon ripple @click="removeItem(item._id, index)" slot="activator">
                        <v-icon>close</v-icon>
                      </v-btn>
                      <span>Delete</span>
                    </v-tooltip>
                  </v-list-tile-action>
                </v-list-tile>
                <!-- <v-divider v-if="index != items.length-1"></v-divider> -->
              </div>
            </v-list>
              <v-btn class="red"
                fixed
                bottom
                right
                fab
                to="/new">
                <v-icon class="white--text">add</v-icon>
              </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
PouchDB.plugin(PouchDBFind)

const db = new PouchDB('http://admin:admin@localhost:5984/todo', {
  skip_setup: true
})

export default {
  name: 'dashboard',
  data () {
    return {
      items: [],
      today: null,
      tomorrow: null,
      future: null
    }
  },
  created () {
    db
      .find({
        selector: {
          date: {$gte: null}
        },
        sort: ['date']
      })
      .then(results => {
        results.docs.forEach((doc, index) => {
          if (doc.name) {
            const date = new Date(doc.date)
            date.setHours(date.getHours() + 4)
            const data = {
              _id: doc._id,
              name: doc.name,
              date: date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              time: date.toLocaleTimeString('en-US')
            }
            this.items.push(data)
          }
        })
      })
      .then(() => this.getCategories())
      .catch(err => console.log(err))
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    removeItem (_id, index) {
      if (confirm('Are you sure?')) {
        db.get(_id)
          .then(doc => {
            db.remove(doc)
          })
          .then(() => {
            this.items.splice(index, 1)
            this.getCategories()
          })
          .catch(err => console.log(err))
      }
    },
    daysLeft (dueDate) {
      const today = new Date()
      const due = new Date(dueDate)
      const day = 1000 * 60 * 60 * 24

      const remaining = due - today
      return Math.ceil(remaining / day)
    },
    getCategories () {
      // Reset indexs
      this.today = null
      this.tomorrow = null
      this.future = null
      this.items.forEach((item, index) => {
        const days = this.daysLeft(item.date)
        if (this.today === null && days === 0) {
          this.today = index
        } else if (this.tomorrow === null && days === 1) {
          this.tomorrow = index
        } else if (this.future === null && days > 1) {
          this.future = index
        }
      })
    }
  }
}
</script>
