<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->

      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" prop="id" label="id" />
      <el-table-column  prop="name" label="名称" />
      <el-table-column  prop="imei" label="imei" />
      <el-table-column  prop="model" label="型号" />
      <el-table-column  prop="sn" label="序列号" />
      <el-table-column  prop="brand" label="品牌" />
      <el-table-column  prop="isActive" label="是否已激活">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.isActive == 1" :type="'success'"> {{ dict.label.is_active[scope.row.isActive] }}</el-tag>
            <el-tag v-else :type="'danger'">  {{ dict.label.is_active[scope.row.isActive] }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="bindDevice(scope.row)">绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
  import initData from '@/mixins/crud'
  import { formatTime } from '@/utils/index'
  export default {
    components: {  },
    mixins: [initData],
    dicts: ['is_active'],
    data() {
      return {
        delLoading: false,
        deviceType: '',
        data:[],
        queryTypeOptions: [

        ]
      }
    },
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      formatTime,
      beforeInit() {
        this.url = 'api/dUric/avaliableBind'
        const sort = 'id,desc'
        this.params = { page: this.page, size: this.size, sort: sort }
        const query = this.query
        const type = query.type
        const value = query.value
        if (type && value) { this.params[type] = value }
        return true
      },
      bindDevice(row){
        var sn = row.sn
        this.$emit("tt",sn);//这里调用父页面的函数
      }
    }
  }
</script>

<style scoped>

</style>
