<template>
  <div>
    <h3>Devices</h3>
    <b-card-group deck>
      <b-card
        class="text-center"
        id="deviceList"
        v-for="device in deviceList"
        :key="device.node_id"
        :border-variant="device.device_live === 'True' ? 'primary' : 'warning'"
        :bg-variant="device.node_id === keyword ? 'light' : 'default'"
        v-on:click="selectedDevice(device.node_id)"
      >
        <template #header>
          <h6 class="mb-0">{{ device.description }}</h6>
        </template>
        <p>
          <small>ID: {{ device.node_id }}</small>
        </p>
        <p v-if="device.ip_address">
          <small>IP {{ device.ip_address }}</small>
        </p>
        <template #footer v-if="device.last_heartbeat">
          <small class="text-muted"
            >Last Seen {{ device.last_heartbeat | formatDate }}</small
          >
        </template>
      </b-card>
    </b-card-group>
    <h3>Recent Attackers</h3>
    <b-card-group deck>
      <b-card
        class="text-center"
        id="attackerList"
        v-for="attacker in incidentsList"
        :key="attacker.node_id"
        :border-variant="danger"
        v-on:click="selectedDevice(attacker.src_host)"
      >
        <template #header>
          <h6 class="mb-0">{{ attacker.src_host }}</h6>
        </template>
      </b-card>
    </b-card-group>
    <div class="mt-1">
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
export default {
  name: 'Dashboard',
  components: {},
  data () {
    return {
      fields: [
        { key: 'node_id', sortable: true },
        'description',
        'created',
        'dst_host',
        'src_host',
        'key'
      ],
      keyword: '',
      deviceList: [],
      incidentsList: [],
      perPage: 10,
      currentPage: 1
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
          console.log(data)
        })
    },
    selectedDevice (deviceId) {
      this.keyword = deviceId
      return this.keyword
    }
  },
  beforeMount () {
    this.loadData()
  },
  computed: {
    incidents () {
      return this.keyword
        ? this.incidentsList.filter(
          incident => incident.node_id.includes(this.keyword)
          // incident.description.includes(this.keyword) ||
          // incident.src_host.includes(this.keyword)
        )
        : this.incidentsList
    },
    // for pagination
    rows () {
      return this.incidents.length
    }
  },
  watch: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
