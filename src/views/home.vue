<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <!--<yshop-info />-->
      <panel-group />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PanelGroup from "./dashboard/PanelGroup";
import PanelGroupT from "./dashboard/PanelGroupT";
import PieChart from "./dashboard/BarChartT";
import BarChart from "./dashboard/BarChart";
import { count } from "@/api/visits";
import YshopInfo from "./dashboard/YshopInfo";
import OrderCount from "./dashboard/OrderCount";

/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */
count().then((res) => {});

export default {
  name: "Dashboard",
  components: {
    PanelGroup,
    PanelGroupT,
    PieChart,
    BarChart,
    YshopInfo,
    OrderCount,
  },
  computed: {
    ...mapGetters(["roles"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 18px 22px 22px 22px;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.acea-row {
  ::v-deep.el-avatar--small {
    width: 22px;
    height: 22px;
    line-height: 22px;
  }
}
.checkTime {
  ::v-deep.el-radio__input {
    display: none;
  }
}
.ivu-pl-8 {
  margin-left: 8px;
  font-size: 14px;
}
.divBox {
  // padding: 0 20px !important;
}
.dashboard-console-visit {
  ::v-deep.el-card__header {
    padding: 14px 20px !important;
  }
  ul {
    li {
      list-style-type: none;
      margin-top: 12px;
    }
  }
}
.ivu-mb {
  margin-bottom: 10px;
}
</style>
