import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as d3 from 'd3';
 
// let iDiv = document.createElement('div');
// iDiv.id = 'd3Table';
// document.getElementsByTagName('body')[0].appendChild(iDiv);
console.log('release-3');

function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

import {
    DATA_ANIMATION1,
    DATA_ANIMATION2_NTU,
    DATA_ANIMATION2_TOP5,
    DATA_ANIMATION2_TOP10,
    DATA_ANIMATION2_TOP20,
    color_green,
    color_red,
    color_grey,
    color_dark_grey,
    color_white
} from './constants.js';
const DATA_ANIMATION2 = [DATA_ANIMATION2_NTU, DATA_ANIMATION2_TOP5, DATA_ANIMATION2_TOP10, DATA_ANIMATION2_TOP20];

ReactDOM.render(
  <div>
    <div id="box">
      <button class="button ntu">
        <text class="button-text ntu-text">台大</text>
      </button>
      <button class="button top5">
        <text class="button-text top5-text">排名前5的學校</text>
      </button>
      <button class="button  top10">
        <text class="button-text top10-text">排名前10的學校</text>
      </button>
      <button class="button-rightmost top20">
        <text class="button-text top20-text">排名前20的學校</text>
      </button>
    </div>
    <div id='table-box'>
      <div class='table'>
      </div>
    </div>
  </div>, 
  document.getElementById('d3Table')
);

let numDataPointsLeft, numDataPointsRight, leftProbability, rightProbability, dataAnimation2;
let circles = [];
let dataset = [];
let demo;

// Setting & Event listers
window.addEventListener('resize', function () {
    w =  document.getElementById("box").offsetWidth;
    if (w <= 1024) {
        h = Math.floor(w * 0.70);
        total_h = Math.floor(w * 0.78) + 10;
        padding = 8;
        isMobile = true;
    } else {
        h = 382;
        total_h = 450;
        w = 664;
        padding = 14;
        isMobile = false;
    }
    reTrigger("台大")
    clickhandler(0);
})

let isActived = false;
if(isElementInViewport(document.getElementById('table-box'))) isActived = true;
window.addEventListener('scroll', function () {
    // console.log(isElementInViewport(document.getElementById('table-box')))
    if(isElementInViewport(document.getElementById('table-box')) && isActived === false){
        isActived = true;
        clickhandler(0);
        reTrigger("台大");
    } else if (isElementInViewport(document.getElementById('table-box')) && isActived === true){
        
    } else {
        isActived = false;
        clickhandler(0);
        reTrigger("init");
    }
})

let w =  document.getElementById("box").offsetWidth;
let h, total_h, padding, isMobile;
if (w <= 1024) {
    h = Math.floor(w * 0.70);
    total_h = Math.floor(w * 0.78);
    padding = 8;
    isMobile = true;
} else {
    h = 382;
    total_h = 450;
    w = 664;
    padding = 14;
    isMobile = false;
}

d3.select('.ntu')
    .on('click', function () {
        clickhandler(0);
        reTrigger("台大")
    })
d3.select('.top5')
    .on('click', function () {
        clickhandler(1);
        reTrigger('Top5')
    })
d3.select('.top10')
    .on('click', function () {
        clickhandler(2);
        reTrigger('Top10')
    })
d3.select('.top20')
    .on('click', function () {
        clickhandler(3);
        reTrigger('Top20')
    })

// Execution
clickhandler(0);
reTrigger("init");


