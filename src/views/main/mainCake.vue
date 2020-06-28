<template>
  <div class="commandCake" :id="id"></div>
</template>

<script>
import G2 from "@antv/g2";
import { mapGetters } from "vuex";

export default {
  name: "cake",
  data() {
    return {
      data: []
    };
  },
  props: {
    width: {
      type: Number,
      default() {
        return 0;
      }
    },
    height: {
      type: Number,
      default() {
        return 0;
      }
    },
    id: {
      type: String,
      default() {
        return "";
      }
    },
    dataList:{
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters(["fontSize"])
  },
  mounted() {

    let max = 0;
    let total=0
    this.dataList.forEach(function(obj) {
      if (obj.totalNum > max) {
        max = obj.totalNum;
      }
      total+=obj.totalNum
    });
    // 自定义 other 的图形，增加两条线
    G2.Shape.registerShape("interval", "sliceShape", {
      draw(cfg, container) {
        const points = cfg.points;
        const origin = cfg.origin._origin;
        const percent = origin.totalNum / max;
        const xWidth = points[2].x - points[1].x;
        const width = xWidth * percent;
        let path = [];
        path.push(["M", points[0].x+0.3, points[0].y]);
        path.push(["L", points[1].x+0.3, points[1].y]);
        path.push(["L", points[0].x+0.3 + width, points[2].y]);
        path.push(["L", points[0].x+0.3 + width, points[3].y]);
        path.push("Z");
        path = this.parsePath(path);
        return container.addShape("path", {
          attrs: {
            fill: cfg.color,
            path
          }
        });
      }
    });

    const chart = new G2.Chart({
      container: this.id,
      autoFit: true,
      padding: [20,200,20,100],
      height: this.height
    });

    chart.source(this.dataList);
    chart.coord("theta", {
      radius: 0.8
    });
    chart.legend({
      position: "right-center",
      offsetX:  70,
      textStyle: {
        fill: "#333333",
        fontSize:  16,
        fontWeight: 300
      }
    });
    chart
      .intervalStack()
      .position("totalNum")
      .color("code", ["#10BF79", "#0A9EBF", "#065ABF", "#BD2B4A", "#BCBF33",'#9340FF'])
      .shape("sliceShape")
      .label("totalNum", {
        textStyle: {
          fill: "#333333",
          fontSize:  16,
          fontWeight: 300
        },
        offset:  40,
        formatter: (val, item) => {
          return  parseInt((val/total)*100) + "%";
        }
      });

    chart.render();
  },
  methods: {}
};
</script>

<style lang="less">
.commandCake {
  >div{
    display: flex;
    justify-content: center;
  }
}
</style>
