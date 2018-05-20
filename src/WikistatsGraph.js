const d3 =  require('d3-selection');
const d3_format =  require('d3-format');
const d3_time_format =  require('d3-time-format');
const d3_scale =  require('d3-scale');
const d3_array =  require('d3-array');
const WikistatsAPIClient = require('./WikistatsAPIClient');
const APIsConfig = require('./apisConfig');

const GraphDefaults = require('./graphDefaults');
const CanvasRenderer = require('./renderer/canvas');

class WikistatsGraph {
  constructor (metricConfig, graphConfig, data) {
    this.metricConfig = metricConfig;
    this.graphConfig = GraphDefaults.merge(graphConfig);
    if (data) {
      this.render(this.metricConfig, this.graphConfig, data);
    } else {
      const allMetrics = this.getWikistatsMetrics();
      const wikistatsClient = new WikistatsAPIClient(APIsConfig);
      return wikistatsClient.getData(this.metricConfig).then((data) => {
        this.render(this.metricConfig, this.graphConfig, data);
        return this;
      });
    }
  }
  
  render (metricConfig, graphConfig, data) {
    this.data = data;
    this.width = graphConfig.width;
    this.height = graphConfig.height;
    this.renderer = new CanvasRenderer(this.width, this.height);
    this.canvas = this.renderer.getElement();
    this.context = this.renderer.context;
    this.renderer.setFontSize(graphConfig.fontSize);
    this.y = this.getY();
    this.x = this.getX();
    graphConfig.addYAxis && this.renderYAxis();
    graphConfig.addXAxis && this.renderXAxis();
    this.renderForGraphType(graphConfig.graphType);
    this.graph = this.renderer.getElement();
  }
  
  getY () {
    const availableHeightForGraph = this.renderer.getAvailableGraphHeight(this.graphConfig.addXAxis, this.graphConfig.fontSize);
    const y = d3_scale.scaleLinear()
      .rangeRound([availableHeightForGraph, 0])
    y.domain([0, d3_array.max(this.data.items, d => d.views)])
    return y;
  }
  
  getX () {
    const rows = this.data.items;
    const availableHeightForGraph = this.renderer.getAvailableGraphHeight(this.graphConfig.addXAxis, this.graphConfig.fontSize);
    const yAxisWidth = this.width - this.getAvailableGraphWidth();
    const x = d3_scale.scaleBand()
      .rangeRound([yAxisWidth, this.width])
      .padding(0.1)
      .align(0);
    x.domain(rows.map(row => createDate(row.timestamp)));
    return x;
  }

  renderForGraphType (graphType) {
    if (graphType === 'bar') {
      this.renderBars();
    } else if (graphType === 'line') {
      this.renderLines();
    }
  }

  renderLines () {
    this.renderer.paintLine(this.x, this.y, this.data.items, this.graphConfig.color);
  }

  renderBars () {
    this.renderer.paintBars(this.x, this.y, this.data.items, this.graphConfig.color);
  }

  renderYAxis () {
    const y = this.y;
    const availableHeightForGraph = y.range()[0];
    const numberOfTicks = availableHeightForGraph / this.graphConfig.fontSize / 2;
    const ticks = this.y.ticks(numberOfTicks);
    const tickGuideWidth = 2;
    this.context.textBaseline = 'middle';
    this.context.textAlign = "right";
    const yAxisWidth = this.width - this.getAvailableGraphWidth();
    ticks.forEach(tick => {
      this.context.beginPath()
      this.context.moveTo(yAxisWidth - tickGuideWidth, y(tick));
      this.context.lineTo(yAxisWidth, y(tick));
      this.context.stroke();
      this.context.fillStyle = "black";
      this.context.fillText(d3_format.format(".2s")(tick), yAxisWidth - tickGuideWidth, y(tick));
    });
  }
  
  renderXAxis () {
    this.renderer.renderXAxis(this.x, this.y, this.graphConfig.fontSize);
  }

  getAvailableGraphWidth () {
    if (!this.graphConfig.addYAxis) return this.width;
    const yAxisWidth = this.renderer.getYAxisWidth(this.y, this.graphConfig.fontSize, this.graphConfig.addXAxis);
    const availableWidthForGraph = this.width - yAxisWidth;
    return availableWidthForGraph;
  }
  
  getCanvasGraph () {
    return this.canvas;
  }

  getWikistatsMetrics () {
    return APIsConfig;
  }
}

function createDate(timestamp) {
    let date;
    if (timestamp.length <= 10) {
        date = new Date(timestamp.slice(0,4) + '-'
                        + timestamp.slice(4,6) + '-'
                        + timestamp.slice(6,8));
    } else {
       date =  new Date(timestamp);
    }

    // returns a timestamp, not a date object
     date = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
     date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    let tmp = new Date();
    // SetTime takes an integer represented
    // by a number of milliseconds since January 1, 1970, 00:00:00 UTC.
    // when you print this date to see its true UTC value you need to use .toUTCString
    tmp.setTime(date);
    return tmp;
}

module.exports = WikistatsGraph;
