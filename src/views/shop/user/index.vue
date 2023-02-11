<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <!--<el-select v-model="userType" clearable placeholder="用户来源" class="filter-item" style="width: 130px">-->
        <!--<el-option-->
          <!--v-for="item in statusOptions"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value"-->
        <!--/>-->
      <!--</el-select>-->
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="add"
      >
        新增
      </el-button>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <pForm ref="formp" :is-add="isAdd" />
    <detail ref="formd" />



    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="uid" v-if="false" label="用户id" />
      <el-table-column prop="realName" label="真实姓名" />
      <el-table-column ref="table" prop="avatar" label="用户头像">
        <template slot-scope="scope">
          <a :href="scope.row.avatar" style="color: #42b983" target="_blank"><img :src="scope.row.avatar" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" />
      <el-table-column prop="imei" label="手环IMEI" />
      <el-table-column prop="nowMoney"v-if="false" label="用户余额" />
      <el-table-column prop="brokeragePrice" v-if="false"label="佣金金额" />
      <el-table-column prop="integral" v-if="false" label="用户积分" />
      <el-table-column  prop="serviceStart" label="服务器开始日期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceStart }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="serviceEnd" label="服务器结束日期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceEnd }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column  prop="createTime" label="创建日期" width="140">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.createTime }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="同步手环信息" align="center">
        <template slot-scope="scope">
          <div @click="syncWatchBindInfo(scope.row)">
            <el-tag v-if="scope.row.watchBind == 1" style="cursor: pointer" :type="''">已同步</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">未同步</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="同步尿酸分析仪信息" align="center">
        <template slot-scope="scope">
          <div @click="syncUricBindInfo(scope.row)">
            <el-tag v-if="scope.row.uricBind == 1" style="cursor: pointer" :type="''">已同步</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">未同步</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div @click="onStatus(scope.row.uid,scope.row.status)">
            <el-tag v-if="scope.row.status == 1" style="cursor: pointer" :type="''">正常</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">禁用</el-tag>
          </div>
        </template>
      </el-table-column>

      <!--<el-table-column label="用户来源" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<div>-->
            <!--<el-tag v-if="scope.row.userType == 'wechat'">公众号</el-tag>-->
            <!--<el-tag v-else-if="scope.row.userType == 'routine'">小程序</el-tag>-->
            <!--<el-tag v-else-if="scope.row.userType == 'pc'">PC</el-tag>-->
            <!--<el-tag v-else>H5</el-tag>-->
          <!--</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="spreadUid" v-if="false" label="推荐人" />
      <el-table-column prop="payCount" v-if="false" label="购买次数" />
      <el-table-column v-if="checkPermission(['admin','YXUSER_ALL','YXUSER_EDIT','YXUSER_DELETE'])" label="操作" width="215" align="center" fixed="right">
        <template slot-scope="scope">
          <!--TODO 暂时注释掉该功能-->
          <!--<el-button-->
            <!--v-permission="['admin','YXUSER_ALL','YXUSER_EDIT']"-->
            <!--size="mini"-->
            <!--type="danger"-->
            <!--@click="editD(scope.row)"-->
          <!--&gt;查看下级</el-button>-->
          <el-dropdown size="mini" split-button type="primary" trigger="click">
            操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','YXUSER_ALL','YXUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="edit(scope.row)"
                >修改用户</el-button>
              </el-dropdown-item>
              <!--<el-dropdown-item>
                <el-button
                  v-permission="['admin','YXUSER_ALL','YXUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="syncWatchBindInfo(scope.row)"
                >同步手环</el-button>
              </el-dropdown-item>-->
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','YXUSER_ALL','YXUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="editP(scope.row)"
                >修改余额</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','YXUSER_ALL','YXUSER_DELETE']"
                  size="mini"
                  type="danger"
                  @click="deleteUser(scope.row.uid)"
                >删除用户</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { del, onStatus,add,syncWatchBindInfo,syncUricBindInfo } from '@/api/yxUser'
