require('normalize.css/normalize.css');
require('styles/App.scss');
// https://github.com/3terrace
import React from 'react';
import ReactDOM from 'react-dom';

var imageDatas = require('../datas/imageData.json');

//  利用自执行函数，将图片名信息转成图片URL路径信息
var imageDatas = require('../datas/imageData.json');
imageDatas =  (function genImageURL(imageDataArr) {
  for (var i = 0, j = imageDataArr.length; i < j; i++) {
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr
})(imageDatas);

// 获取区间内的一个随机值
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

// 获取一个0～30度之间的任意正负值
function get30DegRandom() {
  let deg ='';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.floor(Math.random() * 30);
}

 // 单个图片组件
class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // imgsFigure的点击处理
  handleClick(e) {
    // 翻转和居中图片
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var styleObj = {};

    // 如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值并不为0， 添加旋转角度
    if (this.props.arrange.rotate) {
      (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate +'deg)';
      })
    }

    // 如果图片是居中，z-index设为 11
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    if (this.props.arrange.isInverse) {
      imgFigureClassName += ' is-inverse ';
    }

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick} >
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className='img-back' onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // 翻转和居中图片
  handleClick (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    let controllerUnitClassName = 'controller-unit';
    // 如果对应的是居中图片，显示控制按钮的居中状态
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center ';
      // 如果翻转显示翻转状态
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse ';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
      )
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {     //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {     //垂直方向的取值范围
        x: [0, 0],
        topY: [0, 0]
      }
    };

    this.state = {
        imgsArrangeArr: []
    };
  }

  // 翻转图片的函数
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr : imgsArrangeArr
      })
    }
  }

  // 利用rearrange函数居中对应index的图片
  center(index) {
    return () => {
      this.rearrange(index);
    }
  }

  // 根据传入的centerIndex重新排布图片
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
        topImgSpliceIndex = 0,

        imgsArrayCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中 centerIndex 的图片, centerIndex 图片不需要旋转
        imgsArrayCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach((value, index) => {
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          };
        });

        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i< j; i++) {
          let hPosRangeLORX = null;

          //前半部分布局左边， 右半部分布局右边
          if (i < k) {
             hPosRangeLORX = hPosRangeLeftSecX;
          }
          else {
             hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
            pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          }
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0 , imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0 , imgsArrayCenterArr[0]);

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  }

  componentDidMount() {
    //首先获取舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.floor(stageW / 2),
        halfStageH = Math.floor(stageH / 2);

    //拿到一个imageFigure的大小
    let imageFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imageFigureDOM.scrollWidth,
        imgH = imageFigureDOM.scrollHeight,
        halfImgW = Math.floor(imgW / 2),
        halfImgH = Math.floor(imgH / 2);
    //中心点位置
    this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
    }
    //计算左右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    let num = Math.floor(Math.random() * 10);
    this.rearrange(num);
  }

  render() {
    var controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
            pos: {
              left: 0,
              top: 0
            },
            rotate: 0,
            isInverse: false,
            isCenter: false
        }
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />)
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />)
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