// Individaul functions
function dataSetting(comparedString) {
    for (let i = 0; i < numDataPointsLeft; i++) {
        let x = padding / 2;
        let y = (7) + (i / numDataPointsLeft) * (h - 14)
        let r = (padding / 4) + 'px';
        let isActived = true;
        let color = color_red;
        let dir = 'left';
        dataset.push([x, y, r, color, isActived, dir]);
    };
    for (let i = numDataPointsLeft; i < numDataPointsLeft + numDataPointsRight; i++) {
        let x = w - padding / 2;
        let y = (7) + ((i - numDataPointsLeft) / numDataPointsRight) * (h - 14);
        let r = (padding / 4) + 'px';
        let isActived = true;
        let color = color_green;
        let dir = 'right';
        dataset.push([x, y, r, color, isActived, dir]);
    };
    for (let i = numDataPointsLeft + numDataPointsRight; i < numDataPointsLeft + numDataPointsRight + 2; i++) {
        let x = padding + (w - padding * 2) / 3;
        if (i === numDataPointsLeft + numDataPointsRight + 1) x = padding + (w - padding * 2) * (2 / 3);
        let y = h / 2;
        let r = (padding) + 'px';
        if (i === numDataPointsLeft + numDataPointsRight + 1) r = (padding) + 'px';
        let isActived = false;
        let color = color_red;
        if (i === numDataPointsLeft + numDataPointsRight + 1) color = color_green;
        let dir = 'stay-left';
        if (i === numDataPointsLeft + numDataPointsRight + 1) dir = 'stay-right';
        dataset.push([x, y, r, color, isActived, dir]);
        circles.push([x, y, r, color, isActived, dir]);
    };

    let demo = d3.select('.table').append('svg')
        .style('width', '100%')
        .style('height', total_h + 'px');

    demo.selectAll('circle').data(dataset).enter()
        .append('circle')
        .attr('cx', function (d) {
            return d[0]
        })
        .attr('cy', function (d) {
            return d[1]
        })
        .attr('r', function (d) {
            return d[2]
        })
        .attr('fill', function (d) {
            return d[3]
        });

    demo.append('text')
        .text('')
        .attr('x', padding + (w - padding * 2) / 3)
        .attr('y', h / 2)
        .attr('text-anchor', "middle")
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', color_white);

    demo.append('text')
        .text('')
        .attr('x', padding + (w - padding * 2) * 2 / 3)
        .attr('y', h / 2)
        .attr('text-anchor', "middle")
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', color_white);

    demo.append('text')
        .text('')
        .attr('x', padding + (w - padding * 2) / 3)
        .attr('y', h / 2 - 45)
        .attr('text-anchor', "middle")
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', color_dark_grey);

    demo.append('text')
        .text('')
        .attr('x', padding + (w - padding * 2) * 2 / 3)
        .attr('y', h / 2 - 59)
        .attr('text-anchor', "middle")
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', color_dark_grey);

    demo.append('text')
        .text('家戶所得後5%')
        .attr('x', 0)
        .attr('y', h + 27)
        .attr('width', '51px')
        .attr('height', '22px')
        .attr('font-family', 'SourceHanSansTC')
        .attr('font-size', '16px')
        .attr('letter-spacing', '0.1px')
        .attr('fill', color_grey)

    demo.append('text')
        .text('家戶所得前5%')
        .attr('x', w)
        .attr('y', h + 27)
        .attr('width', '51px')
        .attr('height', '22px')
        .attr('font-family', 'SourceHanSansTC')
        .attr('font-size', '16px')
        .attr('letter-spacing', '0.1px')
        .attr('text-anchor', "end")
        .attr('fill', color_grey)

    // demo.append('text')
    //     .text('家戶所得比例')
    //     .attr('x', w / 2)
    //     .attr('y', h + 27)
    //     .attr('width', '198px')
    //     .attr('height', '22px')
    //     .attr('font-family', 'SourceHanSansTC')
    //     .attr('font-size', '16px')
    //     .attr('text-anchor', "middle")
    //     .attr('fill', color_grey)

    demo.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', padding)
        .attr('height', h)
        .attr('fill', color_red)

    demo.append('rect')
        .attr('x', w - padding)
        .attr('y', 0)
        .attr('width', padding)
        .attr('height', h)
        .attr('fill', color_green)

    demo.append('rect')
        .attr('x', 0)
        .attr('y', h)
        .attr('width', w)
        .attr('height', 1)
        .attr('fill', color_grey)

    return demo;
}

