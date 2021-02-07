function getStyle(element) {
    if(!element || !element.style) {
        element.style = {}
    }

    for(let prop in element.computedStyle) {
        const p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[value];

        const stringStyle = element.style[prop].toString();

        if(stringStyle.match(/px$/) || stringStyle.match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }

    return element.style;
}

function layout(element) {
    if(!element || !element.computedStyle) {
        return;
    }

    const elementStyle = getStyle(element);

    if(elementStyle.display !== 'flex') {
        return
    }
    // 把文本节点过滤， 文本节点不能应用样式
    const items = element.children.filter(e => e.type === 'element');

    // 处理flex中order属性
    items.sort(function (a = 0, b = 0) {
        return a.order - b.order;
    })

    const style = elementStyle; // TODO 后面用到的 style 和 elementStyle 是有什么区别？

    // 方便后面统一判断
    ['width', 'height'].forEach(size => {
        if(style[size] === 'auto' || style[size] === '') {
            style[size] = null
        }
    })

    // 1. 设置属性默认值
    if(!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row'
    } 
    if(!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch'
    }
    if(!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start'
    }
    if(!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }
    if(!style.alignContent || style.alignItems === 'auto') {
        style.alignContent = 'stretch';
    }

    // 用变量表示属性
    let mainSize,
        mainStart,
        mainEnd,
        mainSign,
        mainBase,
        crossSize,
        crossStart,
        crossEnd,
        crossSign,
        crossBase;
    
    if(style.flexDirection === 'row') {
        mainSize = 'width'; // 主轴尺寸
        mainStart = 'left'; // 最左项目
        mainEnd = 'right'; // 最后项目
        mainSign = +1; // 延伸方向
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexWrap === 'wrap-reverse') {
        // 交叉轴上的排序反转下
        [crossStart, crossEnd] = [crossEnd, crossStart];
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    /**
     * 2. 收集元素进行
     * · 分行
     *  · 根据主轴尺寸，把元素分进行
     *  · 若设置了 no-wrap，则强行分配进第一行 
     */

     // 主轴父元素没有设置mainSize，则会一直被撑开，不会换行
     const isAutoMainSize = false;
     if(!style[mainSize]) { // auto sizing
        style[mainSize] = 0; // 初始值方便计算，故用0
        for(const i = 0; i < items.length; i++) {
            const item = items[i];
            const itemStyle = getStyle[item];
            if(itemStyle[mainSize] !== null || itemStyle[mainSize]) {
                style[mainSize] = style[mainSize] + itemStyle[mainSize]
            }
        }
        isAutoMainSize = true;
     }

     const flexLine = []; // TODO 这个到底是数组还是对象，为什么后面会对这个值又push又添加属性？
     const flexLines = [flexLine];

     const mainSpace = style[mainSize] // 剩余空间
     const crossSpace = 0;

     for( const i = 0; i < items.length; i++) {
         const item = items[i];
         const itemStyle = getStyle(item);

         if(itemStyle[mainSize] === null) {
             itemStyle[mainSize] = 0
         }

         if(itemStyle.flex) {
             flexLine.push(item);
         } else if(style.flexWrap === 'nowrap' && isAutoMainSize) {
             mainSpace = mainSpace - itemStyle[mainSize];
             if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void  0)) {
                 crossSpace = Math.max(crossSpace, itemStyle[crossSize]) // 交叉轴最大的又最大值控制
             }
             flexLine.push(item);
         } else { // 需要换行的逻辑
            // 子元素比父元素大
             if(itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
             }
             // 剩余空间不足以放下当前元素，则换行
             if(itemStyle[mainSize] > mainSpace) {
                 flexLine.mainSpace = mainSpace;
                 flexLine.crossSpace = crossSpace;
                 flexLine = [item];
                 flexLines.push(flexLine);
                 // 重置
                 mainSpace = style[mainSize];
                 crossSpace = 0;
             } else {
                 flexLine.push(item);
             }

             mainSpace = mainSpace - itemStyle[mainSize];

             if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                 crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
             }
         }
    }
    // 最后没有元素，最后一行加上
    flexLine.mainSpace = mainSpace;

    console.log('===items', items);
    console.log('===flexLines', flexLines);
    console.log('===flexLine(好奇数据结构到底是怎么样的)', flexLine);

    /**
     * 3. 计算主轴
     * · 计算主轴方向
     *   · 找出左右flex元素
     *   · 把主轴方向的剩余尺寸按比例分配给这元素
     *   · 若剩余空间为负数，所有flex元素为0， 等比压缩剩余元素 TODO？不是很理解这句话是什么意思？
     */

     if(style.flexWrap === 'no-wrap' || isAutoMainSize) {
         flexLine.crossSpace = (style[crossSize] === undefined) ? crossSpace : style[crossSize];
     } else {
         flexLine.crossSpace = crossSpace;
     }
 
     // 剩余空间为负数，则等比缩放非flex元素
     if(mainSpace < 0) { // 只会发生在单行
        const scale = style[mainSize] / (style[mainSize] - mainSpace);
        const currentMain = mainBase;
        for(const i = 0; i < items.length; i++) {
            const item = items[i];
            const itemStyle = getStyle(item);

            // flex 不能参与等比例压缩 ？？
            if(itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
     } else {
         flexLines.forEach( function(items) {
            const mainSpace = items.mainSpace;
            const flexTotal = 0; 
            for(const i =0; i < items.length; i++) {
                const item = items[i];
                const itemStyle = getStyle(item);


                if((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal = flexTotal + itemStyle.flex
                    continue; // TODO？？ 这个continue是不是可以不用？不用continue也是正常循环吧，后面都没有内容了
                }
            }

            if(flexTotal > 0) {
                const currentMain = mainBase;
                for(const i = 0; i < items.length; i++) {
                    const item = items[i];
                    const itemStyle = getStyle(item);

                    console.log('===itemStyle.flex类型到底是什么', itemStyle.flex)

                    if(itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace/flexTotal) * itemStyle.flex;
                    }

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd]
                }
            } else {
                let step = 0;
                let currentMain;
                if(style,justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }
                if(style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if(style.justifyContent === 'center') {
                    currentMain = mainSpace / 1 * mainSign + mainBase;
                    step = 0
                }
                if(style.justifyContent === 'space-between') {
                    currentMain = mainBase;
                    step = mainSpace / (items.length - 1) * mainSign
                }
                if(style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                for(const i = 0; i < items.length; i++) {
                    const item = items[i];
                    const itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
         })
     }

     /**
      * 4. 计算交叉轴方向
      * · 根据每一行中最大元素尺寸计算行高
      * · 根据行高 flex-align 和 item-align, 确定元素具体位置
      */
     let crossSpace;

     // auto sizing
     if(!style[crossSize]) {
         crossSpace = 0
         elementStyle[crossSize] = 0;
         for(const i = 0; i < flexLines.length; i++) {
             elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
         }
     } else {
         crossSpace = style[crossSize]
         for(const i = 0; i < flexLines.length; i++) {
             crossSpace = crossSpace - flexLines[i].crossSpace
         }
     }

     if(style.flexWrap === 'wrap-reverse') {
         crossBase = style[crossSize];
     } else {
         crossBase = 0;
     }

     let lineSize = style[crossSize] / flexLines.length;
     let step;
     if(style.alignItems === 'flex-start') {
         crossBase = crossBase + 0;
         step = 0
     }
     if(style.alignContent === 'flex-end') {
         crossBase = crossBase + crossSign * crossSpace; 
         step = 0;
     }
     if(style.alignContent === 'center') {
         crossBase = crossBase + crossSign * crossSpace / 2; 
         step = 0;
     }
     if(style.alignContent === 'space-between') {
         crossBase = crossBase + 0; 
         step = crossSpace / (flexLines.length - 1);
     }
     if(style.alignContent === 'space-around') {
         step = crossSpace / flexLines.length;
         crossBase = crossSign * step / 2; 
     }
     if(style.alignContent === 'stretch') {
        crossBase = crossBase + 0;
        step = 0
     }

     flexLines.forEach(function (items) {
         const lineCrossSize = style.alignContent === 'stretch' ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace
         for(const i = 0; i < items.length; i++) {
             const item = items[i];
             const itemStyle = getStyle(item);

             // 元素本身属性优先级比较高
             const align = itemStyle.alignSelf || style.alignItems;

             if(item === null) {
                 itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0
             }
             if(align === 'flex-start') {
                 itemStyle[crossStart] = crossBase;
                 itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
             }
             if(align === 'flex-end') {
                 itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
                 itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
             }
             if(align === 'center') {
                 itemStyle[crossStart] = crossBase +crossSign * (lineCrossSize - itemStyle[crossSize]) /2;
                 itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
             }
             if(align === 'stretch') {
                 itemStyle[crossStart] = crossBase;
                 itemStyle[crossEnd] =  crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize]))
                 itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
             }
         }
         crossBase = crossBase + crossSign * (lineCrossSize + step)
     })

     console.log('===计算完交叉轴的dom', items)

     /**
      * 5 渲染 | 绘制单个元素
      * · 绘制需要依赖一个图形环境
      * · 采用npm包images
      * · 绘制在一个viewport上进行
      * · 与绘制相关的属性：background-color、border、background-image等
      */

}

module.exports = layout