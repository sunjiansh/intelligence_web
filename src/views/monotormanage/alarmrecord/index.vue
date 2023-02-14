<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="createTimeStart"
          end-placeholder="createTimeEnd"
        />
       <!-- <span>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
          <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
        </span>-->

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--<crudOperation :permission="permission" />-->
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" v-if="false">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员姓名">
            <el-input v-model="form.menberName" :disabled="true" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员姓id" v-if="false">
            <el-input v-model="form.memberId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="报警类型">
            <el-select v-model="form.alarmType" :disabled="true" filterable placeholder="请选择" style="width: 370px;">
              <el-option
                v-for="item in dict.alarm_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" :disabled="true" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间" v-if="false">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="手环imei">
            <el-input v-model="form.imei" :disabled="true" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="报警内容">
            <el-input :rows="3" v-model="form.content" :disabled="true"  type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="false" prop="id" label="id" />
        <el-table-column v-if="false" prop="memberId" label="会员姓id" />
        <el-table-column v-if="columns.visible('menberName')" prop="menberName" label="会员姓名" />
        <el-table-column v-if="columns.visible('phone')" prop="phone" label="手机号" />
        <el-table-column v-if="columns.visible('imei')" prop="imei" label="手环imei" />
        <el-table-column v-if="columns.visible('alarmType')" prop="alarmType" label="报警类型">
          <template slot-scope="scope">
            {{ dict.label.alarm_type[scope.row.alarmType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('content')" prop="content" label="报警内容" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="报警时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','sAlarmReccord:edit','sAlarmReccord:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSAlarmReccord from '@/api/sAlarmReccord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";

// crud交由presenter持有
const defaultCrud = CRUD({ title: '报警记录', url: 'api/sAlarmReccord', sort: 'id,desc', crudMethod: { ...crudSAlarmReccord }})
const defaultForm = { id: null, alarmType: null, content: null, phone: null, createTime: null, imei: null, menberName: null, memberId: null }
export default {
  name: 'SAlarmReccord',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['alarm_type'],
  data() {
    return {

      permission: {
        add: ['admin', 'sAlarmReccord:add'],
        edit: ['admin', 'sAlarmReccord:edit'],
        del: ['admin', 'sAlarmReccord:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'alarmType', display_name: '报警类型' },
        { key: 'phone', display_name: '手机号' },
        { key: 'imei', display_name: '手环imei' },
        { key: 'menberName', display_name: '会员姓名' }
      ]
    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }else{
        delete this.crud.params.alarmType
        delete this.crud.params.phone
        delete this.crud.params.imei
        delete this.crud.params.menberName
      }
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
  }
}



</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
</style>
