import { notification } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  AppDispatch,
  AppState,
  AppStateSelector,
  Noop
} from "../types/Table.types";

// Utility functions
export const xoaDauVietNam = (value: any) => {
  // Kiểm tra và xử lý các trường hợp value không hợp lệ
  if (value === null || value === undefined) {
    return '';
  }

  // Convert to string if not already
  let str = String(value);

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');

  return str;
};


export const noop: Noop = () => { };

// State management utilities
export function useStates<T extends object>(initialState: T): [T, (state: Partial<T>) => void] {
  const [state, setState] = useState(initialState);
  const setMergedState = (newState: Partial<T>) =>
    setState(prevState => Object.assign({}, prevState, newState));
  return [state, setMergedState];
}

// Internal implementations for external dependencies
let internalAppState: AppState = {
  table: {
    selectedRowKeys: {}
  },
  hideColumns: {}
};

const stateListeners: Array<() => void> = [];

// Internal state management
export const useAppState = <T>(selector: AppStateSelector<T>): T => {
  const [, forceUpdate] = useState({});

  const rerender = () => forceUpdate({});

  useEffect(() => {
    stateListeners.push(rerender);
    return () => {
      const index = stateListeners.indexOf(rerender);
      if (index > -1) {
        stateListeners.splice(index, 1);
      }
    };
  }, []);

  return selector(internalAppState);
};

// Create a dispatch function that doesn't use hooks in callbacks
const createDispatch = (): AppDispatch => {
  return (action: any) => {
    if (typeof action === 'function') {
      return action(createDispatch());
    }

    // Handle internal actions
    if (action.type === 'table/onChangeSelectedRowKeys') {
      const { tableId, selectedRowKeys, selectedRows } = action.payload;
      internalAppState.table.selectedRowKeys = {
        ...internalAppState.table.selectedRowKeys,
        [tableId]: selectedRowKeys
      };

      // Notify all listeners
      stateListeners.forEach(listener => listener());
    }

    return Promise.resolve(action);
  };
};

export const useAppDispatch = (): AppDispatch => {
  return createDispatch();
};

// Action creators
export const onChangeSelectedRowKeys = (payload: {
  tableId: string;
  selectedRowKeys: React.Key[];
  selectedRows: any[];
}) => ({
  type: 'table/onChangeSelectedRowKeys',
  payload
});

// Permission utilities
export const thongBaoQuyenChinhSua = () => {
  notification.warning({
    message: 'Không có quyền chỉnh sửa',
    description: 'Bạn không có quyền thực hiện thao tác này'
  });
};

// Search text hook
export function useSearchText(): [string, (text: string) => void, React.RefObject<any>] {
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef(null);

  return [searchText, setSearchText, searchInput];
}