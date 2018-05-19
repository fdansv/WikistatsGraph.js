module.exports = {
  merge (config) {
    return Object.assign(this.defaults, config);
  },
  defaults: {
    width: 400,
    height: 151,
    color: "#e7231d",
    addXAxis: true,
    addYAxis: true,
    fontSize: 11,
    graphType: "bar"
  }
}