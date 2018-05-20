const d3_format = require('d3-format');
const d3_time_format = require('d3-time-format');

class CanvasRenderer {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
    }
    getElement () {
        return this.canvas;
    }

    clearGraph() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    setFontSize (fontSize) {
        this.context.font = fontSize + 'px sans-serif';
    }

    getAvailableGraphHeight(addXAxis, fontSize) {
        if (!addXAxis) return this.height;
        const xAxisBottomPadding = fontSize / 2;
        const xAxisHeight = fontSize + xAxisBottomPadding
        return this.height - xAxisHeight;
    }

    getYAxisWidth (y, fontSize, addXAxis) {
        const availableHeightForGraph = this.getAvailableGraphHeight(addXAxis, fontSize);
        const numberOfTicks = availableHeightForGraph / fontSize / 2;
        const ticks = y.ticks(numberOfTicks);
        const maxXWordWidth = ticks.reduce((p, c) => Math.max(this.context.measureText(d3_format.format(".2s")(c)).width, p), 0);
        const tickGuideWidth = 2;
        return maxXWordWidth + tickGuideWidth;
    }

    paintLine (x, y, items, color){
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(x(createDate(items[0].timestamp)) + x.bandwidth() / 2, y(items[0].views));
        items.slice(1).forEach(item => {
            this.context.lineTo(x(createDate(item.timestamp)) + x.bandwidth() / 2, y(item.views))
        });
        this.context.stroke();
    }

    paintBars (x, y, items, color) {
        this.context.fillStyle = color;
        const availableHeightForGraph = y.range()[0];
        items.forEach(item => {
            this.context.beginPath();
            this.context.rect(x(createDate(item.timestamp)), y(item.views), x.bandwidth(), availableHeightForGraph - y(item.views));
            this.context.fill();
        });
    }

    renderXAxis (x, y, fontSize) {
        this.context.textBaseline = 'middle';
        this.context.textAlign = "center";
        const padding = 3;
        let availableBackSpace = x.bandwidth() / 2 - padding;
        const xTicks = x.domain();
        const formatNumber = d3_time_format.timeFormat("%B %Y");
        const spaceBetweenBarCenters = x(xTicks[1]) - x(xTicks[0]);
        xTicks.forEach((d, i) => {
            const currentDateToPrint = formatNumber(d);
            const currentWordWidth = this.context.measureText(currentDateToPrint).width;
            const backSpaceToUse = currentWordWidth / 2;
            const currentWordFits = backSpaceToUse < availableBackSpace;
            if (currentWordFits) {
                const availableHeight = y.range()[0];
                this.context.beginPath();
                this.context.moveTo(x(d) + x.bandwidth() / 2, availableHeight);
                this.context.lineTo(x(d) + x.bandwidth() / 2, availableHeight + padding);
                this.context.stroke();
                const xAxisBottomPadding = fontSize / 2;
                this.context.fillText(currentDateToPrint, x(d) + x.bandwidth() / 2, this.height - xAxisBottomPadding);
                availableBackSpace = spaceBetweenBarCenters - currentWordWidth / 2 - padding;
            } else {
                availableBackSpace += spaceBetweenBarCenters;
            }
        })
    }
}

function createDate(timestamp) {
    let date;
    if (timestamp.length <= 10) {
        date = new Date(timestamp.slice(0, 4) + '-'
            + timestamp.slice(4, 6) + '-'
            + timestamp.slice(6, 8));
    } else {
        date = new Date(timestamp);
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

module.exports = CanvasRenderer;