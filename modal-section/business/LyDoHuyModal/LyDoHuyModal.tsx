import { InputModal } from '../../components/InputModal'

/**
 * LyDoHuyModal
 * Wrapper xung quanh InputModal để tái sử dụng cho việc nhập lý do huỷ phiếu.
 * Giúp chuẩn hoá nội dung và giảm lặp code.
 */
const LyDoHuyModal = {
  /**
   * Hiển thị modal nhập lý do huỷ
   * @param onOk Callback nhận giá trị lý do huỷ
   */
  show: (onOk: (lyDo: string) => Promise<void> | void) => {
    InputModal.show({
      title: 'Hủy phiếu',
      // label: 'Nhập lý do',
      placeholder: 'Nhập lý do',
      required: true,
      textArea: true,
      rows: 3,
      onOk
    })
  }
}

export default LyDoHuyModal