import eForm from './form'
import pForm from './formp'
import detail from './detail'
import { formatTime } from '@/utils/index'
export default {
  components: { eForm, pForm, detail },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      userType: '',
      queryTypeOptions: [
        { key: 'realName', display_name: '真实姓名' },
        { key: 'phone', display_name: '手机号码' }
      ],
      statusOptions: [
        { value: 'routine', label: '小程序' },
        { value: 'wechat', label: '公众号' },
        { value: 'pc', label: 'PC' },
        { value: 'H5', label: 'H5' }
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
    checkPermission,
    onStatus(id, status) {
      this.$confirm(`确定进行[${status ? '禁用' : '开启'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          onStatus(id, { status: status }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.init()
              }
            })
          })
        })
        .catch(() => { })
    },
    beforeInit() {
      this.url = 'api/yxUser'
      const sort = 'uid,desc'
      this.params = { page: this.page, size: this.size, sort: sort, userType: this.userType }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(uid) {
      this.delLoading = true
      del(uid).then(res => {
        this.delLoading = false
        this.$refs[uid].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[uid].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        uid: data.uid,
        account: data.account,
        pwd: data.pwd,
        realName: data.realName,
        birthday: data.birthday,
        cardId: data.cardId,
        mark: data.mark,
        partnerId: data.partnerId,
        groupId: data.groupId,
        nickname: data.nickname,
        avatar: data.avatar,
        phone: data.phone,
        addTime: data.addTime,
        addIp: data.addIp,
        lastTime: data.lastTime,
        lastIp: data.lastIp,
        nowMoney: data.nowMoney,
        brokeragePrice: data.brokeragePrice,
        integral: data.integral,
        signNum: data.signNum,
        status: data.status,
        level: data.level,
        spreadUid: data.spreadUid,
        spreadTime: data.spreadTime,
        userType: data.userType,
        isPromoter: data.isPromoter,
        payCount: data.payCount,
        spreadCount: data.spreadCount,
        cleanTime: data.cleanTime,
        addres: data.addres,
        adminid: data.adminid,
        loginType: data.loginType,
        imei:data.imei,
        serviceStart:data.serviceStart,
        serviceEnd:data.serviceEnd,
        validTimeArr: [data.serviceStart,data.serviceEnd],
        sex:data.sex,
        uricSn:data.uricSn,
        sosContact:data.sosContact
      }
      _this.dialog = true
    },
    editP(data) {
      this.isAdd = false
      const _this = this.$refs.formp
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        ptype: 1,
        money: 0
      }
      _this.dialog = true
    },
    editD(data) {
      const _this = this.$refs.formd
      _this.form = {
        uid: data.uid,
        nickname: data.nickname
      }
      _this.dialog = true
      _this.spread(data.uid)
    },
    deleteUser (uid) {
      this.$confirm('确定删除此项？')
        .then(_ => {

          del(uid).then(res => {
            //console.error(res)
            // this.$notify({
            //   title: '删除成功',
            //   type: 'success',
            //   duration: 2500
            // });
            this.delSuccessNotify()
            this.toQuery()
          }).catch(err => {
            console.log(err.response.data.message)
          })


        })
        .catch(_ => {})
    },
    syncWatchBindInfo (row) {
      var data = {};
      data['uid'] = row.uid
      data['imei'] = row.imei
      data['sosContact'] = row.sosContact

      syncWatchBindInfo(data).then(res => {
        this.$notify({
          title: '同步成功',
          type: 'success',
          duration: 2500
        })
        this.toQuery()
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    syncUricBindInfo (row) {
      var data = {};
      data['uid'] = row.uid
      data['uricSn'] = row.uricSn


      syncUricBindInfo(data).then(res => {
        this.$notify({
          title: '同步成功',
          type: 'success',
          duration: 2500
        })
        this.toQuery()
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
