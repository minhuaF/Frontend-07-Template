const images = require('images');

function render(viewport, element) {
    if(element && element.style) {
        const img  = images(element.style.width, element.style.height);

        if(element.style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0,0,0)';
            color.match(/rgb\((\d+), (\d+), (\d+)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
            viewport.draw(img, element.style.left || 0, element.style.top || 0)
        }
    }

    /**
     * 6. 渲染 | 绘制DOM树
     * · 递归调用子元素的绘制方法完成DOM树的绘制
     * · 忽略一些不需要绘制的节点
     * · 实际浏览器中，文字绘制是难点，需要依赖字体库，这里忽略
     * · 实际浏览器中，还会对一些图层从compositing，这里也忽略
     */
    if(element.children) {
        for(const child of element.children) {
            render(viewport, child)
        }
    }
}

module.exports = render;