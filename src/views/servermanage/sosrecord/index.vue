<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->

      <el-input v-model="query.memberPhone" clearable placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
      <!--<el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">-->
        <!--<el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
      <!--</el-select>-->
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="id" v-if="false">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员名称">
            <el-input v-model="form.memberName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员id" v-if="false" prop="memberId">
            <el-input v-model="form.memberId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员手机号" prop="memberPhone">
            <el-input v-model="form.memberPhone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="sos呼叫时间" prop="sosTime">
            <el-input v-model="form.sosTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="紧急联系号码">
            <el-input v-model="form.sosContact" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员截止日期">
            <el-input v-model="form.serviceEndTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员剩余天数">
            <el-input v-model="form.lastDays" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间" v-if="false">
            <el-input v-model="form.createTime" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('memberName')" prop="memberName" label="会员名称" />
        <el-table-column v-if="false" prop="memberId" label="会员id" />
        <el-table-column v-if="columns.visible('memberPhone')" prop="memberPhone" label="会员手机号" />
        <el-table-column v-if="columns.visible('sosTime')" prop="sosTime" label="sos呼叫时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.sosTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('sosContact')" prop="sosContact" width="300px" label="紧急联系号码" />
        <el-table-column v-if="columns.visible('serviceEndTime')" prop="serviceEndTime" label="会员截止日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.serviceEndTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('lastDays')" prop="lastDays" label="会员剩余天数" />
        <el-table-column v-if="false" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','sVipSosRecord:edit','sVipSosRecord:del']" label="操作" width="150px" align="center">
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
import crudSVipSosRecord from '@/api/sVipSosRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";

// crud交由presenter持有
const defaultCrud = CRUD({ title: '会员服务管理-SOS记录', url: 'api/sVipSosRecord', sort: 'id,desc', crudMethod: { ...crudSVipSosRecord }})
const defaultForm = { id: null, memberName: null, memberId: null, memberPhone: null, sosTime: null, sosContact: null, serviceEndTime: null, lastDays: null, createTime: null }
export default {
  name: 'SVipSosRecord',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'sVipSosRecord:add'],
        edit: ['admin', 'sVipSosRecord:edit'],
        del: ['admin', 'sVipSosRecord:del']
      },
      rules: {
        memberId: [
          { required: true, message: '会员id不能为空', trigger: 'blur' }
        ],
        memberPhone: [
          { required: true, message: '会员手机号不能为空', trigger: 'blur' }
        ],
        sosTime: [
          { required: true, message: 'sos呼叫时间不能为空', trigger: 'blur' }
        ]
      }    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
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
