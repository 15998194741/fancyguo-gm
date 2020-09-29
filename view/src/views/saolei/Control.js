export default {

  /**
   *  判断是否可以下落
   * @param arr 主游戏区内具体状态 (二维数组)
   * @param currentShape  当前游戏区正在下降的四格方块的信息
   */
  allowableDrop(arr, currentShape) {
    let low = currentShape.row;
    let col = currentShape.col;
    // console.log(arr);
    // console.log(currentShape);
    for (let i = 0; i < currentShape.arr.length; i++) {
      for (let j = 0; j < currentShape.arr[0].length; j++) {
        // console.log(i + "," + j + '=' +  currentShape.arr[i][j])
        if (currentShape.arr[i][j] == 1) {
          //如果有处于主游戏区最底行的，直接返回
          if ((low - currentShape.arr.length + i + 1) >= (arr.length - 1)) return false;

          if (i === currentShape.arr.length - 1) { // 如果此小格处于此四格方块最底行
            // console.log(i+','+j);
            // console.log(arr[low+1][j]);
            if ((low + 1) >= 0 && arr[low + 1][col + j] == 1) return false;
          } else { // 不在最底行
            if (currentShape.arr[i + 1][j] != 1 &&
              (low - currentShape.arr.length + i + 2) >= 0 &&
              arr[low - currentShape.arr.length + i + 2][col + j] == 1) return false;
          }
        }
        // for-end
      }
      // for-end
    }
    return true;
  },

  /**
   *  判断是否可以左移
   * @param arr 主游戏区内具体状态 (二维数组)
   * @param currentShape  当前游戏区正在下降的四格方块的信息
   */
  allowableLeft(arr, currentShape) {
    let low = currentShape.row;
    let col = currentShape.col;
    for (let i = 0; i < currentShape.arr.length; i++) {
      for (let j = 0; j < currentShape.arr[0].length; j++) {
        if (currentShape.arr[i][j] == 1) {
          console.log(i + ',' + j);
          console.log(currentShape);
          //如果到达左侧边缘，直接返回
          if (col + j <= 0) return false;
          // 如果刚下落还在屏幕以上部分，则只有不超过左边界都可以左移动
          if (low - currentShape.arr.length + i + 1 < 0 && col + j - 1 >= 0) continue;
          if (j == 0) { // 如果此小格处于此四格方块最左侧
            if (arr[low - currentShape.arr.length + i + 1][col + j - 1] == 1) return false;
          } else { // 不在最左侧
            if (currentShape.arr[i][j - 1] != 1 &&
              arr[low - currentShape.arr.length + i + 1][col + j - 1] == 1) return false;
          }
        }
        // for-end
      }
      // for-end
    }
    return true;
  },

  /**
   *  判断是否可以右移
   * @param arr 主游戏区内具体状态 (二维数组)
   * @param currentShape  当前游戏区正在下降的四格方块的信息
   */
  allowableRight(arr, currentShape) {
    let low = currentShape.row;
    let col = currentShape.col;
    for (let i = 0; i < currentShape.arr.length; i++) {
      for (let j = 0; j < currentShape.arr[0].length; j++) {
        if (currentShape.arr[i][j] == 1) {
          //如果到达右侧边缘，直接返回
          if (col + j >= arr[0].length - 1) return false;
          // 如果刚下落还在屏幕以上部分，则只有不超过右边界都可以左移动
          if (low - currentShape.arr.length + i + 1 < 0 && col + j + 1 <= arr[0].length - 1) continue;
          if (j == currentShape.arr[0].length - 1) { // 如果此小格处于此四格方块最右侧
            if (arr[low - currentShape.arr.length + i + 1][col + j + 1] == 1) return false;
          } else { // 不在最右侧
            if (currentShape.arr[i][j + 1] != 1 &&
              arr[low - currentShape.arr.length + i + 1][col + j + 1] == 1) return false;
          }
        }
        // for-end
      }
      // for-end
    }
    return true;
  },

  /**
   *  判断是否可以旋转
   * @param arr 主游戏区内具体状态 (二维数组)
   * @param currentShape  当前游戏区正在下降的四格方块的信息
   */
  allowableRotate(arr, currentShape) {
    let beforeChange = currentShape.arr; //改变前的数组
    let afterChange = currentShape.afterRotateArr(); //改变后的数组
    console.log(beforeChange);
    console.log(afterChange);

    for (let i = 0; i < afterChange.length; i++) {
      for (let j = 0; j < afterChange[0].length; j++) {
        console.log(1);
        if (afterChange[i][j] == 1 && beforeChange[i][j] != 1) {
          let x = currentShape.row - beforeChange.length + i + 1; // i 对应在主界面的 行
          let y = currentShape.col + j; // j 对应在主界面的 列

          console.log(2);
          console.log(x + ',' + y);
          if (y >= 0 && y <= arr[0].length - 1 && x <= arr.length - 1) { //在界内 (左右之间，底边之上，上边不限制)
            if (x >= 0 && arr[x][y] == 1) return false;
          } else { // 在界外
            console.log(3);
            return false;
          }

        }

      }

      // for-end
    }
    // for-end
    console.log(4);
    return true;
  }

};
