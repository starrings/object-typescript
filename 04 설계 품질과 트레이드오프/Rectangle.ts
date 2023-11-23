class Rectangle {
  private left: number;
  private top: number;
  private right: number;
  private bottom: number;

  constructor(left: number, top: number, right: number, bottom: number) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }

  // 문제점
  // 1. Rectangle 변경이 필요한 곳에서 중복 코드 발생
  // 2. 수정에 취약
  // 클래스의 인스턴스가 메서드를 통해 노출됨
  // length와 height를 사용하도록 수정하면 관련 메서드와 메서드를 사용하는 코드 모두 변경 필요
  public getLeft(): number {
    return this.left;
  }

  public setLeft(left: number) {
    this.left = left;
  }

  public getTop(): number {
    return this.top;
  }

  public setTop(top: number) {
    this.top = top;
  }

  public getRight(): number {
    return this.right;
  }

  public setRight(right: number) {
    this.right = right;
  }

  public getBottom(): number {
    return this.bottom;
  }

  public setBottom(bottom: number) {
    this.bottom = bottom;
  }

}