function animation(demo, str) {
    let count = 0;
    let target = dataset.length;
    demo.selectAll('circle').data(dataset)
        .transition()
        .delay(function (d) {
            if (d[4]) return Math.floor(Math.random() * 1500) + 500
            else if (d[5] === 'stay-left' || d[5] === 'stay-right') return 500
            else return 2500
        })
        .duration(function (d) {
            if (d[4]) return Math.floor(Math.random() * 2500)
            else if (d[5] === 'stay-left' || d[5] === 'stay-right') return 4500
            else return 3500
        })
        .attr('cx', function (d) {
            if (d[4]) {
                if (d[5] === 'left') return w / 3;
                else return w * (2 / 3);
            } else return d[0];
        })
        .attr('cy', function (d) {
            if (d[4]) return h / 2;
            else return d[1];
        })
        .attr('r', function (d) {
            if (d[4] && d[5] === 'left') return (padding / 4) + 'px';
            if (d[4] && d[5] === 'right') return (padding / 4) + 'px';
            else if (d[5] === 'stay-left') return '28px';
            else if (d[5] === 'stay-right') return '39px';
            else return '5px';
        })
        .remove()
        .on('end', function () {
            count++;
            if (count === target) setTimeout(animation1to2(demo, str), 500);
        })
    
    let data = [leftProbability, rightProbability, numDataPointsLeft, numDataPointsRight];
    data[2]*=10;
    data[3]*=10;

    demo.selectAll('text').filter(function (d, i) {
            return (i <= 3)
        })
        .transition()
        .delay(2500)
        .transition(600)
        .text(function (d, i) {
            if (i <= 1) return '0.00%';
            else return '共0人';
        })
        .text(function (d, i) {
            if (i <= 1) return (data[i] * 1 / 5).toFixed(2) + '%';
            else return '共' + Math.floor((data[i] * 1 / 5)) + '人';
        })
        .transition(600)
        .text(function (d, i) {
            if (i <= 1) return (data[i] * 2 / 5).toFixed(2) + '%';
            else return '共' + Math.floor((data[i] * 2 / 5)) + '人';
        })
        .transition(600)
        .text(function (d, i) {
            if (i <= 1) return (data[i] * 3 / 5).toFixed(2) + '%';
            else return '共' + Math.floor((data[i] * 3 / 5)) + '人';
        })
        .transition(600)
        .text(function (d, i) {
            if (i <= 1) return (data[i] * 4 / 5).toFixed(2) + '%';
            else return '共' + Math.floor((data[i] * 4 / 5)) + '人';
        })
        .transition(600)
        .text(function (d, i) {
            if (i <= 1) return (data[i] * 5 / 5).toFixed(2) + '%';
            else return '共' + Math.floor((data[i] * 5 / 5)) + '人';
        })

}

function animation1to2(demo, str) {
    let count = 0;
    demo.selectAll('circle').data(circles).enter()
        .append('circle')
        .attr('cx', function (d) {
            return d[0]
        })
        .attr('cy', function (d) {
            return d[1]
        })
        .attr('r', function (d) {
            if (d[5] === 'stay-left') return '28px';
            else return '39px';
        })
        .attr('fill', function (d) {
            return d[3]
        });

    demo.selectAll('circle').data(circles)
        .transition()
        .duration(function (d) {
            return 1000
        })
        .attr('cx', function (d) {
            if (d[5] === 'stay-left') return padding + 50;
            else return w - padding;
        })
        .attr('cy', function (d) {
            if (d[5] === 'stay-left') return h - padding;
            else return h / 2 - 30;
        })
        .attr('r', function (d) {
            if (d[5] === 'stay-left') return '2px';
            else return '2px';
        }).remove()
        .on('end', function (d) {
            count++;
            if (count === 2) animation2(demo, str);
        });

    demo.selectAll('rect')
        .transition()
        .remove()

    demo.selectAll('text')
        .transition()
        .remove()

}

