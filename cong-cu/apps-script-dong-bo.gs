/**
 * ĐỒNG BỘ APP BÁO CÁO ĐIỀU HÀNH ↔ GOOGLE SHEET "Bản tin nhanh"
 * App ghi phân công lãnh đạo dự họp (trang LichHop) và chỉ đạo (trang Chidao); đọc lại danh sách lãnh đạo (LĐ),
 * lịch họp, chỉ đạo để mọi máy cùng thấy.
 *
 * CÀI ĐẶT (làm 1 lần, xem huong-dan/HUONG_DAN_DONG_BO_SHEET.md):
 *  1. Mở Sheet "Bản tin nhanh" → Tiện ích mở rộng → Apps Script → xóa mã mẫu, dán toàn bộ tệp này → Lưu.
 *  2. Cài đặt dự án (bánh răng) → Thuộc tính tập lệnh → Thêm: MA_BI_MAT = một chuỗi ngẫu nhiên dài ≥ 20 ký tự.
 *  3. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web → Thực thi với tư cách: Tôi;
 *     Người có quyền truy cập: Bất kỳ ai → Triển khai → cho phép quyền → sao chép URL (kết thúc bằng /exec).
 *  4. Trong app: ⚙ Cài đặt → Đồng bộ Google Sheet → dán URL và MA_BI_MAT → Thử kết nối → Tạo file cau_hinh.json.
 * Mã bí mật chỉ nằm trong cau_hinh.json đã khóa bằng mật khẩu xem – người không có mật khẩu xem không gọi được.
 */
const TRANG = { LD: 'LĐ', HOP: 'LichHop', CD: 'Chidao' };
const TZ = 'Asia/Ho_Chi_Minh';

function doGet() { return traVe({ ok: false, loi: 'Hãy gọi bằng app Báo cáo điều hành.' }); }

function doPost(e) {
  let yc;
  try { yc = JSON.parse(e.postData.contents); } catch (x) { return traVe({ ok: false, loi: 'Yêu cầu không đúng khuôn dạng.' }); }
  const ma = PropertiesService.getScriptProperties().getProperty('MA_BI_MAT') || '';
  if (ma.length < 20) return traVe({ ok: false, loi: 'Apps Script chưa đặt MA_BI_MAT (ít nhất 20 ký tự) trong Thuộc tính tập lệnh.' });
  if (!yc || yc.ma !== ma) { Utilities.sleep(800); return traVe({ ok: false, loi: 'Sai mã bí mật đồng bộ.' }); }
  try {
    if (yc.loai === 'doc') return traVe(docTatCa());
    const khoa = LockService.getDocumentLock(); khoa.waitLock(20000);
    try {
      if (yc.loai === 'hop') return traVe(ghiHop(yc.du || {}, yc.nguoi));
      if (yc.loai === 'chidao') return traVe(ghiChiDao(yc.du || {}, yc.nguoi));
    } finally { khoa.releaseLock(); }
    return traVe({ ok: false, loi: 'Không rõ yêu cầu: ' + yc.loai });
  } catch (x) { return traVe({ ok: false, loi: 'Lỗi Apps Script: ' + x.message }); }
}

