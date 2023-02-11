<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="550px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="用户昵称" v-if="false">
        <el-input v-model="form.nickname" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="form.realName" style="width: 370px;" />
      </el-form-item>
      <!--<el-form-item label="密码" v-if = "this.isAdd" >-->
        <!--<el-input v-model="form.password"   style="width: 370px;" />-->
      <!--</el-form-item>-->

      <el-form-item label="生日">
        <el-date-picker style="width: 370px;"
          v-model="form.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="性别" >
        <el-radio  v-model="form.sex" :label="1">男</el-radio>
        <el-radio  v-model="form.sex" :label="0">女</el-radio>
        <el-radio  v-model="form.sex" :label="2">未知</el-radio>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" style="width: 370px;" :disabled="!this.isAdd"/>
      </el-form-item>
      <el-form-item label="手环IMEI" prop="imei">
        <el-input v-model="form.imei" style="width: 370px;"  @click.native="toggleImeiDialog"/>
      </el-form-item>
      <el-form-item label="尿酸分析仪SN" prop="uricSn">
        <el-input v-model="form.uricSn" style="width: 370px;"  @click.native="toggleUricSnDialog"/>
      </el-form-item>


      <el-form-item label="服务时间" prop="">
        <el-date-picker
          @change="getTimeT"
          style="width: 370px;"
          v-model="form.validTimeArr"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="SOS联系人电话" >
        <el-input v-model="form.sosContact" placeholder="多个手机号用英文输入法“,”隔开" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="用户备注">
        <el-input v-model="form.mark" style="width: 370px;" />
      </el-form-item>




      <el-form-item v-if="false" label="用户积分">
        <el-input v-model="form.integral" style="width: 370px;" />
      </el-form-item>
      <!--TODO 暂时注释掉该功能-->
      <!--<el-form-item label="商户管理">-->
        <!--<el-radio v-model="form.adminid" disabled="true" :label="1">开启</el-radio>-->
        <!--<el-radio v-model="form.adminid" disabled="true" :label="0">关闭</el-radio>-->
      <!--</el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>


    <el-dialog :visible.sync="watchlistdialog" v-if="watchlistdialog" height="400px" append-to-body>
      智能手环列表
      <watchlist ref="watchform" @tt="inputImei"></watchlist>
    </el-dialog>

    <el-dialog :visible.sync="uriclistdialog" v-if="uriclistdialog" height="400px" append-to-body>
      尿酸分析仪列表
      <uriclist ref="watchform" @tt="inputUricSn"></uriclist>
    </el-dialog>


  </el-dialog>





</template>

<script>
  import Watchlist from './watchlist'
  import Uriclist from './uriclist'
import { add, edit } from '@/api/yxUser'
export default {
  components: { Watchlist,Uriclist },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      watchlistdialog:false,
      uriclistdialog:false,
      form: {
        uid: '',
        account: '',
        pwd: '',
        realName: '',
        birthday: '',
        cardId: '',
        mark: '',
        partnerId: '',
        groupId: '',
        nickname: '',
        avatar: '',
        phone: '',
        addTime: '',
        addIp: '',
        lastTime: '',
        lastIp: '',
        nowMoney: '',
        brokeragePrice: '',
        integral: '',
        signNum: '',
        status: '',
        level: '',
        spreadUid: '',
        spreadTime: '',
        userType: '',
        isPromoter: 0,
        payCount: '',
        spreadCount: '',
        cleanTime: '',
        addres: '',
        adminid: 0,
        loginType: '',
        imei:'',
        serviceStart:'',
        serviceEnd:'',
        validTimeArr: [],
        sex:null,
        uricSn:''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {min: 11, max: 11, message: '长度必须为11位', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {

      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()

        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        uid: '',
        account: '',
        pwd: '',
        realName: '',
        birthday: '',
        cardId: '',
        mark: '',
        partnerId: '',
        groupId: '',
        nickname: '',
        avatar: '',
        phone: '',
        addTime: '',
        addIp: '',
        lastTime: '',
        lastIp: '',
        nowMoney: '',
        brokeragePrice: '',
        integral: '',
        signNum: '',
        status: '',
        level: '',
        spreadUid: '',
        spreadTime: '',
        userType: '',
        isPromoter: '',
        payCount: '',
        spreadCount: '',
        cleanTime: '',
        addres: '',
        adminid: '',
        loginType: '',
        imei:'',
        serviceStart:'',
        serviceEnd:'',
        validTimeArr: [],
        sex:null,
        uricSn:''
      }
    },
    getTimeT(t) {
      this.form.serviceStart = t[0]
      this.form.serviceEnd = t[1]
      //this.form.validTime = parseTime(t[0],'{y}-{m}-{d}') + ' - ' + parseTime(t[1],'{y}-{m}-{d}')
    },
    toggleImeiDialog(){
      this.watchlistdialog = !this.watchlistdialog

    },
    toggleUricSnDialog(){
      this.uriclistdialog = !this.uriclistdialog
    },
    inputImei(imei){
      this.form.imei = imei
      this.watchlistdialog = !this.watchlistdialog
    },
    inputUricSn(uricSn){
      this.form.uricSn = uricSn
      this.uriclistdialog = !this.uriclistdialog
    },

  }
}
</script>

<style scoped>

</style>
