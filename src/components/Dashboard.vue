<template>
  <v-container align-center>
    <v-layout>
      <v-flex sm8 offset-sm2 md6 offset-md-3>
        <v-card>
          <v-card-text>
            <v-list two-line subheader>
              <v-subheader v-if="today != null">Today</v-subheader>
              <div v-for="(item, index) in items" :key="item._id">
                <v-subheader v-if="today != null && index === today+1 && tomorrow != null">Tomorrow</v-subheader>
                <v-subheader v-else-if="today === null && index === 0 && tomorrow != null">Tomorrow</v-subheader>
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
                <v-divider v-if="daysLeft(item.date) === 0 && index != items.length -1 && daysLeft(items[index+1].date) > 0"></v-divider>
                <v-divider v-else-if="daysLeft(item.date) === 1 && index != items.length -1 && daysLeft(items[index+1].date) > 1"></v-divider>
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
      tomorrow: null
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
            const days = this.daysLeft(data.date)
            if (!this.today && days === 0) {
              this.today = index
            } else if (!this.tomorrow && days === 1) {
              this.tomorrow = index
            }
            this.items.push(data)
          }
        })
      })
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
    }
  }
}
</script>
