var luck = {
  index: -1, //当前转动到哪个位置，起点位置
  count: 0, //总共有多少个位置
  timer: 0, //setTimeout的ID，用clearTimeout清除
  speed: 20, //初始转动速度
  times: 0, //转动次数
  cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
  prize: -1, //中奖位置
  backendData: 6, //设置后台传过来的中奖位置
  virtualPrize: [0, 6, 7, 8], //表示虚拟奖品的位置
  init: function(id) { //初始化
    if ($("#" + id).find(".luck-unit").length > 0) {
      $luck = $("#" + id); //获取table
      $units = $luck.find(".luck-unit"); //获取到td标签的集合
      this.obj = $luck;
      this.count = $units.length; //this指向上下文 调用函数的本身 即id为luck的div
      $luck.find(".luck-unit-" + this.index).addClass("cuttren");
    };
  },
  roll: function() { //转动
    var index = this.index;
    var count = this.count;
    var luck = this.obj;
    $(luck).find(".luck-unit-" + index).removeClass("cuttren");
    index += 1;
    console.log("index:" + index);
    if (index > count - 1) { //重置index循环
      index = 0;
    };
    $(luck).find(".luck-unit-" + index).addClass("cuttren");
    this.index = index; //保存当前的获得td的index
    return false;
  },
  stop: function(index) { //第一次抽奖后 使初始位置停止至上次抽完的位置
    this.prize = index;
    return false;
  }
};
var rollNumber = 2; //抽奖次数
function roll() {
  luck.times += 1; //次数累加
  luck.roll();
  if (luck.times > luck.cycle + 10 && luck.prize == luck.index) { //开始暂停
    console.log("prize:" + luck.prize);
    clearTimeout(luck.timer);
    var $prize = $('.luck-unit-' + luck.prize) //获取到获奖作品的所在对象
      ,
      $godName = $('.godName'),
      prizeName, $shadow2 = $('.shadow2'); //prizeName 奖品的名称  $godName弹窗名称对象
    prizeName = $prize.find("span").html();
    console.log($prize);
    console.log("获奖名称：" + prizeName);
    //写中奖后的弹窗start
    if (luck.prize == 3 || luck.prize == 9) {
      var $shadow = $('.shadow');
      console.log("已进入暂停时刻，即抽奖结束状态 中奖位置为：" + luck.prize);
      $shadow.show(200);
    } else if ($.inArray(luck.prize, luck.virtualPrize) > -1) { //判断是否为实物商品 $.inArray JQ中的判断一个数是否存在与数组中的方法
      var $info = $('.info'),
        $infoBtnText = $('.infoBtn'),
        $timeRange = $('.timeRange');
      $godName.html(prizeName);
      $info.html("系统将自动发送对应金额和包券至您的和包账户，请注意查收及短信通知。");
      $infoBtnText.html('点击查看');
      $timeRange.show();
      $shadow2.show();
    } else {
      $shadow2.show();
      $godName.html(prizeName);
    }
    //写中奖后的弹窗end
    luck.prize = -1;
    luck.times = 0;
    click = false;
  } else {
    if (luck.times < luck.cycle) {
      luck.speed -= 10; //小于规定转动速度时慢慢加速
    } else if (luck.times == luck.cycle) { //开始来真正的抽奖
      //var index=luck.backendData; // 使中奖位置自己预设
      var index = Math.random() * (luck.count) | 0; //产生随机的最后抽奖位置  这里可以通过后台来获取来设置获奖位置
      luck.prize = index;
      console.log('中奖位置：' + luck.prize);
    } else {
      if (luck.times > luck.cycle + 10 && ((luck.prize == 0 && luck.index == 7) || luck.prize == luck.index + 1)) {
        luck.speed += 110; //开始减速

      } else {
        luck.speed += 20;
      }
    }
    if (luck.speed < 40) {
      luck.speed = 40;
    };
    luck.timer = setTimeout(roll, luck.speed); //回掉自身
  }
  return false;
}

var click = false; //防止多点
window.onload = function() {
  luck.init('luck'); //id为luck的div调用了init函数
  console.log("count:" + luck.count);
  $('.rollNumber').html(rollNumber);
  $("#btn").click(function() {
    if (click) {
      return false;
    } else {
      //抽奖次数递减 start  判断抽奖次数是否大于0
      // console.log('luck.rollNumber:'+luck.rollNumber);
      console.log("抽奖次数:" + rollNumber);
      if (rollNumber > 0) {
        rollNumber--;
        $('.rollNumber').html(rollNumber);
        //抽奖转盘转动start
        luck.speed = 100;
        roll();
        click = true;
        return false;
        //抽奖转盘转动end
      } else {
        alert("抽奖次数不足");
      }
      //抽奖次数递减 end
    }
  });
};
$(function() {
  // 中奖弹窗start
  var $close = $('.close'),
    $shadow = $('.shadow'),
    $nogob = $('.no_gob_btn'),
    $shadow2 = $('.shadow2'),
    $shadow3 = $('.shadow3'),
    $shadow3Close = $('.shadow3Close');
  // console.log($nogob);
  var $infoBtn = $('.infoBtn'),
    $close2 = $(".close2"),
    $myprize = $('#myprize');
  //点击隐藏方法start
  function hideShadow(obj, shadow) {
    obj.click(function() {
      shadow.hide();
    });
  }
  //点击隐藏方法end
  hideShadow($close, $shadow);
  hideShadow($nogob, $shadow);
  hideShadow($infoBtn, $shadow2);
  hideShadow($close2, $shadow2);
  hideShadow($shadow3Close, $shadow3);
  console.log($myprize);
  //我的奖品弹窗start
  $myprize.click(function() {
    $shadow3.show();
  });
  //我的奖品弹窗end


});
//中奖弹窗end
