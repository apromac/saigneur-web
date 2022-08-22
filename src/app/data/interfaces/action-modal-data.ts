export interface ActionModalData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  warningYesTitle?: string;
  warningNoTitle?: string;
  actions: {
    success?: () => void,
    error?: () => void,
    warning?: {
      yes: () => void,
      no: () => void
    },
    info?: () => void,
  };
}