function traVe(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function trang(ten) { const s = SpreadsheetApp.getActive().getSheetByName(ten); if (!s) throw new Error('Không thấy trang "' + ten + '"'); return s; }
function boDau(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim(); }
/* Giá trị ô → chữ (ngày dd/MM/yyyy, giờ HH:mm) */
function chu(v) {
  if (v instanceof Date) return v.getFullYear() < 1901 ? Utilities.formatDate(v, TZ, 'HH:mm') : Utilities.formatDate(v, TZ, 'dd/MM/yyyy');
  return v == null ? '' : String(v);
}
/* Chống chèn công thức: ô bắt đầu bằng = + - @ thì thêm dấu ' */
function an(v) { let s = String(v == null ? '' : v).slice(0, 3000); if (/^[=+\-@]/.test(s)) s = "'" + s; return s; }
function docTrang(ten) {
  const s = SpreadsheetApp.getActive().getSheetByName(ten); if (!s || s.getLastRow() < 1) return [];
  const v = s.getDataRange().getValues(); const h = v[0].map(chu);
  return v.slice(1).filter(r => r.some(c => c !== '' && c != null)).map(r => { const o = {}; h.forEach((k, j) => { if (k) o[k] = chu(r[j]); }); return o; });
}
function docTatCa() {
  const gioiHan = new Date(); gioiHan.setDate(gioiHan.getDate() - 90);
  const hop = docTrang(TRANG.HOP).filter(o => { const k = Object.keys(o).find(x => boDau(x) === 'ngay hop'); const m = k && String(o[k]).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); return !m || new Date(+m[3], +m[2] - 1, +m[1]) >= gioiHan; });
  return { ok: true, lanh_dao: docTrang(TRANG.LD), lich_hop: hop, chi_dao: docTrang(TRANG.CD).slice(-500) };
}
/* Cột theo tên (thiếu thì thêm vào cuối hàng tiêu đề) */
function cot(s, ten, them) {
  const n = Math.max(1, s.getLastColumn()); const h = s.getRange(1, 1, 1, n).getValues()[0].map(chu);
  let i = h.findIndex(x => boDau(x) === boDau(ten));
  if (i < 0 && them) { i = h.length; s.getRange(1, i + 1).setValue(ten); }
  return i < 0 ? -1 : i + 1;
}
function ghiHop(d, nguoi) {
  const s = trang(TRANG.HOP);
  ['Mã cuộc họp', 'Chỉ đạo', 'Người phân công', 'Cập nhật lúc'].forEach(t => cot(s, t, true));
  const C = t => cot(s, t, true);
  const n = s.getLastRow(); const v = n > 1 ? s.getRange(2, 1, n - 1, s.getLastColumn()).getValues() : [];
  const cMa = C('Mã cuộc họp'), cVB = C('Văn bản họp'), cNgay = C('Ngày họp');
  const so = boDau(d.van_ban).replace(/[^a-z0-9\/]/g, '');
  let dong = v.findIndex(r => String(r[cMa - 1]) === String(d.ma_hop));
  if (dong < 0) dong = v.findIndex(r => so && boDau(r[cVB - 1]).replace(/[^a-z0-9\/]/g, '') === so && chu(r[cNgay - 1]) === d.ngay);
  let hang;
  if (dong < 0) { hang = Math.max(2, n + 1); const cStt = cot(s, 'Số thứ tự', false); if (cStt > 0) s.getRange(hang, cStt).setValue(v.length + 1); }
  else hang = dong + 2;
  const neuTrong = (t, gt) => { const c = C(t); const r = s.getRange(hang, c); if (!String(r.getValue()) && gt) r.setValue(an(gt)); };
  const dat = (t, gt) => s.getRange(hang, C(t)).setValue(an(gt));
  neuTrong('Văn bản họp', d.van_ban); neuTrong('Ngày văn bản', d.ngay_van_ban); neuTrong('Nơi phát hành', d.noi_phat_hanh); neuTrong('Nội dung cuộc họp', d.noi_dung);
  neuTrong('Giờ họp', d.gio); neuTrong('Ngày họp', d.ngay); neuTrong('Địa điểm', d.dia_diem); neuTrong('Link Giấy mời', d.link_gm);
  dat('Mã cuộc họp', d.ma_hop); dat('Lãnh đạo chủ trì', d.lanh_dao); dat('Phòng chủ trì', d.phong_chu_tri); dat('Thành phần tham gia', d.thanh_phan);
  dat('Trạng thái', d.trang_thai); dat('Chỉ đạo', d.chi_dao); dat('Người phân công', d.nguoi || nguoi); dat('Cập nhật lúc', d.luc || new Date().toISOString());
  return { ok: true, hang: hang };
}
function ghiChiDao(d, nguoi) {
  const s = trang(TRANG.CD);
  ['stt', 'Lãnh đạo chỉ đạo', 'Văn bản\\bài báo gốc', 'Nội dung chỉ đạo', 'Đơn vị chủ trì', 'Đơn vị phối hợp', 'Hạn thực hiện', 'Link đính kèm', 'Đơn vị đã tiếp nhận', 'Đơn vị đã hoàn thành', 'Báo cáo kết quả', 'Thời gian giao', 'Phụ trách'].forEach(t => cot(s, t, true));
  const hang = s.getLastRow() + 1; const dat = (t, gt) => s.getRange(hang, cot(s, t, true)).setValue(an(gt));
  dat('stt', d.stt); dat('Lãnh đạo chỉ đạo', d.lanh_dao); dat('Văn bản\\bài báo gốc', d.goc); dat('Nội dung chỉ đạo', d.noi_dung); dat('Đơn vị chủ trì', d.chu_tri);
  dat('Đơn vị phối hợp', d.phoi_hop); dat('Hạn thực hiện', d.han); dat('Link đính kèm', d.link); dat('Thời gian giao', d.thoi_gian); dat('Phụ trách', d.phu_trach || nguoi);
  return { ok: true, hang: hang };
}
