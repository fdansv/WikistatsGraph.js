const d3 =  require('d3-selection');
const d3_format =  require('d3-format');
const d3_time_format =  require('d3-time-format');
const d3_scale =  require('d3-scale');
const d3_array =  require('d3-array');
const WikistatsAPIClient = require('./WikistatsAPIClient');
const APIsConfig = require('./apisConfig');

const GraphDefaults = require('./graphDefaults');

class WikistatsGraph {
  constructor (metricConfig, graphConfig, data) {
    this.metricConfig = metricConfig;
    this.graphConfig = GraphDefaults.merge(graphConfig);
    if (data) {
      this.render(this.metricConfig, this.graphConfig, data);
    } else {
      const wikistatsClient = new WikistatsAPIClient(APIsConfig);
      return wikistatsClient.getData(this.metricConfig).then((data) => {
        this.render(this.metricConfig, this.graphConfig, data)
        return this
      });
    }
  }
  
  render (metricConfig, graphConfig, data) {
    this.data = data;
    this.width = graphConfig.width;
    this.height = graphConfig.height;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    this.context = this.canvas.getContext('2d');
    this.clearGraph();
    this.context.font = graphConfig.fontSize + 'px sans-serif';
    this.context.textBaseline = 'middle';
    this.y = this.getY();
    this.x = this.getX();
    graphConfig.addYAxis && this.renderYAxis();
    graphConfig.addXAxis && this.renderXAxis();
    this.renderForGraphType(graphConfig.graphType);
    this.canvasGraph = this.canvas;
  }
  
  getY () {
    const availableHeightForGraph = this.getAvailableGraphHeight();
    const y = d3_scale.scaleLinear()
      .rangeRound([availableHeightForGraph, 0])
    y.domain([0, d3_array.max(this.data.items, d => d.views)])
    return y;
  }
  
  getX () {
    const rows = this.data.items;
    const availableHeightForGraph = this.getAvailableGraphHeight();
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
    const rows = this.data.items;
    const x = this.x;
    const y = this.y
    this.context.strokeStyle = this.graphConfig.color;
    this.context.beginPath();
    this.context.moveTo(x(createDate(rows[0].timestamp)) + x.bandwidth() / 2, y(rows[0].views));
    rows.slice(1).forEach(item => {
      this.context.lineTo(x(createDate(item.timestamp)) + x.bandwidth() / 2, y(item.views))
    });
    this.context.stroke();
  }
  
  renderBars () {
    const availableHeightForGraph = this.getAvailableGraphHeight();
    const x = this.x;
    const y = this.y;
    this.context.fillStyle = this.graphConfig.color;
    this.data.items.forEach(item => {
      this.context.beginPath();
      this.context.rect(x(createDate(item.timestamp)), y(item.views), x.bandwidth(), availableHeightForGraph - y(item.views));
      this.context.fill();
    });
  }
  
  renderYAxis () {
    const availableHeightForGraph = this.getAvailableGraphHeight();
    const y = this.y;
    const numberOfTicks = availableHeightForGraph / this.graphConfig.fontSize / 2;
    const ticks = this.y.ticks(numberOfTicks);
    const tickGuideWidth = 2;
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
    const x = this.x;
    this.context.textAlign = "center";
    const xTicks = x.domain();
    const spaceBetweenBarCenters = x(xTicks[1]) - x(xTicks[0]);
    const formatNumber = d3_time_format.timeFormat("%B %Y");
    const padding = 3;
    let availableBackSpace = x.bandwidth() / 2 - padding;
    xTicks.forEach((d, i) => {
      const currentDateToPrint = formatNumber(d);
      const currentWordWidth = this.context.measureText(currentDateToPrint).width;
      const backSpaceToUse = currentWordWidth / 2;
      const currentWordFits = backSpaceToUse < availableBackSpace;
      if (currentWordFits) {
        this.context.beginPath();
        this.context.moveTo(x(d) + x.bandwidth() / 2, this.getAvailableGraphHeight());
        this.context.lineTo(x(d) + x.bandwidth() / 2, this.getAvailableGraphHeight() + 3);
        this.context.stroke();
        const xAxisBottomPadding = this.graphConfig.fontSize / 2;
        this.context.fillText(currentDateToPrint, x(d) + x.bandwidth() / 2, this.height - xAxisBottomPadding);
        availableBackSpace = spaceBetweenBarCenters - currentWordWidth / 2 - padding;
      } else {
        availableBackSpace += spaceBetweenBarCenters;
      }
    });
  }
  
  getAvailableGraphHeight () {
    if (!this.graphConfig.addXAxis) return this.height;
    const xAxisBottomPadding = this.graphConfig.fontSize / 2;
    const xAxisHeight = this.graphConfig.fontSize + xAxisBottomPadding
    return this.height - xAxisHeight;
  }
  getAvailableGraphWidth () {
    if (!this.graphConfig.addYAxis) return this.width;
    const availableHeightForGraph = this.getAvailableGraphHeight();
    const y = this.y;
    const numberOfTicks = availableHeightForGraph / this.graphConfig.fontSize / 2;
    const ticks = y.ticks(numberOfTicks);
    const maxXWordWidth = ticks.reduce((p, c) => Math.max(this.context.measureText(d3_format.format(".2s")(c)).width, p), 0);
    const tickGuideWidth = 2; 
    const yAxisWidth = maxXWordWidth + tickGuideWidth;
    const availableWidthForGraph = this.width - yAxisWidth;
    return availableWidthForGraph;
  }
  getDataFromAPI () {
    return new Promise();
  }
  clearGraph () {
    this.context.clearRect(0, 0, this.width, this.height);
  }
  
  getCanvasGraph () {
    return this.canvas;
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
