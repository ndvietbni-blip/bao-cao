// Mã hóa tệp văn bản đến bằng "mật khẩu xem", đúng khuôn dạng của app Báo cáo điều hành
// (AES-GCM 256, khóa PBKDF2-SHA256 250000 vòng; trường du = bản mã + 16 byte xác thực, mã base64).
// Dùng:  MAT_KHAU_XEM=... node cong-cu/ma-hoa-van-ban-den.mjs <tệp-vào.json> <tệp-ra.json>
// Nếu tệp ra đã có và nội dung giải mã ra y hệt thì không ghi lại (trả mã 0, in "KHONG-DOI").
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const LAP = 250000;
const [, , vao, ra] = process.argv;
const mk = process.env.MAT_KHAU_XEM || '';
if (!vao || !ra) { console.error('Thiếu tham số: <tệp-vào> <tệp-ra>'); process.exit(2); }
if (mk.length < 8) { console.error('Chưa có MAT_KHAU_XEM (hoặc quá ngắn).'); process.exit(2); }

const txt = readFileSync(vao, 'utf8');
try { const d = JSON.parse(txt); if (!d || !Array.isArray(d.van_ban) || !d.phien_ban) throw new Error('thiếu phien_ban/van_ban'); }
catch (e) { console.error('Tệp văn bản đến không hợp lệ: ' + e.message); process.exit(3); }

const khoa = salt => pbkdf2Sync(Buffer.from(mk, 'utf8'), salt, LAP, 32, 'sha256');

function giaiMa(o) {
  const buf = Buffer.from(o.du, 'base64');
  const d = createDecipheriv('aes-256-gcm', khoa(Buffer.from(o.salt, 'base64')), Buffer.from(o.iv, 'base64'));
  d.setAuthTag(buf.subarray(buf.length - 16));
  return Buffer.concat([d.update(buf.subarray(0, buf.length - 16)), d.final()]).toString('utf8');
}

if (existsSync(ra)) {
  try { if (giaiMa(JSON.parse(readFileSync(ra, 'utf8'))) === txt) { console.log('KHONG-DOI'); process.exit(0); } } catch { /* tệp cũ lỗi hoặc đổi mật khẩu: ghi mới */ }
}

const salt = randomBytes(16), iv = randomBytes(12);
const c = createCipheriv('aes-256-gcm', khoa(salt), iv);
const ct = Buffer.concat([c.update(txt, 'utf8'), c.final(), c.getAuthTag()]);
const out = { maHoa: 'AES-GCM', kdf: 'PBKDF2-SHA256', lap: LAP, salt: salt.toString('base64'), iv: iv.toString('base64'),
  du: ct.toString('base64'), ghiChu: 'Văn bản đến đã khóa bằng mật khẩu – chỉ mở được bằng app Báo cáo điều hành' };
writeFileSync(ra, JSON.stringify(out) + '\n');
console.log('DA-GHI ' + ra);
