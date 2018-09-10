import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import * as d3 from 'd3';

import {
    DATA_ANIMATION2_NTU,
    DATA_ANIMATION2_TOP5,
    DATA_ANIMATION2_TOP10,
    DATA_ANIMATION2_TOP20,
    INCOMES,
    color_green,
    color_red,
    color_grey,
    color_yellow,
} from './constants.js';

console.log('release-1');


ReactDOM.render(
    <div id='opportunity-calculator-infographic'>
        <div className='info-row-box'>
            {/* 下面這row要刪掉 */}
            <div className="tabletitle"><b>輸入你的家戶所得數，看看你進入台大的機率有多少？</b></div> 
            <div className='info-row'>輸入你的年家戶所得：</div> 
            <div className='info-row-group'>
            <input id='info-row-input' onChange={handleChange}/>
            <div className='info-row-desc'>例：家戶一年所得為100萬台幣，則輸入1,000,000</div>  
            </div>
            <button id='button' onClick={() => handleClick('guess')}><div id='button-content'>點擊看結果</div></button>
        </div>
        <div class='pic'></div>
    </div>
    ,
    document.getElementById('d3Table2')
);


document.getElementById("button").disabled = true;
let income, width, t_width;
t_width = (window.innerWidth || document.documentElement.clientWidth);
let pre_t_width = t_width;
// Setting & Event listers

window.addEventListener('resize', function () {
    t_width = (window.innerWidth || document.documentElement.clientWidth);
    if (pre_t_width!==t_width) {
        pre_t_width = t_width;
        width =  document.getElementById("opportunity-calculator-infographic").offsetWidth;
        cleanSVG();
        cleanInputValue();
    }
})

function handleChange(event) { 
    if (isNaN(Number(event.target.value.replace(/,/gi, "")))) {
        if (income!== undefined && income!== 0) document.getElementById("info-row-input").value = income.toLocaleString();
        else cleanInputValue();
    } else {
        income = Number(event.target.value.replace(/,/gi, ""));
        if (income===0 || income===undefined) cleanInputValue();
        else document.getElementById("info-row-input").value = income.toLocaleString();
    }

    if(income===undefined || income==='') {
        document.getElementById("button").disabled = true;
        d3.select("#button")
        .style('background-color', '#e2e2e2');
        d3.select("#button-content")
        .style('color', '#9c9c9c');
    } else {
        document.getElementById("button").disabled = false;
        d3.select("#button")
        .style('background-color', '#58997f');
        d3.select("#button-content")
        .style('color', '#f1f1f1');
    } 
}



function handleClick(str) {
    switch (str) {
        case 'guess':
            width =  document.getElementById("opportunity-calculator-infographic").offsetWidth;
            if(t_width>=768) width = 664;
            let position = calculateRankinAllPopulation(income) + 1;
            let probSet = calculatePropEnterNTU(position);
            cleanSVG();
            let svg2 = addEmptySVG();
            appendResultsToSVG(svg2, position, probSet);
            // console.log('position', position);
            // console.log('probSet', probSet);
            return;
        default:
            return;
    }
}


function calculateRankinAllPopulation(income) {
    // load data
    let dataset = INCOMES
    // console.log('dataset', dataset);
    // find the rank of the input value in these 100 incomes
    let position;
    if (dataset[0] - income >= 0) {
        position = 0;
    } else if (income - ((dataset[dataset.length - 1] + dataset[dataset.length - 2]) / 2) >= 0) {
        position = 99;
    } else {
        for (let i = 0; i < dataset.length - 1; i++) {
            if (income - (dataset[i] + dataset[i + 1]) / 2 < 0) {
                position = i;
                break;
            }
        }
    }
    // console.log('家庭所得百分位', position + 1);
    return position;
}

function calculatePropEnterNTU(position) {
    position--;
    let probSet = [DATA_ANIMATION2_NTU[position], DATA_ANIMATION2_TOP5[position], DATA_ANIMATION2_TOP10[position], DATA_ANIMATION2_TOP20[position]];
    return probSet;
}

function cleanSVG() {
    d3.select('#d3Table2').selectAll('svg').remove();
}

function cleanInputValue() {
    income = undefined;
    document.getElementById("info-row-input").value = '';
    // make the button disabled
    document.getElementById("button").disabled = true;
    d3.select("#button")
    .style('background-color', '#e2e2e2');
    d3.select("#button-content")
    .style('color', '#9c9c9c');
}

function addEmptySVG() {
    let svg2 = d3.select('.pic').append('svg')
        .style('width', width+'px')
        .style('height', function(){
            if(width>=664) return '280px';
            else return '340px';
        }); 
    return svg2;
}

