type swipeActionType =
  | 'onLeftSwipe'
  | 'onRightSwipe'
  | 'onTopSwipe'
  | 'onBottomSwipe';

export class SwipeManager {
  private startX: number = 0;
  private startY: number = 0;
  private swipeMinRange: number = 100;
  private subscribers: Map<swipeActionType, () => void> = new Map();
  disableActionType: swipeActionType | null = null;

  constructor() {
    this.addListeners();
  }

  addListeners() {
    document.addEventListener('mousedown', this.onStartSwipeHandler);
    document.addEventListener('touchstart', this.onStartSwipeHandler);
    document.addEventListener('mouseup', this.onEndSwipeHandler);
    document.addEventListener('touchend', this.onEndSwipeHandler);
  }

  private onStartSwipeHandler = (e: MouseEvent | TouchEvent) => {
    this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  };

  private onEndSwipeHandler = (e: MouseEvent | TouchEvent) => {
    const endX =
      e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;
    const endY =
      e instanceof MouseEvent ? e.clientY : e.changedTouches[0].clientY;
    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    const isHorizonSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isVerticalSwipe = Math.abs(deltaX) < Math.abs(deltaY);
    const isInSwipeRange =
      Math.abs(deltaX) > this.swipeMinRange ||
      Math.abs(deltaY) > this.swipeMinRange;
    let action: swipeActionType | null = null;
    if (isInSwipeRange) {
      if (isHorizonSwipe) {
        if (deltaX > 0) {
          action = 'onRightSwipe';
        } else {
          action = 'onLeftSwipe';
        }
      } else if (isVerticalSwipe) {
        if (deltaY > 0) {
          action = 'onBottomSwipe';
        } else {
          action = 'onTopSwipe';
        }
      }
      this.launchSubscriberFunctions(action!);
    }
  };

  removeListener() {
    document.removeEventListener('mousedown', this.onStartSwipeHandler);
    document.removeEventListener('touchstart', this.onStartSwipeHandler);
    document.removeEventListener('mouseup', this.onEndSwipeHandler);
    document.removeEventListener('touchend', this.onEndSwipeHandler);
  }

  subscribeOnLeftSwipe(func: () => void, context: any = null) {
    this.subscribeOnAction('onLeftSwipe', func, context);
  }

  subscribeOnRightSwipe(func: () => void, context: any = null) {
    this.subscribeOnAction('onRightSwipe', func, context);
  }

  subscribeOnTopSwipe(func: () => void, context: any = null) {
    this.subscribeOnAction('onTopSwipe', func, context);
  }

  subscribeOnBottomSwipe(func: () => void, context: any = null) {
    this.subscribeOnAction('onBottomSwipe', func, context);
  }

  private subscribeOnAction(
    actionName: swipeActionType,
    func: () => void,
    context: any
  ) {
    const bindFunc = func.bind(context);
    this.subscribers.set(actionName, bindFunc);
  }

  private launchSubscriberFunctions(actionName: swipeActionType) {
    const actionFunction = this.subscribers.get(actionName);
    if (actionFunction !== undefined && actionName !== this.disableActionType) {
      actionFunction();
    }
  }

  ableOnTopSwipe() {
    this.disableActionType = null;
  }

  disableOnTopSwipe() {
    this.disableActionType = 'onTopSwipe';
  }
}
