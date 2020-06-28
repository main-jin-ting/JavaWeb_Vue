<template>
  <div class="main-pc-index" style="position: relative">
    <div class="main-left">
      <div>
        <div class="box-card">
          <div class="clearfix">
            <div>
              <img src="@/assets/img/main/tip-1.png"/>
              <div>任务管理</div>
            </div>
            <div></div>
          </div>
          <div class="main-left-box">
            <div>
              <img src="../../assets/img/main/top-1.png">
              <div>
                <div>任务总数</div>
                <div>{{taskInfo.totalNum}}</div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <div></div>
                  <div>执行中</div>
                </div>
                <div>{{taskInfo.executionNum}}</div>
              </div>
              <div>
                <div>
                  <div style=" background:  #FF5003"></div>
                  <div>待执行</div>
                </div>
                <div>{{taskInfo.executionWaitNum}}</div>
              </div>
              <div>
                <div>
                  <div style=" background:  #D8D8D8"></div>
                  <div>已完成</div>
                </div>
                <div>{{taskInfo.funishedNum}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-card">
          <div slot="header" class="clearfix">
            <div>
              <img src="@/assets/img/main/tip-2.png"/>
              <div>问题管理</div>
            </div>
            <div></div>
          </div>
          <div class="main-left-box">
            <div>
              <img src="../../assets/img/main/top-2.png"/>
              <div>
                <div>问题总数</div>
                <div>{{questionInfo.totalNum}}</div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <div></div>
                  <div>处理中</div>
                </div>
                <div>{{questionInfo.processNum}}</div>
              </div>
              <div>
                <div>
                  <div style=" background:  #FF5003"></div>
                  <div>待处理</div>
                </div>
                <div>{{questionInfo.waitNum}}</div>
              </div>
              <div>
                <div>
                  <div style=" background:  #D8D8D8"></div>
                  <div>已完成</div>
                </div>
                <div>{{questionInfo.funishedNum}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 30px">
        <div style="padding-bottom: 20px" class="box-card">
          <div slot="header" class="clearfix">
            <div>
              <img src="@/assets/img/main/tip-3.png"/>
              <div>环境水质调查</div>
            </div>
            <div></div>
          </div>
          <div :key="index" v-for="(item,index) in inspectQuestionCategoryList" class="left-bottom">
            <div :title="item.questionContent">
              <div>{{item.questionContent}}</div>
              <div>{{item.questionNum}}</div>
            </div>
            <el-progress
              :show-text="false"
              :stroke-width="12"
              :color="index==0?'#025EFE':(index==1?'#22CEA9':(index==2?'#FF4E7A':(index==3?'#6958E3':(index==4?'#FCD876':'#17B4AC'))))"
              :percentage="getQuestionPer(item)"
            ></el-progress>
          </div>
        </div>
        <div class="box-card">
          <div slot="header" class="clearfix">
            <div>
              <img src="@/assets/img/main/tip-4.png"/>
              <div>水质参数分类统计</div>
            </div>
            <div></div>
          </div>
          <mainCake
            v-if="waterAlarmCategoryList.length>0"
            :dataList="waterAlarmCategoryList"
            id="mainPre"
            :height="300"
          ></mainCake>
        </div>
      </div>
    </div>
    <div class="main-right">
      <div style="padding-bottom: 30px" class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <img src="@/assets/img/main/tip-5.png"/>
            <div>疫情预警</div>
          </div>
          <el-button @click="waterAlarmOpen"
                     style="float: right; padding: 3px 0" type="text">...
          </el-button>
        </div>
        <div class="right-waterAlarm">
          <div
            @click="waterAlarmClick(item.id)"
            :key="index"
            v-for="(item,index) in waterAlarmList"
          >
            <img
              :src="item.measuredStandard==5?require('../../assets/img/main/red.png'):(item.measuredStandard==4?require('../../assets/img/main/orange.png'):require('../../assets/img/main/yellow.png'))"
            />
            <div :title="item.alarmInfo">{{item.alarmInfo}}</div>
            <div>
              <span v-if="item.alarmTime">{{item.alarmTime.split(' ')[0]}}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 30px;padding-bottom: 30px" class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <img src="@/assets/img/main/tip-6.png"/>
            <div>世卫预警</div>
          </div>
          <el-button @click="waterWarnOpen"
                     style="float: right; padding: 3px 0" type="text">...
          </el-button>
        </div>
        <div class="right-waterWarn">
          <div :key="index" v-for="(item,index) in waterWarnList">
            <div>
              <div>{{item.driverName}}</div>
              <div>{{item.warnTime}}</div>
            </div>
            <div>
              <div>{{item.warnContent}}</div>
              <div
                :class="item.warnLevel==5?'red-div':(item.warnLevel==4?'orange-div':'yellow-div')"
              >{{item.warnLevel | filterlevel}}级
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 30px;padding-bottom: 40px" class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <img src="@/assets/img/main/tip-7.png"/>
            <div>通知公告</div>
          </div>
          <el-button @click="noticeOpen"
                     style="float: right; padding: 3px 0" type="text">...
          </el-button>
        </div>
        <el-tabs style="padding: 0 30px" v-model="noticeType" @tab-click="noticeTypeClick">
          <el-tab-pane label="今日快讯" :name="1">
            <div class="notice-list">
              <div
                @click="noticeClick(item.id)"
                :key="index"
                v-for="(item,index) in noticeList"
                class="notice-child"
              >
                <div>{{item.title}}</div>
                <div>{{item.createTime}}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="国际时事" :name="2">
            <div v-if="noticeType==2" class="notice-list">
              <div
                @click="noticeClick(item.id)"
                :key="index"
                v-for="(item,index) in noticeList"
                class="notice-child"
              >
                <div>{{item.title}}</div>
                <div>{{item.createTime}}</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- <waterAlarmInfo
      :id="waterAlarmId"
      @handleClose="waterAlarmVisible=false"
      v-if="waterAlarmVisible"
      :visible="waterAlarmVisible"
    ></waterAlarmInfo>
    <noticeDetial
      :noticeId="noticeId"
      :visible="noticeVisible"
      v-if="noticeVisible"
      @handleClose="noticeVisible=false"
    ></noticeDetial> -->
  </div>
</template>

<script>
  import mainApi from "@/api/main/index";
  import mainCake from "./mainCake";
  // import waterAlarmInfo from "../water/waterAlarm/infoForm";
  // import noticeDetial from "@/components/noticeDetail";
  import {mapGetters} from "vuex";

  export default {
    name: "main-pc-index",
    data() {
      return {
        noticeVisible: false,
        noticeId: "",
        waterAlarmVisible: false,
        waterAlarmId: "",
        height: document.body.clientHeight - 125,
        taskInfo: {},
        questionInfo: {},
        waterAlarmCategoryList: [],
        waterAlarmList: [],
        waterWarnList: [],
        noticeType: 1,
        noticeList: []
      };
    },
    created() {
      // console.log(this.roles)
    },
    mounted() {
      this.getDetail();
      this.getNoticeMainList();
    },
    computed: {
      // ...mapGetters(["roles"])
    },
    components: {mainCake},
    methods: {
      noticeClick(id) {
        this.noticeId = id;
        this.noticeVisible = true;
      },
      noticeTypeClick() {
        this.noticeList = [];
        this.getNoticeMainList();
      },
      noticeOpen() {
        this.$router.push({path: "/work/notice"});
      },
      waterWarnOpen() {
        this.$router.push({path: "/water/warn"});
      },
      waterAlarmOpen() {
        this.$router.push({path: "/water/waterAlarm"});
      },
      waterAlarmClick(id) {
        this.waterAlarmId = id;
        this.waterAlarmVisible = true;
      },
      getQuestionPer(item) {
        let total = 0;
        this.inspectQuestionCategoryList.map(item => {
          total += item.questionNum;
        });
        return (item.questionNum / total) * 100;
      },
      getNoticeMainList() {
        // mainApi
        //   .getNoticeMainList(this.noticeType)
        //   .then(res => {
        //     this.noticeList = res.data ? res.data : [];
        //   })
        //   .catch(e => {
        //     this.noticeList = [];
        //   });
        this.noticeList = [{"id":24,"status":2,"createUser":1,"createTime":"2020-06-17 17:56:43","updateUser":1,"updateTime":"2020-06-17 18:23:48","mark":1,"title":"华为10亿英镑项目刚落地，美国“关切”就到了，美媒：前后不到24小时","type":1,"content":"<p>22</p>","attachment":"file/file/2020617/c9152efd315540e899a296bbd9864cea.zip","viewNum":0},{"id":21,"status":2,"createUser":23,"createTime":"2020-06-17 17:50:55","updateUser":23,"updateTime":"2020-06-17 17:50:55","mark":1,"title":"特朗普“找到”全球病毒传染源，并疯狂吹捧自己","type":1,"content":"<p>11</p>","attachment":null,"viewNum":0},{"id":20,"status":2,"createUser":23,"createTime":"2020-06-17 17:38:38","updateUser":23,"updateTime":"2020-06-17 17:38:38","mark":1,"title":"全球新冠确诊病例超1000万！曾光：这既是“天灾”，又是“人祸”","type":1,"content":"<p>暴雨来袭2</p>","attachment":"file/file/2020617/650b80cf17dc42c09cb4a61c4c506d27.png","viewNum":0},{"id":19,"status":2,"createUser":23,"createTime":"2020-06-17 17:36:14","updateUser":23,"updateTime":"2020-06-17 17:36:14","mark":1,"title":"北京昨日新增14例确诊病例，丰台10例大兴4例","type":1,"content":"<p>暴雨来袭</p>","attachment":"file/file/2020617/3a24957819e14c2ebe30ff54038f8dcf.png","viewNum":0}];
      },
      getDetail() {
        const {
              waterWarnList,
              taskInfo,
              questionInfo,
              inspectQuestionCategoryList,
              waterAlarmCategoryList,
              waterAlarmList
            } = {"waterWarnList":[{"id":4,"status":2,"createUser":3,"createTime":"2020-06-09 19:12:45","updateUser":0,"updateTime":null,"mark":1,"inspectDriverId":6,"inspectNo":"KJG2020060006","warnSn":"302006605123","driverArea":320115,"areaName":null,"driverId":250,"driverName":"世卫组织","inspectTime":"2020-06-09","warnType":1,"warnContent":"世卫组织预警：疫情成全球性大流行的威胁“非常真实”","warnLevel":3,"warnTime":"2020-06-09","warnTypeText":null,"warnLevelText":null,"statusText":"已预警"},{"id":3,"status":2,"createUser":3,"createTime":"2020-06-09 19:11:42","updateUser":0,"updateTime":null,"mark":1,"inspectDriverId":7,"inspectNo":"DGP2020060007","warnSn":"302006944960","driverArea":320115,"areaName":null,"driverId":251,"driverName":"国内预警","inspectTime":"2020-06-04","warnType":2,"warnContent":"紧急预警! 疫情还没结束, 中国新一轮“守护战”即将打响","warnLevel":2,"warnTime":"2020-06-09","warnTypeText":null,"warnLevelText":null,"statusText":"已预警"},{"id":2,"status":2,"createUser":3,"createTime":"2020-06-04 01:21:13","updateUser":0,"updateTime":null,"mark":1,"inspectDriverId":2,"inspectNo":"KJG2020060002","warnSn":"302006758404","driverArea":320115,"areaName":null,"driverId":240,"driverName":"省内预警","inspectTime":"2020-06-04","warnType":2,"warnContent":"提升疫情监测预警和应急响应能力 健全重大疫情救治体系","warnLevel":3,"warnTime":"2020-06-06","warnTypeText":null,"warnLevelText":null,"statusText":"已预警"}],"waterAlarmCategoryList":[{"code":"DO","totalNum":3},{"code":"NH3-N","totalNum":3},{"code":"COD","totalNum":3},{"code":"TUB","totalNum":3},{"code":"TP","totalNum":3},{"code":"TN","totalNum":2}],"taskInfo":{"totalNum":17,"executionWaitNum":1,"funishedNum":6,"executionNum":2},"questionInfo":{"totalNum":22,"waitNum":5,"funishedNum":13,"processNum":4},"waterAlarmList":[{"id":3,"status":4,"createUser":3,"createTime":"2020-06-09 22:25:23","updateUser":3,"updateTime":"2020-06-10 01:29:14","mark":1,"inspectDriverId":7,"alarmSn":"202006642611","driverArea":320115,"driverId":251,"driverName":"《美国》","inspectTime":"2020-06-04","alarmStandard":"Ⅱ类","measuredStandard":5,"alarmInfo":"《美国》单日新增确诊病例5W例，目前已处于失控的边缘","alarmTime":"2020-06-10 01:29:14","statusText":"处理中","areaName":null},{"id":2,"status":4,"createUser":3,"createTime":"2020-06-05 21:31:46","updateUser":3,"updateTime":"2020-06-06 00:52:45","mark":1,"inspectDriverId":3,"alarmSn":"202006469886","driverArea":320115,"driverId":237,"driverName":"《巴西》","inspectTime":"2020-06-03","alarmStandard":"Ⅲ类","measuredStandard":5,"alarmInfo":"《巴西》不甘示弱，作为超级大国的邻居，殃及池鱼，单日新增确诊病例4W多，压力山大！","alarmTime":"2020-06-06 00:52:45","statusText":"处理中","areaName":null},{"id":1,"status":4,"createUser":3,"createTime":"2020-06-05 21:31:46","updateUser":3,"updateTime":"2020-06-05 23:39:40","mark":1,"inspectDriverId":4,"alarmSn":"202006311354","driverArea":320115,"driverId":238,"driverName":"印度","inspectTime":"2020-05-30","alarmStandard":"Ⅱ类","measuredStandard":5,"alarmInfo":"《三哥》印度一直想做一个有声有色的大国，处处跟中国比高低，这次没有让自己失望，单日新增3W例","alarmTime":"2020-06-05 23:39:40","statusText":"处理中","areaName":null}],"inspectQuestionCategoryList":[{"questionId":14,"questionContent":"水体出现水质明显突变（感官、颜色）","questionNum":5},{"questionId":16,"questionContent":"水面有明显污染","questionNum":3},{"questionId":6,"questionContent":"河道新增违规阻水物","questionNum":3},{"questionId":9,"questionContent":"岸坡有大面积垃圾","questionNum":2},{"questionId":1,"questionContent":"大面积垃圾、漂浮物","questionNum":2}]};//res.data;
            this.taskInfo = taskInfo ? taskInfo : {};
            this.questionInfo = questionInfo ? questionInfo : {};
            this.inspectQuestionCategoryList = inspectQuestionCategoryList
              ? inspectQuestionCategoryList
              : [];
            this.waterAlarmCategoryList = waterAlarmCategoryList
              ? waterAlarmCategoryList
              : [];
            this.waterAlarmList = waterAlarmList ? waterAlarmList : [];
            this.waterWarnList = waterWarnList ? waterWarnList : [];
      }
    }
  };
</script>

<style lang="less">
  .main-pc-index {
    width: 100%;
    padding: 10px;
    background-color: #ffffff;
    min-height: 100%;
    display: flex;

    .box-card {
      background: #FFFFFF;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.10);
      border-radius: 15px 15px 15px 15px;

      .clearfix {
        padding: 17px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > div:first-child {
          display: flex;
          align-items: center;

          img {
            width: 20px;
            height: 20px;
          }

          > div {
            margin-left: 20px;
            font-family: PingFangSC-Medium;
            font-size: 20px;
            color: #333333;
            font-weight: bold;
          }
        }
      }
    }

    .main-left {
      width: 69%;
      margin-right: 1%;


      > div:first-child, > div:nth-child(2) {
        display: flex;
        justify-content: space-between;

        > div {
          width: 49%;
        }
      }

      .main-left-box {
        > div:first-child {
          height: 225px;
          display: flex;
          align-items: center;
          justify-content: center;

          > img {
            width: 162px;
            height: 165px;
          }

          > div {
            margin-left: 50px;

            > div:first-child {
              font-family: PingFangSC-Regular;
              font-size: 20px;
              color: #333333;
              line-height: 28px;
            }

            > div:last-child {
              margin-top: 4.8px;
              font-family: PingFangSC-Medium;
              font-size: 46px;
              color: #333333;
              line-height: 65px;
            }
          }
        }

        > div:last-child {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 50px 30px 50px;

          > div {
            color: #333333;
            font-family: PingFangSC-Regular;
            font-size: 16px;

            > div:first-child {
              display: flex;
              align-items: center;

              > div:first-child {
                width: 13px;
                height: 13px;
                background: #005DFE;
                border-radius: 50%;
                margin-right: 10px;
              }
            }

            > div:last-child {
              margin-top: 14px;
              font-family: PingFangSC-Medium;
              font-size: 20px;
              line-height: 28px;
              text-align: center;
            }
          }
        }
      }

      .left-bottom {
        margin-top: 20px;
        padding: 0 30px;

        > div:first-child {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #333333;
          line-height: 22px;

          > div:first-child {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        > div:nth-child(2) {
          margin-top: 10px;

          .el-progress-bar {
            padding-right: 0rem;
            width: 100%;
            margin-right: -0rem;
          }

          .el-progress-bar__outer {
            background: #eeeeee;
            border-radius: 10px;
          }
        }
      }
    }

    .main-right {
      width: 30%;

      .el-button--text {
        font-weight: bold;
        color: #333333;
        font-size: 24px;
      }

      .notice-list {
        .notice-child {
          width: 100%;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          color: #666666;
          cursor: pointer;

          > div:first-child {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            white-space: nowrap;
          }

          > div:last-child {
            color: #999999;
            flex: none;
            width: 150px;
            text-align: right;
          }
        }
      }

      .right-waterAlarm {
        padding: 0 30px;

        > div {
          cursor: pointer;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;

          > img {
            position: absolute;
            width: 8px;
            height: 8px;
          }

          > div:nth-child(2) {
            padding-left: 18px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            white-space: nowrap;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #666666;
            line-height: 22px;
          }

          > div:last-child {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
            line-height: 20px;
            margin-left: 15px;
            width: 85px;
            flex: none;
          }
        }

        > div:first-child {
          margin-top: 0px;
        }
      }

      .right-waterWarn {
        padding: 0 30px;
        > div {
          margin-top: 10px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;

          > div:first-child {
            display: flex;
            justify-content: space-between;
            align-items: center;

            > div:first-child {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              line-height: 14px;
              font-weight: 600;
              color: #333333;
            }

            > div:last-child {
              color: #999999;
              line-height: 14px;
            }
          }

          > div:last-child {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            color: #666666;

            > div:first-child {
              line-height: 14px;
            }

            > div:last-child {
              color: #ffffff;
              border-radius: 10px;
              height: 14px;
              width: 37px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
            }

            .red-div {
              background: #ff0000;
            }

            .orange-div {
              background: #f5a623;
            }

            .yellow-div {
              background: #f5d823;
            }
          }
        }

        > div:first-child {
          margin-top: 0px;
        }
      }
    }
  }
</style>