function appendResultsToSVG(svg, position, probSet) {
    let height = 500;
    let width_rect = width/100;
    let oneToHundrendText = [];
    let oneToHundrendRect = [];
    for (let i = 1; i <= 500; i++) {
        if (i<=100) oneToHundrendText.push(i);
        else oneToHundrendText.push(0);
    }
    for (let i = 1; i <= 100; i++) {
        oneToHundrendRect.push(i);
    }
    
    //rect
    svg.selectAll('rect').data(oneToHundrendRect).enter()
        .append('rect')
        .attr('x', function (d, i) {
            return width*0.06 + (d-1)/100*(width*0.88);
        })
        .attr('y', function (d) {
            return 65;
        })
        .attr('width', function (d) {
            return width_rect*0.88+1;
        })
        .attr('height', function (d, i) {
            return '20px';
        })
        .attr('fill', function (d, i) {
            return '#f1f1f1';
        })

    svg.selectAll('rect').data(oneToHundrendRect)
        .filter(function (d, i) {
            if (d <= position) return true;
            else return false;
        })
        .transition()
        .delay(function (d, i) {
            return (d - 1) * 40;
        })
        .duration(40)
        .attr('fill', function (d, i) {
            return color_red;
        })

    svg.selectAll('text').data(oneToHundrendText).enter()
        .append('text')
        .text(function (d) {
            return d + '%';
        })
        .attr('text-anchor', "middle")
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'SourceHanSansTC')
        .attr('font-size', '36px')
        .attr('font-weight', 'bold')
        .attr('line-height', 0.83)
        .attr('letter-spacing', '0.2px')
        .attr('x', function (d) {
            return width/2;
        })
        .attr('y', function (d, i) {
            return 125;
        })
        .attr('fill', function (d, i) {
            return 'none';
        })

    svg.selectAll('text').data(oneToHundrendRect)
        .filter(function (d, i) {
            if (d <= position) return true;
            else return false;
        })
        .transition()
        .delay(function (d, i) {
            return (d - 1) * 40;
        })
        .duration(40)
        .transition()
        .attr('fill', function (d, i) {
            return color_yellow;
        })
        .transition()
        .attr('fill', function (d, i) {
            if ((d) === position) return color_yellow;
            else return 'none';
        })

    svg.append('rect')
        .attr('x', function (d, i) {
            return width*0.06;
        })
        .attr('y', function (d) {
            return 170;
        })
        .attr('width', function (d) {
            return width*0.88;
        })
        .attr('height', function (d, i) {
            return '2px';
        })
        .attr('fill', function (d, i) {
            return '#9c9c9c';
        })
    



    probSet = probSet.map(item => parseFloat(item));
    let mode = false;
    if(width>=664) mode = true;
    appendText(svg, mode, "台灣", probSet[0], 0);
    appendText(svg, mode, "前五", probSet[1], 1);
    appendText(svg, mode, "前十", probSet[2], 2);
    appendText(svg, mode, "前二十", probSet[3], 3);

    svg.append('text')
        .text('你的家戶所得落在台灣家戶所得的百分比(%)的')
        .attr('x', width*0.06)
        .attr('y', 40)
        .attr('dominant-baseline', 'middle')
        .attr('height', '30px')
        .attr('font-size', function () {
            if (width>=664) return '18px';
            else if (width>=414 ) return '16px';
            else return '14px';
        })
        .attr('font-family', 'SourceHanSansTC')
        .attr('font-weight', 'bold')
        .attr('line-height', 1.67)
        .attr('fill', '#404040');


    svg.append('text')
        .text('所得低')
        .attr('x', width*0.06)
        .attr('y', 98)
        .attr('text-anchor', "left")
        .attr('dominant-baseline', 'middle')
        .attr('height', '10px')
        .attr('font-size', function () {
            return '12px';
        })
        .attr('font-family', 'SourceHanSansTC')
        .attr('fill', '#808080');    

    svg.append('text')
        .text('所得高')
        .attr('x', width*0.94)
        .attr('y', 98)
        .attr('text-anchor', "end")
        .attr('dominant-baseline', 'middle')
        .attr('height', '10px')
        .attr('font-size', function () {
            return '12px';
        })
        .attr('font-family', 'SourceHanSansTC')
        .attr('fill', '#808080');    
}


function appendText(svg, mode, str, prob, order) {
    let x, y;
    svg.append('text')
        .text(function(d){
            if(order===0) return '進入台大就讀的機率為:';
            else return '進入排名'+str+'的學校機率為:'
        })
        .attr('x', function (d) {
            if (mode) {
                if (order===0 || order===2) x = width*0.06;
                else x = width*0.5;
            }
            else x = width*0.06;
            return x;
        })
        .attr('y', function (d) {
            if (mode) {
                if (order===0 || order===1) y = 208;
                else y = 245;
            }
            else {
                y = (208) + (32 * order);
            } 
            return y;
        })
        .attr('font-size', function(){
            if(width>768) return '18px';
            else return '18px';
        })
        .attr('font-family', 'SourceHanSansTC')
        .attr('fill', '#404040')
        .attr('letter-spacing', '0.1px')
        .attr('line-height', 1.67)

    let values = [];
    for (let i = 1; i <= 100; i++) {
        let value = parseInt(prob*100*(i/100));
        values.push(value);
    }

    if (order === 0 ) test(svg, x + 215, y-3 , values, order);
    else if ( order === 1 || order === 2) test(svg, x + 250, y-3 , values, order);
    else test(svg, x + 268, y-3, values, order);
}

function test(svg, x, y, values, order) {
    let qq = svg.selectAll('text')
    .filter(function(d, i){
        if (i>=(100+order*100)  && i<(200+order*100)) return true;
        else return false;
    })
    .data(values)
    .text(function (d, i) {
        if (d % 100 < 10) return parseInt(d / 100) + '.0' + (d % 100) + '%';
        return parseInt(d / 100) + '.' + (d % 100) + '%';
    })
    .attr('font-family', 'SourceHanSansTC')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', '16px')
    .attr('line-height', 1.67)
    .attr('letter-spacing', '0.1px')
    .attr('x', function (d) {
        return x;
    })
    .attr('y', function (d, i) {
        return y;
    })
    .attr('fill', function (d, i) {
        return 'none';
    })

    qq.transition()
    .delay(function (d, i) {
        return (i) * 20;
    })
    .duration(40)
    .transition()
    .attr('fill', function (d, i) {
        return '#404040';
    })
    .transition()
    .attr('fill', function (d, i) {
        if ((i) === 99) return '#404040';
        else return 'none';
    })
}
