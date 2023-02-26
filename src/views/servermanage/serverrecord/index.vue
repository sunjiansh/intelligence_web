<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <el-input v-model="query.memberName" clearable placeholder="VIP人员名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
      <el-input v-model="query.serverPerson" clearable placeholder="客服人员" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
      <!--<el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">-->
        <!--<el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
      <!--</el-select>-->
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>

      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <el-form-item label="id" v-if="false">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="VIP人员id" prop="memberId" v-if="false">
            <el-input v-model="form.memberId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="VIP人员名称" prop="memberName" @click.native="toggleUserListDialog">
            <el-input v-model="form.memberName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="问题类型" prop="questionType" >
            <el-select v-model="form.questionType" filterable placeholder="请选择"  style="width: 370px;" >
              <el-option
                v-for="item in dict.service_question_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <!--<el-form-item label="服务开始时间">-->
            <!--<el-input v-model="form.serverStartTime" style="width: 370px;" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="服务结束时间">-->
            <!--<el-input v-model="form.serverEndTime" style="width: 370px;" />-->
          <!--</el-form-item>-->

          <el-form-item label="服务开始时间" prop="serverStartTime">
            <template>
              <el-date-picker
                style="width: 370px;"
                v-model="form.serverStartTime"
                type="datetime"
                placeholder="选择日期时间"
                @change="changeStartTime"
              />
            </template>
          </el-form-item>

          <el-form-item label="服务结束时间" prop="serverEndTime">
            <template>
              <el-date-picker
                style="width: 370px;"
                v-model="form.serverEndTime"
                type="datetime"
                placeholder="选择日期时间"
                @change="changeEndTime"
              />
            </template>
          </el-form-item>

          <el-form-item label="创建时间" v-if="false">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="客服人员" prop="serverPerson">
            <el-input v-model="form.serverPerson" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="处理记录">
            <el-input :rows="5" v-model="form.handleRecord" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>


        <el-dialog :visible.sync="userlistdialog" v-if="userlistdialog" height="400px" append-to-body>
          会员用户列表
          <userlist ref="userform" @tt="inputMmemberInfo"></userlist>
        </el-dialog>


      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="false" prop="id" label="id" />
        <el-table-column v-if="false" prop="memberId" label="VIP人员id" />
        <el-table-column  prop="memberName" label="VIP人员名称" />
        <el-table-column  prop="serverPerson" label="客服人员" />
        <el-table-column  prop="questionType" label="问题类型">
          <template slot-scope="scope">
            {{ dict.label.service_question_type[scope.row.questionType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('serverStartTime')" prop="serverStartTime" label="服务开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.serverStartTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('serverEndTime')" prop="serverEndTime" label="服务结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.serverEndTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('handleRecord')" prop="handleRecord" label="处理记录" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','sVipServiceRevord:edit','sVipServiceRevord:del']" label="操作" width="150px" align="center">
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
import crudSVipServiceRevord from '@/api/sVipServiceRevord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";
import Userlist from './userlist'

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'VIP服务记录', url: 'api/sVipServiceRevord', sort: 'id,desc', crudMethod: { ...crudSVipServiceRevord }})
const defaultForm = { id: null, serverPerson: null, questionType: null, handleRecord: null, serverStartTime: null, serverEndTime: null, createTime: null, memberId: null, memberName: null }
export default {
  name: 'SVipServiceRevord',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList,Userlist},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['service_question_type'],
  data() {
    return {
      userlistdialog:false,
      permission: {
        add: ['admin', 'sVipServiceRevord:add'],
        edit: ['admin', 'sVipServiceRevord:edit'],
        del: ['admin', 'sVipServiceRevord:del']
      },
      queryTypeOptions: [
        { key: 'memberName', display_name: 'VIP人员名称' },
        { key: 'serverPerson', display_name: '客服人员' }
      ],
      rules: {
        serverPerson: [
          { required: true, message: '客服人员不能为空', trigger: 'blur' }
        ],
        memberId: [
          { required: true, message: 'VIP人员id不能为空', trigger: 'blur' }
        ],
        memberName: [
          { required: true, message: 'VIP人员名称不能为空', trigger: 'blur' }
        ],
        questionType: [
          { required: true, message: '问题类型不能为空', trigger: 'blur' }
        ],
        serverStartTime: [
          { required: true, message: '服务开始时间不能为空', trigger: 'blur' }
        ],
        serverEndTime: [
          { required: true, message: '服务结束时间不能为空', trigger: 'blur' }
        ]

      }
    }
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
    //选择日期后触发change方法，将开始和结束时间转为时间戳进行对比，不符合约束条件就清空该日期重新选择
    changeStartTime(val) {
      let date = new Date(val).getTime();
      this.startTime = date;
      if (this.endTime) {
        if (this.endTime < this.startTime) {
          this.$message.error("开始时间不能大于结束时间");
          this.form.serverStartTime = "";
          this.startTime = null;
        }
      }
    },
    changeEndTime(val) {
      let date = new Date(val).getTime();
      this.endTime = date;
      if (this.startTime) {
        if (this.endTime < this.startTime) {
          this.$message.error("结束时间不能小开始时间");
          this.form.serverEndTime = "";
          this.endTime = null;
        }
      }
    },
    inputMmemberInfo(data){
      this.form.memberId = data.uid
      this.form.memberName =data.realName
      this.userlistdialog = !this.userlistdialog
    },
    toggleUserListDialog(){
      this.userlistdialog = !this.userlistdialog
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
