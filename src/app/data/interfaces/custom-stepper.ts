export interface CustomStepper {
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onCompleteClick?: () => void;
  onDeleteClick?: () => void;
  onRemoveClick?: () => void;
  currentInd?: number;
  nbreOperation?: number;
  currentData?: any;
  action?: STEPPER_ACTION;
}
export enum STEPPER_ACTION {
  NEXT,
  PREVIOUS,
  DELETE,
  REMOVE,
  COMPLETE
}
