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
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" v-if="false">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="型号">
            <el-input v-model="form.model" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="序列号" prop="sn">
            <el-input v-model="form.sn" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="form.brand" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input :rows="3" v-model="form.mark" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否激活">
            <el-radio v-for="item in dict.is_active" :key="item.id" v-model="form.isActive" :label="item.value">{{ item.label }}</el-radio>
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
        <el-table-column v-if="columns.visible('name')" prop="name" label="名称" />
        <el-table-column v-if="columns.visible('model')" prop="model" label="型号" />
        <el-table-column v-if="columns.visible('sn')" prop="sn" label="序列号" />
        <el-table-column v-if="columns.visible('brand')" prop="brand" label="品牌" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('isActive')" prop="isActive" label="是否激活">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isActive == 1" :type="'success'"> {{ dict.label.is_active[scope.row.isActive] }}</el-tag>
              <el-tag v-else :type="'danger'">  {{ dict.label.is_active[scope.row.isActive] }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('mark')" prop="mark" label="备注" />
        <el-table-column v-permission="['admin','dEcg:edit','dEcg:del']" label="操作" width="150px" align="center">
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
import crudDEcg from '@/api/dEcg'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";

// crud交由presenter持有
const defaultCrud = CRUD({ title: '心电图检测仪', url: 'api/dEcg', sort: 'id,desc', crudMethod: { ...crudDEcg }})
const defaultForm = { id: null, name: null, model: null, sn: null, brand: null, mark: null, createTime: null, isActive: null }
export default {
  name: 'DEcg',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['is_active'],
  data() {
    return {

      permission: {
        add: ['admin', 'dEcg:add'],
        edit: ['admin', 'dEcg:edit'],
        del: ['admin', 'dEcg:del']
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        sn: [
          { required: true, message: '序列号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'model', display_name: '型号' },
        { key: 'sn', display_name: '序列号' },
        { key: 'brand', display_name: '品牌' }
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
        delete this.crud.params.name
        delete this.crud.params.model
        delete this.crud.params.sn
        delete this.crud.params.brand
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
