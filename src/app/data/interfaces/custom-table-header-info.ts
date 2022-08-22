export interface CustomTableHeaderInfo {
  title;
  withBtn?; backClick?: () => void;
  btnClick?: () => void;
  withBackBtn?;
  btn?: {
    libelle,
    bg,
    color?
  };
}
