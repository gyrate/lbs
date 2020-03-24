<template>
  <div>
    <div class="caption">
      <h1>本地Mock调试</h1>
      <p v-show="totalCount!==null">
        数据量 {{ totalCount }}
      </p>
    </div>
    <div style="padding:2em;">
      <el-button
        type="primary"
        @click="testMock"
      >
        发送请求
      </el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Index',
  data () {
    return {
      totalCount: 0
    }
  },
  mounted () {
  },
  methods: {
    testMock () {
      const loading = this.$loading({ lock: true })
      axios.get(process.env.VUE_APP_BASE_MOCK + '/fishs').then(res => {
        console.log(res)
        this.totalCount = res.data.length
      }).finally(() => {
        loading.close()
      })
    }
  }
}
</script>

<style scoped>

</style>
