<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--表单组件-->
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" v-if="false">
            <el-input v-model="form.id" style="width: 370px;" />
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
          <el-form-item label="标签">
            <el-input v-model="form.label" style="width: 370px;" />
          </el-form-item>

          <el-form-item label="是否发布" prop="status">
            <el-select v-model="form.status" placeholder="请选择" style="width: 370px;">
              <el-option value="0" label="否"/>
              <el-option value="1" label="是"/>
            </el-select>
          </el-form-item>

          <el-form-item label="创建时间" v-if="false">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <!--<el-form-item label="是否发布0 否 1 是" prop="status" v-if="false">-->
            <!--<el-input v-model="form.status" style="width: 370px;" />-->
          <!--</el-form-item>-->


          <el-form-item label="正文" prop="content">
            <ueditor-wrap v-model="form.content" :config="myConfig"  @beforeInit="addCustomDialog"  style="width: 90%;"></ueditor-wrap>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" class="submission" @click="handleSubmit('form')">保存</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import {add,edit,getInfo} from '@/api/sArticle'
import MaterialList from "@/components/material";
import UeditorWrap from 'vue-ueditor-wrap';

// crud交由presenter持有

export default {
  name: 'SArticle',
  components: { MaterialList,UeditorWrap},
  dicts: ['article_type', 'article_status'],
  data() {
    return {
      dialog: null,
      form: {
        id: null,
        label: '',
        title:'',
        type: null,
        content: '',
        status: ''
      },
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
          { required: true, message: '是否发布不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  mounted () {
    if(this.$route.params.id){
      this.getInfo();
    }
  },
  methods: {
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
    // 提交
    handleSubmit (name) {
        if(!this.form.id){
          this.addInfo(name)
        }else{
          this.updateInfo(name)
        }
    },
    addInfo(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          add(this.form).then(async res => {
            this.$message({
              message:'新增成功',
              type: 'success'
            });
            setTimeout(() => {
              this.$router.push({ path: '/articlemanage/article' });
            }, 500);
          }).catch(res => {
            // this.$message({
            //   message:res.message,
            //   type: 'error'
            // });
          })
        } else {
          if(!this.form.title){
            this.$message.warning("请填写完整信息！");
          }
        }
      })
    },
    updateInfo(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          edit(this.form).then(async res => {
            this.$message({
              message:'修改成功',
              type: 'success'
            });
            setTimeout(() => {
              this.$router.push({ path: '/articlemanage/article' });
            }, 500);
          }).catch(res => {
            // this.$message({
            //   message:res.message,
            //   type: 'error'
            // });
          })
        } else {
          if(!this.form.title){
            this.$message.warning("请填写完整信息！");
          }
        }
      })
    },

    // 详情
    getInfo () {
      let that = this;
      let id = that.$route.params.id || 0;
      getInfo(id).then(async res => {
        this.form = res
        //console.error(res)
      }).catch(res => {
        console.log('err:'+res)
        return this.$message({
          message:res.msg,
          type: 'error'
        });
      })
    },
    cancel() {
      this.resetForm()
    }

  }
}



</script>

<style scoped>

</style>
