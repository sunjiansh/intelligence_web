<template>
  <div class="app-container">
    <el-date-picker v-model="dayObj" type="date" placeholder="选择日" @change="searchByDay" value-format="yyyy-MM-dd"></el-date-picker>
    <div id="bloodPreasureChart" style="width: 100%;height: 300px">无血压数据</div>
    <div id="heartRateChart" style="width: 100%;height: 300px" >无心率数据</div>
    <div id="bloodSugarChart" style="width: 100%;height: 300px" >无血糖数据</div>
    <div id="uricAcidChart" style="width: 100%;height: 300px" >无尿酸数据</div>
    <div id="fallDownChart" style="width: 100%;height: 300px" >无跌倒数据</div>
    <div id="oxygenChart" style="width: 100%;height: 300px" >无血血氧据</div>
    <div id="sleepChart" style="width: 100%;height: 300px" >无睡眠数据</div>
    <div id="pulseRateChart" style="width: 100%;height: 300px" >无脉搏数据</div>
    <div id="weightChart" style="width: 100%;height: 300px" >无体重数据</div>
    <div id="ecgChart" style="width: 100%;height: 300px" >无心电图数据</div>
  </div>

</template>


<script>
  import * as echarts from 'echarts';
  import crudSVipSosRecord from '@/api/sVipSosRecord'

  export default {
    name: 'Health',
    props:['uid'],
    data() {
      return {
        //uid:null
        //chart: null
        dayObj:new Date()
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initChart(res) {
        this.initBloodPreasureChart(res)
        this.initHeartRateChart(res)
        this.initBloodSugarChart(res)
        this.initUricAcidChart(res)
        this.initFallDownChart(res)
        this.initOxygenChart(res)
        this.initSleepChart(res)
        this.initPulseRateChart(res)
        this.initWeightChart(res)
        this.initEcgChart(res)

      },
      initData(){
        crudSVipSosRecord.getAllHealthData(this.uid,this.dayObj).then(res => {
          //console.error(res);
          this.initChart(res)
        }).catch(err => {
          console.log(err)
        })
      },
      searchByDay(){
          this.initData()
      },
      initBloodPreasureChart(res){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('bloodPreasureChart'));
        let re = res.BLOODPREASURE
        let xArr = []
        let sbpArr = []
        let dbpArr = []
        if(re!=null){
          for(let i=0;i<re.length;i++){
            let data = re[i]
            xArr[i] = data.hourMinutes
            sbpArr[i] = data.sbp
            dbpArr[i] = data.dbp
          }
        }
        let option ={
          legend: {

          },
          grid: {
            right: '5%',
            height:150
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: xArr
          },
          yAxis: {
            type: 'value',
            // axisLabel: {
            //   formatter: '{value} °C'
            // }
          },
          series: [
            {
              name: '收缩压',
              type: 'line',
              //data: [10, 11, 13, 11, 12, 12, 9],
              data: sbpArr,
              markPoint: {
                data: [
                  { type: 'max', name: '最大' },
                ]
              }
            },
            {
              name: '舒张压',
              type: 'line',
              //data: [1, -2, 2, 5, 3, 2, 0],
              data: dbpArr,
              markPoint: {
                data: [
                  { type: 'min', name: '最小' },
                ]
              }
            }
          ]
        };
        // 绘制图表
        myChart.setOption(option);
      },
      initHeartRateChart(res){

        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('heartRateChart'));
        let re = res.HEARTRATE

        let xArr = []
        let yArr = []
        let average = 0
        if(re!=null){
          for(let i=0;i<re.length;i++){
            let data = re[i]
            xArr[i] = data.hourMinutes
            yArr[i] = data.heartRate
            average += data.heartRate
          }
        }

        let x = (average/re.length).toFixed(0);

        let option ={
          title: {
            text: x+"次/分钟（平均）",
            left: '1%'
          },
          grid: {
            right: '5%',
            height:150
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xArr
          },
          yAxis: {
            type: 'value',
            //boundaryGap: [0, '100%']
          },
          series: [
            {
              name: 'Fake Data',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              itemStyle: {
                color: 'rgb(255, 70, 131)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                  }
                ])
              },
              data: yArr
            }
          ]
        };
        // 绘制图表
        myChart.setOption(option);
      },
      initBloodSugarChart(res){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('bloodSugarChart'));
        let re = res.BLOODSUGAR
        let xArr = []
        let bloodSugarArr = []
        let bloodOxygenSaturationArr = []
        let hemoglobinConcentrationArr = []
        let bloodFlowVelocityArr = []
        if(re!=null){
          for(let i=0;i<re.length;i++){
            let data = re[i]
            xArr[i] = data.hourMinutes
            bloodSugarArr[i] = data.bloodSugar
            bloodOxygenSaturationArr[i] = data.bloodOxygenSaturation
            hemoglobinConcentrationArr[i] = data.hemoglobinConcentration
            bloodFlowVelocityArr[i] = data.bloodFlowVelocity
          }
        }
        let labelOption = {
          show: true,
          align: 'left',
          rotate: 90,
          //formatter: '{c}  {name|{a}}',
          fontSize: 16,
          rich: {
            name: {}
          }
        }
        let option = {
          legend: {
            data: ['血糖(mmol/L)', '血氧饱和度(%)', '血红蛋白浓度(g/L)', '血流速度(ml/min)']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: xArr
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '血糖(mmol/L)',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              emphasis: {
                focus: 'series'
              },
              data: bloodSugarArr
            },
            {
              name: '血氧饱和度(%)',
              type: 'bar',
              label: labelOption,
              emphasis: {
                focus: 'series'
              },
              data: bloodOxygenSaturationArr
            },
            {
              name: '血红蛋白浓度(g/L)',
              type: 'bar',
              label: labelOption,
              emphasis: {
                focus: 'series'
              },
              data: hemoglobinConcentrationArr
            },
            {
              name: '血流速度(ml/min)',
              type: 'bar',
              label: labelOption,
              emphasis: {
                focus: 'series'
              },
              data: bloodFlowVelocityArr
            }
          ]
        };

        // 绘制图表
        myChart.setOption(option);
      },
      initUricAcidChart(res){
        let myChart = echarts.init(document.getElementById('uricAcidChart'));
        let re = res.URICACID
        let xArr = []
        let yArr = []
        if(re!=null){
          for(let i=0;i<re.length;i++){
            let data = re[i]
            xArr[i] = data.hourMinutes
            yArr[i] = data.uricAcid
          }
        }
        let option ={
          legend: {

          },
          grid: {
            right: '5%',
            height:150
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: xArr
          },
          yAxis: {
            type: 'value',
            // axisLabel: {
            //   formatter: '{value} °C'
            // }
          },
          series: [
            {
              name: '尿酸（单位：μmol/L）',
              type: 'bar',
              //data: [10, 11, 13, 11, 12, 12, 9],
              data: yArr,
              markPoint: {
                data: [
                  { type: 'max', name: '最大' },
                ]
              }
            }
          ]
        };

        // 绘制图表
        myChart.setOption(option);
      },
      initFallDownChart(res){
        let myChart = echarts.init(document.getElementById('fallDownChart'));
        let re = res.FALLDOWN




        // 绘制图表
        //myChart.setOption(option);
      },
      initOxygenChart(res){
        let myChart = echarts.init(document.getElementById('oxygenChart'));
        let re = res.OXYGEN
        let xArr = []
        let yArr = []
        let average = 0;
        if(re!=null){
          for(let i=0;i<re.length;i++){
            let data = re[i]
            xArr[i] = data.hourMinutes
            yArr[i] = data.oxygen
            average += data.oxygen
          }
        }
        let x = (average/re.length).toFixed(0);

        let option =	{
          title: {
            text: x+"%(平均)",
            left: '1%'
          },
          grid: {
            right: '10%',
            height:150
          },
          xAxis: {
            data: xArr
          },
          yAxis: {
            min:70,
            max:100,
          },
          visualMap: {
            top: 0,
            right: 10,
            pieces: [
              {
                gt: 0,
                lte: 95,
                color: '#FBDB0F'
              },
              {
                gt: 95,
                lte: 100,
                color: '#93CE07'
              }
            ],
            outOfRange: {
              color: '#999'
            }
          },
          series: {
            name: '血氧',
            type: 'line',
            data: yArr,
            markLine: {
              silent: true,
              lineStyle: {
                color: '#333'
              },
              data: [
                {
                  yAxis: 80
                },
                {
                  yAxis: 90
                },
                {
                  yAxis: 95
                },
                {
                  yAxis: 100
                }
              ]
            }
          }
        };

        // 绘制图表
        myChart.setOption(option);
      },
      renderItem(params, api) {
        var categoryIndex = api.value(0);
        var start = api.coord([api.value(1), categoryIndex]);
        var end = api.coord([api.value(2), categoryIndex]);
        var height = api.size([0, 1])[1] * 0.8;
        //var height = 30
        var rectShape = echarts.graphic.clipRectByRect(
          {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          }
        );
        return (
          rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style()
          }
        );
      },
      initSleepChart(res){
        let myChart = echarts.init(document.getElementById('sleepChart'));

        var data = [];

        let sleepRecord =  res.SLEEPRECORD;

        let re = "";
        if(sleepRecord != null){
          re = sleepRecord.sleepLine
        }

        //let re  = '9220000122009999992000002000220000011000000000000020002200111000000000000000000000000000000000000200000022222';
        var resCount = re.length;
        var startTime = 0;
        var categories = ['深睡眠', '浅睡眠','清醒' ];
        var types = [
          { name: '深睡眠', color: '#5233CC' },
          { name: '浅睡眠', color: '#C01D7F' },
          { name: '清醒', color: '#CECE0F' },
        ];

        categories.forEach(function (category, index) {
          var baseTime = startTime;
          for (var i = 0; i < resCount; i++) {
            var duration = 1;
            var endTime = baseTime + duration;
            var v = re.charAt(i)
            if(index == 0 && v == 1){//深睡眠
              data.push({
                value: [index, baseTime, endTime, duration],
                itemStyle: {
                  normal: {
                    color: types[0].color
                  }
                }
              })
            }else if(index == 1 && v == 0){//浅睡眠
              data.push({
                value: [index, baseTime, endTime, duration],
                itemStyle: {
                  normal: {
                    color: types[1].color
                  }
                }
              })
            }else if(index == 2 && v == 2){//清醒
              data.push({
                value: [index, baseTime, endTime, duration],
                itemStyle: {
                  normal: {
                    color: types[2].color
                  }
                }
              })
            }else{
              data.push({
                value: [index, baseTime, endTime, duration],
                itemStyle: {
                  normal: {
                    color: 'transparent'
                  }
                }
              })
            }
            baseTime = endTime;
          }
        });
        let option = {
          tooltip: {},
          title: {
            text: '',
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal'
            }
          },
          grid: {
            height: 150,
            right: '5%',
            left: '15%',
          },
          xAxis: {
            //  min: 0,
            //scale: true,
            splitLine: {
              show: false // 显示网格线
            },
            axisLabel: {
              formatter: function (val) {
                return "";
                //return val * 5 + '分钟';
              }
            }
          },
          yAxis: {
            data: categories,
            splitLine: {
              show: true, // 显示网格线
              lineStyle: {
                type: 'dashed' // 网格线设置为虚线
              },
            },
            axisTick: {
              show: false // 取消刻度
            },
            // axisLine: {
            // 	lineStyle: {
            // 	  color: '#fff' // 坐标轴颜色
            // 	}
            // },
          },
          series: [
            {
              type: 'custom',
              renderItem: this.renderItem,
              itemStyle: {
                opacity: 0.8
              },
              encode: {
                x: [1, 2],
                y: 0
              },
              data: data
            }
          ]
        };

        // 绘制图表
        myChart.setOption(option);
      },
      initPulseRateChart(res){
        let myChart = echarts.init(document.getElementById('pulseRateChart'));
        let re = res.PULSERATE

        let xArr = []
        let yArr = []
        if(re!=null){
          for(let i=0;i<re.length;i++){
            let data = re[i]
            xArr[i] = data.hourMinutes
            yArr[i] = data.pulseRate
          }
        }
        let option ={
          legend: {

          },
          grid: {
            right: '5%',
            height:150
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: xArr
          },
          yAxis: {
            type: 'value',
            // axisLabel: {
            //   formatter: '{value} °C'
            // }
          },
          series: [
            {
              name: '脉搏',
              type: 'line',
              //data: [10, 11, 13, 11, 12, 12, 9],
              data: yArr,
              markPoint: {
                data: [
                  { type: 'max', name: '最大' },
                ]
              }
            }
          ]
        };
        // 绘制图表
        myChart.setOption(option);
      },
      initWeightChart(res){
        let myChart = echarts.init(document.getElementById('weightChart'));
        let re = res.WEIGHT

        let xArr = []
        let bodyWeightArr = []
        let bodyBmiArr = []

        if(re!=null){
          for(let i=0;i<re.length;i++){
            let data = re[i]
            xArr[i] = data.hourMinutes
            bodyWeightArr[i] = data.bodyWeight
            bodyBmiArr[i] = data.bodyBmi
          }
        }

        let labelOption = {
          show: true,
          align: 'left',
          rotate: 90,
          //formatter: '{c}  {name|{a}}',
          fontSize: 16,
          rich: {
            name: {}
          }
        }

        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['体重(kg)', 'BMI(kg/m^2)']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: xArr
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '体重(kg)',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              emphasis: {
                focus: 'series'
              },
              data: bodyWeightArr
            },
            {
              name: 'BMI(kg/m^2)',
              type: 'bar',
              label: labelOption,
              emphasis: {
                focus: 'series'
              },
              data: bodyBmiArr
            }
          ]
        };

        // 绘制图表
        myChart.setOption(option);
      },
      initEcgChart(res){




      }






    },



  }
</script>
