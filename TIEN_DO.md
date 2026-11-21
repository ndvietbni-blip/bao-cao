# TIẾN ĐỘ – App Báo cáo điều hành

> Kho công khai: chỉ ghi chức năng và quyết định. **Không ghi số liệu thật.**

## 1. Chức năng đã có
- **Trang chủ:** 6 biểu tượng, chỉ số chính, nút chuyển phần nhanh ▦, thanh Tab.
- **Cổng mật khẩu** khi mở qua web; mật khẩu xem khóa số liệu; mật khẩu quản trị cho Nhập, Cài đặt, Xuất.
- **Phần 1. Thu NSNN:** A. theo khoản thu, đơn vị (có Hải quan); B. dự toán 99 xã, phường: bản đồ, tìm xã, top 10, lọc theo Thuế cơ sở, mẫu biểu nhập, **màn hình điều hành toàn màn hình**.
- **Phần 2.** Chiến dịch làm sạch MST 03, 06.
- **Phần 3.** Sự hài lòng NNT: A. tiến độ cỡ mẫu (Mẫu 01); B. theo dõi điều hành (Mẫu 02–05).
- **Phần 4.** Kiểm tra tại trụ sở NNT, có tỷ lệ hoàn thành kế hoạch phê duyệt.
- **Phần 5.** Kiểm tra tại trụ sở CQT.
- **Phần 6.** Công tác nợ, đánh giá theo mục tiêu Cục Thuế (8%, 5%).
- **Phần 7.** Tổng hợp đơn vị: sơ đồ bộ máy, chi tiết đơn vị, nhiệm vụ từ văn bản đến, lịch tuần.
- **Văn bản đến:** thẻ số bấm để lọc, Danh sách, Điều hành nhanh, Báo cáo nhanh, Hôm nay cần làm, Lịch họp (có tệp .ics), Lịch hạn, Ma trận ưu tiên, Theo đơn vị, Thống kê; tự kiểm tra 2 phút/lần, báo văn bản mới.
- Chung: xuất Ảnh, PDF, Excel, bản chia sẻ, sao lưu; thu gọn nội dung dài; giao diện điện thoại; đọc số liệu trực tuyến từ Google Drive.

## 2. Nhật ký
- 21/11/2026: **Chuyển mã nguồn về kho này** làm nguồn gốc duy nhất cho mọi máy. Thêm `dong_goi.py`, tác vụ tự đóng gói `dong-goi.yml`, `CLAUDE.md`, `TIEN_DO.md`, `.nojekyll`. Từ nay không tải `index.html`, `van-ban-den.html` lên bằng tay.

## 3. Việc còn lại (người dùng làm trên GitHub)
- [ ] Đóng yêu cầu gộp số 1 (nhánh `claude/cool-pasteur-yjowui`), **không Merge**: bản cũ.
- [ ] Bước 7 trong `huong-dan/HUONG_DAN_TRUC_TUYEN.md`: để Sổ theo dõi báo sang ngay khi có văn bản mới.
- [ ] Ghi lịch gia hạn mã `VANBAN_TOKEN`. Đổi mật khẩu xem thì đổi cả secret `MAT_KHAU_XEM`.

## 4. Cần xác nhận
- Hướng dẫn sử dụng chưa mô tả đủ cổng mật khẩu, Phần 7, Điều hành nhanh, Báo cáo nhanh.
- Khuôn dạng một số trường văn bản đến (trạng thái, lĩnh vực, giờ họp) suy ra từ trang cũ; đối chiếu khi gặp hiển thị sai.
