/**
 * 游戏配置
 */

// 大方块的属性
var gameConfig = {
    height : 360,
    width : 480,
    rows : 3, //行数
    cols : 3, //列数
    isOver : false, //游戏是否结束
    imgsrc: "yys.jpg",
    dom : document.getElementById("game"), 
}



//设置小方块的宽度和高度
gameConfig.pieceWidth = gameConfig.width /  gameConfig.cols; 
gameConfig.pieceHeight = gameConfig.height /  gameConfig.rows;


//小方块的数量
gameConfig.pieceNumber = gameConfig.rows * gameConfig.cols;


var blocks = [];

//是否相等
function isEqual(n1, n2) {
    return parseInt(n1) === parseInt(n2);
}


//小方块参数放构造函数里方便创建
function Blocks(left, top, isVisible) {
     this.left = left; // 当前横坐标
     this.top = top; //当前纵坐标
     this.correctLeft = this.left; //正确横坐标
     this.correctTop = this.top; //正确纵坐标
     this.isVisible = isVisible; // 小方块是否可见
     this.dom = document.createElement("div");
     this.dom.style.width = gameConfig.pieceWidth + "px";
     this.dom.style.height = gameConfig.pieceHeight + "px";
     this.dom.style.background = `url(${gameConfig.imgsrc}) -${this.correctLeft}px -${this.correctTop}px`;
     this.dom.style.boxSizing = "border-box";
     this.dom.style.position = "absolute";
     this.dom.style.border = "1px solid #fff";
     this.dom.style.cursor = "pointer";
     this.dom.style.transition = ".5s";
     gameConfig.dom.appendChild(this.dom); 
     if(!isVisible) {
        this.dom.style.display = "none";
     }

     /**
      * 小方块位置
      */
     this.show = function () {
         //根据当前left top 重新设置div的位置
         this.dom.style.left = this.left + "px";
         this.dom.style.top = this.top + "px";
     }

     //判断当前方块是否在正确位置上
     this.isCorrect = function () { 
         return isEqual(this.left, this.correctLeft) && isEqual(this.top, this.correctTop);
     }

     this.show();
}

/**
 * 初始化游戏
 */
function init () {
    
    //游戏盒子框
    initGameDom();
    //2 初始化小方块数组
    initBlocksArray();
    //打乱数组
    shuffle();
   // 注册点击事件
   regEvent();

   function regEvent() {
        //找到看不到的方块
       var inVisisibleBlock = blocks.find(function(b) {
               return !b.isVisible;
       });
       blocks.forEach(function (b) {
         b.dom.onclick = function () {
             if(gameConfig.isOver) {
                 return;
             }
             if(b.top === inVisisibleBlock.top && isEqual(Math.abs(b.left - inVisisibleBlock.left), gameConfig.pieceWidth) || 
                 b.left === inVisisibleBlock.left && isEqual(Math.abs(b.top - inVisisibleBlock.top), gameConfig.pieceHeight))
                 {
                    //  交换当前方块和看不见方块的坐标
                     exchange(b, inVisisibleBlock);

                     // 判断游戏结束判断
                     isWin();
                 }
         }
       })
   }
      
     /**
      * 游戏结束
      */
      function isWin() {
         var wrongs = blocks.filter(function(imet) {
             return !imet.isCorrect();
         });
         if(wrongs.length === 0) {
          gameConfig.isOver = true;
         blocks.forEach(function (b) {
            b.dom.style.border = "none";
            b.dom.style.display = "block"; 
         });
        }
      }

     //封装有个交换数组的
     function exchange(b1,b2) {
         // 1,交换left
         var temp = b1.left;
        b1.left = b2.left;
        b2.left = temp;
        //2.交换top
        temp = b1.top;
        b1.top = b2.top;
        b2.top = temp;
        b1.show();
        b2.show();
     }

    /**
     * 给blocks数组洗牌
     */
  function shuffle() {
    for(var i = 0; i < blocks.length - 1; i++) {
         // 随机产生一个下标
         var index = getRandom(0,blocks.length - 1);
         // 将数组的当前项与随机项交换left,和top
         exchange(blocks[i], blocks[index]);
    }
  }

    





    // 获得随机数
    /**
     * 
     * @param {*} max 最大数
     * @param {*} min 最小数
     */
    function getRandom (max, min) {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }


  /**
   * 小方块数组
   */
   function initBlocksArray() {
        for(var i = 0; i < gameConfig.rows; i++) {
            for(var j = 0; j < gameConfig.cols; j++) {
                
                var isVisible = true;
                //判断是否是最后一个
                if(i === gameConfig.rows - 1 && j === gameConfig.cols - 1) {
                     isVisible = false;
                }

                b = new Blocks(gameConfig.pieceWidth * i, gameConfig.pieceHeight * j, isVisible);
                blocks.push(b);
            }
        }

    }

    /**
     * 初始化游戏盒子
     */
  function initGameDom() {
     gameConfig.dom.style.width = gameConfig.width + "px";
     gameConfig.dom.style.height = gameConfig.height + "px";
     gameConfig.dom.style.position = "relative";
     gameConfig.dom.style.border = "2px solid #ccc";
  }

}
init();