<template>
  <div>
    <b-row align-h="between my-2">
      <h5>Devices</h5>
      <b-button v-b-toggle.collapse-1 size="sm" variant="primary">
        <b-icon icon="chevron-down" variant="light"></b-icon
      ></b-button>
    </b-row>
    <b-collapse visible id="collapse-1">
      <b-card-group deck>
        <b-card
          class="text-center "
          id="device"
          v-for="device in deviceList"
          :key="device.node_id"
          :border-variant="
            device.device_live === 'True' ? 'primary' : 'warning'
          "
          :bg-variant="device.node_id === keyword ? 'light' : 'default'"
          v-on:click="selectedDevice(device.node_id)"
        >
          <template #header>
            <h6 class="mb-0">
              {{ device.name }}
              <b-badge pill variant="danger">{{
                deviceCount[device.node_id]
              }}</b-badge>
            </h6>
          </template>
          <small>{{ device.description }}</small>
          <small class="newLine">{{ device.ippers }}</small>
          <small v-if="device.ip_address" class="newLine"
            >IP: {{ device.ip_address }}</small
          >
          <template #footer v-if="device.last_heartbeat">
            <small class="text-muted"
              >Last Seen {{ device.last_heartbeat | formatDate }}</small
            >
          </template>
        </b-card>
      </b-card-group>
    </b-collapse>
    <b-row align-h="between my-2">
      <h5>Recent Sources</h5>
      <b-button v-b-toggle.collapse-2 size="sm" variant="primary">
        <b-icon icon="chevron-down" variant="light"></b-icon
      ></b-button>
    </b-row>
    <b-collapse id="collapse-2">
      <b-card-group deck>
        <b-button
          class="text-center"
          id="source"
          v-for="source in sourceList"
          :key="source"
          variant="outline-danger"
          v-on:click="selectedDevice(source)"
          >{{ source }}
          <b-badge pill variant="danger">{{ sourceCount[source] }}</b-badge>
        </b-button>
      </b-card-group>
    </b-collapse>
    <b-row align-h="between my-2">
      <h5>Event Type</h5>
      <b-button v-b-toggle.collapse-3 size="sm" variant="primary">
        <b-icon icon="chevron-down" variant="light"></b-icon
      ></b-button>
    </b-row>
    <b-collapse id="collapse-3">
      <b-card-group deck>
        <b-button
          class="text-center"
          id="source"
          v-for="event in eventList"
          :key="event"
          variant="outline-info"
          v-on:click="selectedDevice(event)"
        >
          {{ event }}
          <b-badge pill variant="danger">{{ eventCount[event] }}</b-badge>
        </b-button>
      </b-card-group>
    </b-collapse>
    <div class="mt-1">
      <b-row align-h="end my-2">
        <b-btn size="sm" v-on:click="clearSelection()" variant="outline-primary"
          >Clear Selection</b-btn
        >
      </b-row>
      <b-table
        id="incidents"
        striped
        small
        bordered
        :items="incidents"
        :keyword="keyword"
        :per-page="perPage"
        :fields="fields"
        :current-page="currentPage"
      >
        <template #cell(description)="data">
          {{ data.item.description }}
          <b-badge pill variant="danger" class="float-right">{{
            data.item.events_count
          }}</b-badge>
        </template>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="incidents"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Dashboard',
  components: {},
  data () {
    return {
      fields: [
        {
          key: 'node_id',
          label: 'Device',
          sortable: true,
          formatter: (value, key, item) => {
            return this.deviceName[item.node_id]
              ? this.deviceName[item.node_id]
              : item.node_id
          }
        },
        { key: 'description', label: 'Event', sortable: true },
        {
          key: 'created',
          label: 'Time',
          sortable: true,
          formatter: (value, key, item) => {
            return moment.unix(item.created).format('MM/DD/YYYY hh:mm')
          }
        },
        { key: 'dst_host', label: 'Canary Device IP', sortable: true },
        { key: 'src_host', label: 'Source IP', sortable: true }
      ],
      keyword: '',
      deviceList: [],
      incidentsList: [],
      sourceList: [],
      eventList: [],
      perPage: 10,
      currentPage: 1,
      deviceCount: {},
      eventCount: {},
      sourceCount: {},
      deviceName: {}
    }
  },
  methods: {
    async loadData () {
      const data = await axios
        .get(
          'https://thinkst-frontend-resources.s3-eu-west-1.amazonaws.com/incidents/data.json'
        )
        .then(response => {
          this.data = data
          this.deviceList = response.data.device_list
          this.incidentsList = response.data.alerts
          this.deviceName = {}
          response.data.device_list.forEach(element => {
            if (element.node_id) {
              if (!this.deviceName[element.node_id]) {
                this.deviceName[element.node_id] =
                  element.name !== element.description
                    ? element.name + ' ' + element.description
                    : element.name
              }
            }
          })

          this.eventList = []
          this.sourceList = []
          response.data.alerts.forEach(element => {
            if (
              element.description &&
              !this.eventList.includes(element.description)
            ) {
              this.eventList.push(element.description)
            }

            if (
              element.src_host &&
              !this.sourceList.includes(element.src_host)
            ) {
              this.sourceList.push(element.src_host)
            }

            if (element.node_id) {
              if (!this.deviceCount[element.node_id]) {
                this.deviceCount[element.node_id] = 0
              }
              this.deviceCount[element.node_id] +=
                Number(element.events_count) || 1
            }

            if (element.src_host) {
              if (!this.sourceCount[element.src_host]) {
                this.sourceCount[element.src_host] = 0
              }
              this.sourceCount[element.src_host] +=
                Number(element.events_count) || 1
            }

            if (element.description) {
              if (!this.eventCount[element.description]) {
                this.eventCount[element.description] = 0
              }
              this.eventCount[element.description] +=
                Number(element.events_count) || 1
            }
          })
          console.log(data)
        })
    },
    selectedDevice (deviceId) {
      this.keyword = deviceId
      return this.keyword
    },
    clearSelection () {
      this.keyword = ''
    }
  },
  beforeMount () {
    this.loadData()
  },
  computed: {
    incidents () {
      return this.keyword
        ? this.incidentsList.filter(
          incident =>
            incident.node_id.includes(this.keyword) ||
              incident.src_host.includes(this.keyword) ||
              incident.description.includes(this.keyword)
        )
        : this.incidentsList
    },
    // for pagination
    rows () {
      return this.incidents.length
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#device {
  small {
    margin-bottom: 0.4em;
  }
}
#source {
  min-width: 120px;
  margin: 0.5em;
}
</style>
