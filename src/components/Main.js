require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  Constant : {
    centerPos: {
      left: 0,
      right: 0
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
  }

  componentDidMount() {
    //首先获取舞台的大小
    var stageDOM = React.findDOMNode(this.ref.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到一个imageFigure的大小
    var imageFigureDOM = React.findDOMNode(this.ref.imgFigure0),
        imgW = imageFigureDOM.scrollWidth,
        imgH = imageFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2)
  }

  render() {

    var controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach(function (value, index) {
      imgFigures.push(<ImgFigure data={value} key={'imgFigure'+index}/>)
    })

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
