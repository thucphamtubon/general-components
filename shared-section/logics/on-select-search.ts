import { xoaDauVietNam } from "./xoa-dau-viet-nam";

export const onSelectSearch = (inputValue: string, option: any): boolean => {
  const parent = xoaDauVietNam(option?.searchValue || option?.label);

  const children = xoaDauVietNam(inputValue);

  return parent.indexOf(children) >= 0;
};
