<template>
  <el-container>
    <!-- 嵌套容器 -->
    <el-container>
      <!-- 侧边导航菜单 -->
      <el-aside width="60%">
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
                <el-form-item label="名称">
                  <el-input v-model="form.name" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="imei" prop="imei">
                  <el-input v-model="form.imei" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="型号">
                  <el-input v-model="form.model" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="序列号">
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
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" highlight-current-row  style="width: 100%;" @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange" >
              <el-table-column type="selection" width="55" />
              <el-table-column v-if="false" prop="id" label="id" />
              <el-table-column v-if="columns.visible('name')" prop="name" label="名称" />
              <el-table-column v-if="columns.visible('imei')" prop="imei" label="imei" />
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
              <el-table-column v-permission="['admin','dMailunit:edit','dMailunit:del']" label="操作" width="150px" align="center">
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
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <!-- 第一列栅格布局 -->
        <el-row>、
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="addUser" >绑定用户</el-button>
          <el-col :span="24" class="col1">
            <el-table ref="table"  :data="userdata" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column v-if="false" prop="id" label="id" />
              <el-table-column v-if="columns.visible('uid')" prop="uid" label="用户ID" />
              <el-table-column v-if="columns.visible('mid')" prop="mid" label="主机ID" />
              <el-table-column v-permission="['admin','dMdeviceUser:edit','dMdeviceUser:del']" label="操作" width="150px" align="center">
                <template slot-scope="scope">
                  <el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 第二列布局 -->
        <el-row>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="addDevice" >绑定设备</el-button>
          <el-col :span="24" class="col3">
            <!--<el-table ref="table"  :data="this.devicedata" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">-->
              <!--<el-table-column type="selection" width="55" />-->
              <!--<el-table-column v-if="false" prop="id" label="id" />-->
              <!--<el-table-column v-if="columns.visible('mid')" prop="mid" label="主机ID" />-->
              <!--<el-table-column v-if="columns.visible('did')" prop="did" label="其他设备ID" />-->
              <!--<el-table-column v-if="columns.visible('dtype')" prop="dtype" label="设备类型" />-->
              <!--<el-table-column v-permission="['admin','dMdeviceDevice:edit','dMdeviceDevice:del']" label="操作" width="150px" align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteDeviceById(scope.row)"/>-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</el-table>-->

            <el-tabs v-model="status" type="card" @tab-click="handleDeviceData">
              <!--智能手环不放在这里绑定-->
              <!--<el-tab-pane name="0" >-->
                <!--<span slot="label"><i class="el-icon"></i>智能手环</span>-->
                <!--<el-table ref="table"  :data="this.devicedata" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">-->
                <!--<el-table-column type="selection" width="55" />-->
                <!--<el-table-column v-if="false" prop="id" label="id" />-->
                <!--<el-table-column v-if="columns.visible('mid')" prop="mid" label="主机ID" />-->
                <!--<el-table-column v-if="columns.visible('did')" prop="did" label="其他设备ID" />-->
                <!--<el-table-column v-if="columns.visible('dtype')" prop="dtype" label="设备类型" />-->
                <!--<el-table-column v-permission="['admin','dMdeviceDevice:edit','dMdeviceDevice:del']" label="操作" width="150px" align="center">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteDeviceById(scope.row)"/>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--</el-table>-->
              <!--</el-tab-pane>-->
              <el-tab-pane name="0">
                <span slot="label"><i class="el-icon"></i>无创血糖仪</span>
                <el-table ref="table"  :data="this.devicedata" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                  <el-table-column type="selection" width="55" />
                  <el-table-column v-if="false" prop="id" label="id" />
                  <el-table-column v-if="columns.visible('mid')" prop="mid" label="主机ID" />
                  <el-table-column v-if="columns.visible('did')" prop="did" label="其他设备ID" />
                  <el-table-column v-if="columns.visible('dtype')" prop="dtype" label="设备类型" />
                  <el-table-column v-permission="['admin','dMdeviceDevice:edit','dMdeviceDevice:del']" label="操作" width="150px" align="center">
                    <template slot-scope="scope">
                      <el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteDeviceById(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane name="1">
                <span slot="label"><i class="el-icon"></i>跌倒报警器</span>
                <el-table ref="table"  :data="this.devicedata" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                  <el-table-column type="selection" width="55" />
                  <el-table-column v-if="false" prop="id" label="id" />
                  <el-table-column v-if="columns.visible('mid')" prop="mid" label="主机ID" />
                  <el-table-column v-if="columns.visible('did')" prop="did" label="其他设备ID" />
                  <el-table-column v-if="columns.visible('dtype')" prop="dtype" label="设备类型" />
                  <el-table-column v-permission="['admin','dMdeviceDevice:edit','dMdeviceDevice:del']" label="操作" width="150px" align="center">
                    <template slot-scope="scope">
                      <el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteDeviceById(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane name="2">
                <span slot="label"><i class="el-icon"></i>体脂秤</span>
                <el-table ref="table"  :data="this.devicedata" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                  <el-table-column type="selection" width="55" />
                  <el-table-column v-if="false" prop="id" label="id" />
                  <el-table-column v-if="columns.visible('mid')" prop="mid" label="主机ID" />
                  <el-table-column v-if="columns.visible('did')" prop="did" label="其他设备ID" />
                  <el-table-column v-if="columns.visible('dtype')" prop="dtype" label="设备类型" />
                  <el-table-column v-permission="['admin','dMdeviceDevice:edit','dMdeviceDevice:del']" label="操作" width="150px" align="center">
                    <template slot-scope="scope">
                      <el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteDeviceById(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <!--<el-tab-pane name="3">-->
                <!--<span slot="label" ><i class="el-icon"></i>尿酸分析仪</span>-->
                <!--<el-table ref="table"  :data="this.devicedata" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">-->
                  <!--<el-table-column type="selection" width="55" />-->
                  <!--<el-table-column v-if="false" prop="id" label="id" />-->
                  <!--<el-table-column v-if="columns.visible('mid')" prop="mid" label="主机ID" />-->
                  <!--<el-table-column v-if="columns.visible('did')" prop="did" label="其他设备ID" />-->
                  <!--<el-table-column v-if="columns.visible('dtype')" prop="dtype" label="设备类型" />-->
                  <!--<el-table-column v-permission="['admin','dMdeviceDevice:edit','dMdeviceDevice:del']" label="操作" width="150px" align="center">-->
                    <!--<template slot-scope="scope">-->
                      <!--<el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteDeviceById(scope.row)"/>-->
                    <!--</template>-->
                  <!--</el-table-column>-->
                <!--</el-table>-->
              <!--</el-tab-pane>-->
              <el-tab-pane name="4">
                <span slot="label"><i class="el-icon"></i>心电图检测仪</span>
                <el-table ref="table"  :data="this.devicedata" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                  <el-table-column type="selection" width="55" />
                  <el-table-column v-if="false" prop="id" label="id" />
                  <el-table-column v-if="columns.visible('mid')" prop="mid" label="主机ID" />
                  <el-table-column v-if="columns.visible('did')" prop="did" label="其他设备ID" />
                  <el-table-column v-if="columns.visible('dtype')" prop="dtype" label="设备类型" />
                  <el-table-column v-permission="['admin','dMdeviceDevice:edit','dMdeviceDevice:del']" label="操作" width="150px" align="center">
                    <template slot-scope="scope">
                      <el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteDeviceById(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>

          </el-col>
        </el-row>
      </el-main>


      <el-dialog :visible.sync="userlistdialog" height="400px">
        用户列表
        <userlist ref="userform" a="xxx" :selmid.sync="selmid" @tt="saveUser"></userlist>
      </el-dialog>

      <!--<el-dialog :visible.sync="watchlistdialog" height="400px" >-->
        <!--智能手环列表-->
        <!--<watchlist ref="watchform" :selmid.sync="selmid" @tt="saveDevice"></watchlist>-->
      <!--</el-dialog>-->

      <el-dialog :visible.sync="bloodlistdialog" height="400px" >
        无创血糖仪列表
        <bloodlist ref="bloodform" :selmid.sync="selmid" @tt="saveDevice"></bloodlist>
      </el-dialog>

      <el-dialog :visible.sync="tumblelistdialog" height="400px" >
        跌倒报警器列表
        <tumblelist ref="tumbleform" :selmid.sync="selmid" @tt="saveDevice"></tumblelist>
      </el-dialog>

      <el-dialog :visible.sync="balancelistdialog" height="400px" >
        体脂秤列表
        <balancelist ref="balanceform" :selmid.sync="selmid" @tt="saveDevice"></balancelist>
      </el-dialog>

      <el-dialog :visible.sync="uriclistdialog" height="400px" >
        尿酸分析仪列表
        <uriclist ref="uricform" :selmid.sync="selmid" @tt="saveDevice"></uriclist>
      </el-dialog>

      <el-dialog :visible.sync="ecglistdialog" height="400px" >
        心电图检测仪列表
        <ecglist ref="ecgform" :selmid.sync="selmid" @tt="saveDevice"></ecglist>
      </el-dialog>

    </el-container>
  </el-container>


</template>

<script>
import crudDMailunit from '@/api/dMailunit'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material"

import {queryDeviceByMidAndDeviceType,addDevice,editDevice,delDevice} from '@/api/dMdeviceDevice'
import {queryUserByMid, addUser, editUser, delUser } from '@/api/dMdeviceUser'
import Userlist from './userlist'
import Watchlist from './watchlist'
import Bloodlist from './bloodlist'
import Balancelist from './balancelist'
import Ecglist from './ecglist'
import Tumblelist from './tumblelist'
import Uriclist from './uriclist'



// crud交由presenter持有
const defaultCrud = CRUD({ title: '主机设备', url: 'api/dMailunit', sort: 'id,desc', crudMethod: { ...crudDMailunit }})
const defaultForm = { id: null, name: null, imei: null, model: null, sn: null, brand: null, mark: null, createTime: null, isActive: null }
export default {
  name: 'DMailunit',
  components: { Userlist, pagination, crudOperation, rrOperation, udOperation ,MaterialList,Watchlist,Bloodlist,Balancelist,Ecglist,Tumblelist,Uriclist},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['is_active'],
  data() {
    return {
      selmid:null,
      deviceType:'0',
      userlistdialog:false,
      watchlistdialog:false,
      bloodlistdialog:false,
      balancelistdialog:false,
      tumblelistdialog:false,
      ecglistdialog:false,
      uriclistdialog:false,
      permission: {
        add: ['admin', 'dMailunit:add'],
        edit: ['admin', 'dMailunit:edit'],
        del: ['admin', 'dMailunit:del']
      },
      devicepermission:{
        addDevice: ['admin', 'dMdeviceDevice:add'],
        editDevice: ['admin', 'dMdeviceDevice:edit'],
        delDevice: ['admin', 'dMdeviceDevice:del']
      },
      rules: {
        imei: [
          { required: true, message: 'imei不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'imei', display_name: 'imei' },
        { key: 'model', display_name: '型号' },
        { key: 'sn', display_name: '序列号' },
        { key: 'brand', display_name: '品牌' }
      ],
      devicedata:[
        //{"id":1,"mid":1,"did":11,"dtype":"A"},{"id":2,"mid":1,"did":23,"dtype":"A"}
      ],
      userdata:[
        //{"id":1,"mid":1,"uid":11},{"id":2,"mid":1,"uid":23}
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
        delete this.crud.params.imei
        delete this.crud.params.model
        delete this.crud.params.sn
        delete this.crud.params.brand
      }
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    queryDeviceByMid(mid){

      if(!!!this.selmid){
        this.$notify({
          title: '请先选中左侧一条主机设备信息，再进行绑定设备查询',
          type: 'warning',
          duration: 2500
        });
        return;
      }

      if(!!!this.deviceType){
        this.$notify({
          title: '请先选择一种设备类型',
          type: 'warning',
          duration: 2500
        });
        return;
      }
      //先将上次查询的结果集清空
      this.devicedata = []
      queryDeviceByMidAndDeviceType(mid,this.deviceType).then(res => {
        //console.error(res);
        this.devicedata = res;
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    queryUserByMid(mid){
      queryUserByMid(mid).then(res => {
        //console.error(res);
        this.userdata = res;
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    handleDeviceData(tab, event) {
      this.deviceType = tab.name
      this.queryDeviceByMid(this.selmid)
    },
    handleCurrentChange (val) {
      var mid = val.id
      this.selmid = mid
      this.queryDeviceByMid(mid)
      this.queryUserByMid(mid)
    },
    deleteUserById(row) {
      var id = row.id;
      var mid = row.mid;
      this.$confirm('确定删除此项？')
        .then((_) => {
          delUser([id]).then(res => {
            this.queryUserByMid(mid)
          });
        })
        .catch((_) => {})
    },
    deleteDeviceById(row) {
      // this.delDevice(ids).then(res => {
      //    this.$notify({
      //      title: '删除成功',
      //      type: 'success',
      //      duration: 2500
      //    });
      // });
      var id = row.id;
      var mid = row.mid;
      this.$confirm('确定删除此项？')
        .then((_) => {
          //delDevice([id])
          delDevice([id]).then(res => {
            this.queryDeviceByMid(mid)
          });
        })
        .catch((_) => {})
    },
    addUser(){
        if(!!!this.selmid){
          this.$notify({
             title: '请先选中左侧一条主机设备信息，再进行人员信息绑定',
             type: 'warning',
             duration: 2500
           });
          return;
        }
        this.userlistdialog = !this.userlistdialog
    },
    saveUser(uid){
      //alert(uid)
     // alert(this.selmid)
      var data = {};
      data['uid'] = uid
      data['mid'] = this.selmid

      addUser(data).then(res => {
        //console.error(res);
        this.$notify({
          title: '用户绑定成功',
          type: 'success',
          duration: 2500
        });
        this.queryUserByMid(this.selmid)
      }).catch(err => {
        console.log(err)
      })
    },
    addDevice(){
      if(!!!this.selmid){
        this.$notify({
          title: '请先选中左侧一条主机设备信息，再进行智能手环信息绑定',
          type: 'warning',
          duration: 2500
        });
        return;
      }

      if(!!!this.deviceType){
        this.$notify({
          title: '请先选择一种设备类型',
          type: 'warning',
          duration: 2500
        });
        return;
      }

      switch(this.deviceType){
        // case '0':
        //   //智能手环
        //   this.watchlistdialog = !this.watchlistdialog
        //   break
        case '0':
          //无创血糖仪
          this.bloodlistdialog = !this.bloodlistdialog
          break
        case '1':
          //跌倒报警器
          this.tumblelistdialog = !this.tumblelistdialog
          break
        case '2':
          //体脂秤
          this.balancelistdialog = !this.balancelistdialog
          break
        case '3':
          //尿酸分析仪
          this.uriclistdialog = !this.uriclistdialog
          break
        case '4':
          //心电图分析仪
          this.ecglistdialog = !this.ecglistdialog
          break
      }



    },
    saveDevice(id){
      //alert(id)
      //alert(this.deviceType)

      var data = {};
      data['did'] = id
      data['mid'] = this.selmid
      data['dtype'] = this.deviceType

      addDevice(data).then(res => {
        //console.error(res);
        this.$notify({
          title: '设备绑定成功',
          type: 'success',
          duration: 2500
        });
        this.queryDeviceByMid(this.selmid)
      }).catch(err => {
        console.log(err)
      })

    }



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




  .el-aside {
    #background-color: chartreuse;
    height: 100%;
  }
  .el-main {
    #background-color: darkkhaki;
  }
  .el-col {
    height: 400px;
  }
  .col1 {
   #background-color: teal;
  }

  .col3 {
    #background-color: thistle;
  }

</style>
