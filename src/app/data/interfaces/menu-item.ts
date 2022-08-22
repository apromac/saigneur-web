export interface MenuItem {
  parentId?: string;
  id?: string;
  name?: string;
  icon?: string;
  url?: string;
  divided?: boolean;
  variant?: string;
  badge?: {
    variant?: string,
    text?: string
  };
  attributes?: { target?: string, rel?: string, disabled?: boolean };
  isChecked?: boolean;
  hasSubMenu?: boolean;
  children?: MenuItem[];
}