function animation2(demo, str) {
    let margin2 = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 52
    };
    let w2 = w - margin2.right - margin2.left;
    let h2 = total_h - margin2.top - margin2.bottom;

    let dataset2 = dataAnimation2;
    let Ymax2 = d3.max(dataset2);

    let xScale2 = d3.scaleLinear().domain([0, dataset2.length]).range([0, w2]);
    let yScale2_1 = d3.scaleLinear().domain([0, Ymax2]).range([h2, 0]);

    let yScale2_2 = d3.scaleLinear()
        .domain([0, Ymax2])
        .range([0, h2])

    let barWidth = (w2) / dataset2.length - 2;

    let line = d3.line()
        .x(function (d, i) {
            return xScale2(i);
        })
        .y(function (d, i) {
            return yScale2_1(d);
        });

    let svg2 = demo
        .append('g')
        .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');
    let tickXValues = [];
    for (let i = 0; i <= 100; i = i + 5) {
        tickXValues.push(i);
    }
    let tickYValues = [];
    for (let i = 0; i <= 40; i++) {
        tickYValues.push(i);
    }
    let xAxis2 = d3.axisBottom(xScale2)
        .tickValues(tickXValues)
        .tickFormat(function (d) {
            if (d === 100) return d;
            else return '';
        });
    svg2.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h2 + ')')
        .call(xAxis2);
    let yAxis2 = d3.axisLeft(yScale2_1)
        .tickValues(tickYValues)
        .tickFormat(function (d) {
            if (d === 5 || d === 20 || d === 35) return d;
            else return '';
        });
    svg2.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis2)

    // svg2.append('path').attr('d', line(dataset2));
    svg2.selectAll('rect').data(dataset2).enter()
        .append('rect')
        .attr('x', function (d, i) {
            return xScale2(i) + 2
        })
        .attr('y', function (d) {
            return h2 - yScale2_2(d)
        })
        .attr('width', barWidth)
        .attr('height', function (d) {
            return yScale2_2(d)
        })
        .attr('fill', function (d, i) {
            if (i <= 5) return color_red;
            else if (i >= 95) return color_green;
            else return color_grey;
        });

    svg2.append('text')
        .text('全台灣家戶所得百分位數')
        .attr('x', w2 / 2)
        .attr('y', h2 + 30)
        .attr('text-anchor', "middle")
        .attr('dominant-baseline', 'middle')
        .attr('font-size', function () {
            if (isMobile) return '14px';
            else return '16px';
        })
        .attr('fill', color_grey);


    svg2.append('text')
        .text('進入'+str+'的機率(%)')
        .attr('x', -35)
        .attr('y', Math.floor((18 / 100) * total_h))
        .attr('writing-mode', "tb")
        .attr('font-size', function () {
            if (isMobile) return '14px';
            else return '16px';
        })
        .attr('fill', color_grey);
}

function clickhandler(index) {

    numDataPointsLeft = DATA_ANIMATION1[index].numDataPointsLeft/10;
    numDataPointsRight = DATA_ANIMATION1[index].numDataPointsRight/10;
    leftProbability = DATA_ANIMATION1[index].leftProbability;
    rightProbability = DATA_ANIMATION1[index].rightProbability;

    dataAnimation2 = DATA_ANIMATION2[index];

    let classes = ['.ntu', '.top5', '.top10', '.top20'];
    let textClasses = ['.ntu-text', '.top5-text', '.top10-text', '.top20-text'];
    classes.map((str, i) => {
        let temp = d3.select(str);
        if (i === index) temp.classed('button-clicked', true);
        else temp.classed('button-clicked', false);
    })
    textClasses.map((str, i) => {
        let temp = d3.select(str);
        if (i === index) temp.classed('button-text-clicked', true);
        else temp.classed('button-text-clicked', false);
    })
}

function reTrigger(str) {
    d3.select('#d3Table').selectAll('svg').remove();
    dataset = [];
    circles = [];
    demo = dataSetting(str);
    if(str!=='init'){
        animation(demo, str);
    }
}




