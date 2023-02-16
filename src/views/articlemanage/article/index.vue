<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="true">
        <!-- 搜索 -->
        <el-input v-model="query.label" clearable placeholder="标签" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.title" clearable placeholder="文章标题" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="文章类型" class="filter-item" style="width: 170px">
            <el-option
              v-for="item in dict.article_type"
              :key="item.id"
              :label="item.label"
              :value="item.value" />
        </el-select>
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--<crudOperation :permission="permission" />-->

      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="toAddURL">新增</el-button>

      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="80%">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" v-if="false">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="form.label" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="文章类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择" style="width: 370px;">
              <el-option
                v-for="item in dict.article_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" v-if="false">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否发布" prop="status" v-if="false">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>


          <el-form-item label="正文" prop="content">
            <ueditor-wrap v-model="form.content" :config="myConfig"  @beforeInit="addCustomDialog"  style="width: 90%;"></ueditor-wrap>
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
        <el-table-column v-if="columns.visible('label')" prop="label" label="标签" />
        <el-table-column v-if="columns.visible('title')" prop="title" label="文章标题" />
        <el-table-column v-if="columns.visible('type')" prop="type" label="文章类型">
          <template slot-scope="scope">
            {{ dict.label.article_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column v-if="false" prop="content" label="正文" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.article_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','sArticle:edit','sArticle:del']" label="操作"width="265px" align="center">
          <template slot-scope="scope">
            <!--<udOperation-->
              <!--:data="scope.row"-->
              <!--:permission="permission"-->
            <!--/>-->

            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="toUpdateURL(scope.row.id)"
            >
              编辑
            </el-button>
            <el-popover
              :ref="scope.row.id"
              placement="top"
              width="180"
            >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-popover>

          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSArticle from '@/api/sArticle'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";
import UeditorWrap from 'vue-ueditor-wrap';

// crud交由presenter持有
const defaultCrud = CRUD({ title: '文章管理', url: 'api/sArticle', sort: 'id,desc', crudMethod: { ...crudSArticle }})
const defaultForm = { id: null, label: null, title: null, type: null, content: null, createTime: null, status: null }
export default {
  name: 'SArticle',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList,UeditorWrap},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['article_type', 'article_status'],
  data() {
    return {
      dialog:null,
      delLoading: false,
      myConfig: {
        autoHeightEnabled: false, // 编辑器不自动被内容撑高
        initialFrameHeight: 500, // 初始容器高度
        initialFrameWidth: '100%', // 初始容器宽度
        UEDITOR_HOME_URL: '/UEditor/',
        serverUrl: ''
      },
      permission: {
        add: ['admin', 'sArticle:add'],
        edit: ['admin', 'sArticle:edit'],
        del: ['admin', 'sArticle:del']
      },
      rules: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '文章类型不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '正文不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '是否发布0 否 1 是不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'title', display_name: '文章标题' },
        { key: 'type', display_name: '文章类型' },
        { key: 'status', display_name: '是否发布' }
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
        delete this.crud.params.title
        delete this.crud.params.type
        delete this.crud.params.status
      }
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    toAddURL(){
      this.$router.push({ path: '/articlemanage/articleAdd' })
    },
    toUpdateURL(id){
      this.$router.push({ path: '/articlemanage/articleEdit/'+id })
    },
    addCustomDialog () {
      window.UE.registerUI('yshop', function (editor, uiName) {
        let dialog = new window.UE.ui.Dialog({
          iframeUrl: '/yshop/materia/index',
          editor: editor,
          name: uiName,
          title: '上传图片',
          cssRules: 'width:1200px;height:500px;padding:20px;'
        });
        this.dialog = dialog;

        var btn = new window.UE.ui.Button({
          name: 'dialog-button',
          title: '上传图片',
          cssRules: `background-image: url(../../../assets/images/icons.png);background-position: -726px -77px;`,
          onclick: function () {
            dialog.render();
            dialog.open();
          }
        });

        return btn;
      }, 37);
    },
    subDelete(id) {
      this.delLoading = true
      crudSArticle.del([id]).then(res => {
        this.delLoading = false
       // this.$refs[id].doClose()
       // this.dleChangePage()
       // this.init()
        this.crud.toQuery()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
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
