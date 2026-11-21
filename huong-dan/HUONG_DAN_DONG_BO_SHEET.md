# Lịch họp, Thông tin truyền thông: nối app với Google Sheet "Bản tin nhanh"

## Cách hoạt động
- Sheet **"Bản tin nhanh"** gồm các trang: `Sheet1` (tin do tác vụ đã lên lịch thu thập), `DanhGia` (đánh giá của tác vụ AI – tạo thêm), `LĐ` (lãnh đạo, email), `LichHop`, `Chidao`.
- **Đọc:** tác vụ GitHub **"Lấy tin tức"** 2 giờ/lần đọc Sheet, lấy tin 60 ngày gần nhất, **khóa bằng mật khẩu xem** rồi ghi `tin-tuc.mahoa.json`. App giải mã ngay trên máy.
- **Ghi:** khi lãnh đạo bấm *Lưu phân công* (lịch họp) hoặc *Lưu chỉ đạo* (tin tức), app gửi về Sheet qua một **Google Apps Script** (trang `LichHop`, `Chidao`). App cũng đọc lại ngay để mọi máy cùng thấy.
- Chưa làm bước 2 thì phân công, chỉ đạo **chỉ lưu trên máy** đang dùng (vẫn tạo ảnh, gửi Zalo/mail được).

## Bước 1. Cho tác vụ "Lấy tin tức" đọc Sheet (5 phút)
1. Mở Sheet "Bản tin nhanh" → **Chia sẻ** → *Quyền truy cập chung*: **Bất kỳ ai có đường liên kết – Người xem** (đang để như vậy thì bỏ qua).
2. Sao chép **mã Sheet**: đoạn giữa `/d/` và `/edit` trong link.
3. Trên GitHub, kho `bao-cao` → **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `SHEET_TIN_TUC_ID` · Secret: dán mã Sheet → **Add secret**.
   - Secret `MAT_KHAU_XEM` đã có từ trước (dùng chung).
4. Tab **Actions** → **Lấy tin tức** → **Run workflow**. Khoảng 1 phút sau có tệp `tin-tuc.mahoa.json`; mở app → tab **9. Truyền thông** thấy tin.

> Không đưa mã Sheet, link Sheet vào kho hay vào tệp hướng dẫn (kho công khai). Chỉ để trong secret.

## Bước 2. Cho app ghi phân công, chỉ đạo về Sheet (10 phút)
1. Mở Sheet → **Tiện ích mở rộng → Apps Script**. Xóa mã mẫu, dán toàn bộ nội dung tệp `cong-cu/apps-script-dong-bo.gs` → bấm 💾 Lưu.
2. Bấm ⚙ **Cài đặt dự án** → kéo xuống **Thuộc tính tập lệnh** → **Thêm thuộc tính**:
   - Thuộc tính: `MA_BI_MAT` · Giá trị: một chuỗi ngẫu nhiên **dài ít nhất 20 ký tự** (ví dụ gõ lung tung chữ và số). Lưu.
3. Bấm **Triển khai → Tùy chọn triển khai mới** → biểu tượng ⚙ chọn **Ứng dụng web**:
   - *Thực thi với tư cách*: **Tôi** · *Người có quyền truy cập*: **Bất kỳ ai** → **Triển khai** → cho phép quyền (chọn tài khoản → Nâng cao → Đi tới… → Cho phép).
   - Sao chép **URL ứng dụng web** (kết thúc bằng `/exec`).
4. Mở app (máy quản trị) → ⚙ **Cài đặt** → mục **Đồng bộ Google Sheet**:
   - dán URL và `MA_BI_MAT` → **🔌 Thử kết nối** (thấy "Kết nối được…" là đúng);
   - kéo xuống mục Google Drive → **📄 Tạo file cau_hinh.json** → tải tệp đó lên GitHub **thay tệp cũ** (để mọi máy dùng chung; tệp đã khóa bằng mật khẩu xem).

> Sửa mã Apps Script sau này: **Triển khai → Quản lý các bản triển khai → ✏ → Phiên bản: Mới → Triển khai** (giữ nguyên URL).

## Bước 3. Cho tác vụ AI đánh giá tin (tùy chọn, nên làm)
- Mở tác vụ đã lên lịch thu thập tin, thêm đoạn hướng dẫn trong `huong-dan/tac-vu/danh-gia-tin-tuc.md`.
- Tác vụ ghi kết quả vào trang **`DanhGia`** (mỗi tin một dòng, khớp theo cột `link`). App tự hiện: tóm tắt, căn cứ, trích dẫn, ảnh hưởng đến NNT, việc cơ quan thuế phải làm, đơn vị đề xuất. Tin chưa đánh giá vẫn hiện, gắn nhãn **"sơ bộ"** (phân loại theo từ khóa).

## Kiểm tra
- Trang chủ có nút **🗓 Lịch họp** (số cuộc họp hôm nay, 7 ngày, số cuộc **mới**); thanh trên có nút 🗓 kèm chấm đỏ khi có cuộc họp mới.
- Mở một cuộc họp → chọn lãnh đạo dự, đơn vị chủ trì, ghi chỉ đạo → **Lưu** → mở Sheet trang `LichHop` thấy dòng được cập nhật (các cột *Lãnh đạo chủ trì, Phòng chủ trì, Thành phần tham gia, Trạng thái, Chỉ đạo, Người phân công, Cập nhật lúc*).
- Tab **9. Truyền thông** → mở một tin → **✍ Chỉ đạo** → **Lưu** → trang `Chidao` có dòng mới.
- Nút **📤 Chia sẻ**: trên điện thoại mở bảng chia sẻ (Zalo, Mail…) kèm ảnh; trên máy tính dùng **📋 Sao chép ảnh** rồi dán (Ctrl+V) vào Zalo PC.

## An toàn
- Sheet chỉ cần quyền **xem** bằng link; quyền **ghi** đi qua Apps Script và cần `MA_BI_MAT`.
- `MA_BI_MAT` chỉ nằm trong `cau_hinh.json` **đã khóa bằng mật khẩu xem**. Lộ mật khẩu xem thì đổi cả `MA_BI_MAT` (Thuộc tính tập lệnh) và tạo lại `cau_hinh.json`.
- Apps Script tự chặn ô bắt đầu bằng `= + - @` (chống chèn công thức).
