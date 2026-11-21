# Dùng app Báo cáo điều hành trên nhiều máy, một nguồn gốc duy nhất

## 1. Nguyên tắc: mỗi loại dữ liệu chỉ có MỘT nơi gốc

| Loại | Nơi gốc duy nhất | Máy nào cũng dùng bằng cách |
|---|---|---|
| **Mã nguồn app** (giao diện, chức năng) | GitHub, kho `tpbacninh-baocao/bao-cao`, nhánh `main` | Mở phiên Claude trên kho này |
| **Số liệu báo cáo** | Google Drive, tệp `Sao_luu_bao_cao_dieu_hanh.json` | Mở link app |
| **Văn bản đến** | Kho riêng tư `theo-doi-van-ban` | Tự về trang Văn bản đến |
| **Mật khẩu, mã truy cập** | GitHub Secrets và trình quản lý mật khẩu | Không ghi vào kho, không ghi vào tệp |

Máy tính chỉ là nơi **làm việc**, không phải nơi **lưu gốc**.

## 2. Dùng hằng ngày, ở bất kỳ máy nào

**Xem, nhập số liệu**
1. Mở **link app** (không mở tệp HTML lưu trên máy), nhập mật khẩu.
2. Bấm **↻ Lấy số mới** trước khi nhập.
3. **⬆ Nhập** biểu Excel → **💾 Lưu thay đổi**.
4. **⬇ Xuất → ☁ Xuất file cho Google Drive** → lưu đè tệp trên Drive.

Mỗi lúc chỉ một người nhập. Lỡ ghi đè thì khôi phục ở **Quản lý phiên bản** của tệp trên Drive.

**Nâng cấp, sửa app**
1. Mở Claude → mục Code → chọn môi trường **đám mây** → chọn kho **`tpbacninh-baocao/bao-cao`**.
2. Mỗi việc mở một phiên mới và nêu yêu cầu. Claude tự đọc `CLAUDE.md`, `TIEN_DO.md`.
3. Kết thúc bằng câu: **"Cập nhật TIEN_DO.md rồi đẩy lên main."**
4. Đợi khoảng 2 phút (GitHub tự đóng gói, tự đăng), mở link app, bấm Ctrl + F5 để kiểm tra.

Phiên đám mây không đọc được ổ `G:\`, `E:\` của máy: cần biểu mẫu nào thì đính kèm vào tin nhắn.

**Nếu muốn làm bằng phiên trên máy**: dùng bản sao của kho `bao-cao`, **không** dùng thư mục `C:\ung-dung-dieu-hanh\cong-cu\dashboard-khao-sat` (bản cũ). Trước khi làm, nói "lấy bản mới nhất từ GitHub"; làm xong, nói "đẩy lên main".

## 3. Bốn điều cần nhớ

1. Việc chỉ coi là xong khi **đã lên nhánh `main`**. Nằm trên nhánh `claude/...` là chưa xong.
2. **Không tải `index.html`, `van-ban-den.html` lên bằng tay nữa**: GitHub tự tạo từ mã nguồn, tải tay sẽ bị đè ở lần đóng gói sau.
3. Không sửa cùng một chức năng ở 2 phiên cùng lúc.
4. Không đưa số liệu thật, mã số thuế, mật khẩu, khóa API vào kho (kho đang công khai).

## 4. Khi có trục trặc

- **Sửa xong mà link chưa đổi:** mở mục **Actions** của kho, xem "Đóng gói app" và "pages build and deployment" có dấu ✓ xanh không. Có dấu ✗ đỏ thì mở phiên Claude trên kho, nhờ xem lỗi.
- **Muốn quay lại bản trước:** mở phiên Claude trên kho, nói "khôi phục app về bản ngày …".
