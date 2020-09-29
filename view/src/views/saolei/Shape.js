
/**
 * 四格方块基类
 */
export class Shape {

  constructor() {

    this.type = '';
    this.status = 1; //每种四格方块都有4个状态，供旋转时切换
    this.arr = this.makeArr();// 四格方块的大概模型
    this.row = -1; //此模型左下角在主界面的行位置, 初始在界面以上位置
    this.col = 3; //此模型左下角在主界面的列位置
    // controlArea.methods.upOnmousedown;
  }


  makeArr() {
    // T: 4 种形状; L: 4 种形状; Z: 2 种形状; S: 2 种形状; I: 2 种形状; O: 1 种形状; Point:  1 种形状; (共 16 种, 平均概率)
    let r = Math.floor(Math.random() * 16 + 1);

    let index = Math.floor(Math.random() * 100 + 1);
    if (r <= 4) {
      this.type = 'T';
      index %= Shape.Repository.T.length;
      this.status = index;
      return Shape.Repository.T[index];

    } else if (r <= 8) {
      this.type = 'L';
      index %= Shape.Repository.L.length;
      this.status = index;
      return Shape.Repository.L[index];

    } else if (r <= 10) {
      this.type = 'Z';
      index %= Shape.Repository.Z.length;
      this.status = index;
      return Shape.Repository.Z[index];

    } else if (r <= 12) {
      this.type = 'S';
      index %= Shape.Repository.S.length;
      this.status = index;
      return Shape.Repository.S[index];

    } else if (r <= 14) {
      this.type = 'I';
      index %= Shape.Repository.I.length;
      this.status = index;
      return Shape.Repository.I[index];

    } else if (r <= 15) {
      this.type = 'O';
      index %= Shape.Repository.O.length;
      this.status = index;
      return Shape.Repository.O[index];

    } else if (r <= 16) {
      this.type = 'Point';
      index %= Shape.Repository.Point.length;
      this.status = index;
      return Shape.Repository.Point[index];
    }

    // 上面要是都没成功，就返回下面这个吧，保险点
    return [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0]
    ];
  }

  // 旋转方法
  rotate() {
    let currentArr = {};
    switch (this.type) {
      case 'T' : currentArr = Shape.Repository.T; break;
      case 'L' : currentArr = Shape.Repository.L; break;
      case 'Z' : currentArr = Shape.Repository.Z; break;
      case 'S' : currentArr = Shape.Repository.S; break;
      case 'I' : currentArr = Shape.Repository.I; break;
      case 'O' : currentArr = Shape.Repository.O; break;
      case 'Point' : currentArr = Shape.Repository.Point; break;
    }
    let status = this.status + 1;
    if (status > currentArr.length - 1) status = 0;
    // 最后
    this.arr = currentArr[status];
    this.status = status;
    return this;
  }


  // 获取旋转后的数组，不改变实例的属性
  afterRotateArr() {
    let currentArr = {};
    switch (this.type) {
      case 'T' : currentArr = Shape.Repository.T; break;
      case 'L' : currentArr = Shape.Repository.L; break;
      case 'Z' : currentArr = Shape.Repository.Z; break;
      case 'S' : currentArr = Shape.Repository.S; break;
      case 'I' : currentArr = Shape.Repository.I; break;
      case 'O' : currentArr = Shape.Repository.O; break;
      case 'Point' : currentArr = Shape.Repository.Point; break;
    }
    let status = this.status + 1;
    if (status > currentArr.length - 1) status = 0;
    // 直接返回,
    return currentArr[status];
  }





  //随机创建一个四格方块并返回
  static getInstance() {
    return new Shape();
  }

  static Repository = {
    T: [
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 1]],      
      [[0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0]],      
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 1, 0]],      
      [[0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 1, 0]]
    ],
    L: [
      [[0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0]],      
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 1, 1, 0]],      
      [[0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]],      
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 0, 0]]
    ],
    Z: [
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1]],      
      [[0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0]]
    ],
    S: [
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 1, 0]],      
      [[0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0]]
    ],
    I: [
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]],      
      [[0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]]
    ],
    O: [
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0]]
    ],
    Point: [
      [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 1, 0]]
    ]

  };

}
