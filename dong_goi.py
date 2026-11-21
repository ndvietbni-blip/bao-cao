# -*- coding: utf-8 -*-
"""Đóng gói app Báo cáo điều hành từ mã nguồn trong nguon/.

Tạo 2 tệp ở thư mục gốc của kho (GitHub Pages phục vụ trực tiếp):
  index.html        app, gộp sẵn SheetJS, ECharts, html2canvas, jsPDF, phông Be Vietnam Pro, bản đồ 99 xã
  van-ban-den.html  trang Văn bản đến

Chạy:  cd thu-vien && npm ci --ignore-scripts && cd .. && python dong_goi.py
Trên GitHub, tác vụ .github/workflows/dong-goi.yml tự chạy khi mã nguồn trên nhánh main thay đổi.
"""
import base64
import pathlib
import sys

GOC = pathlib.Path(__file__).resolve().parent
NGUON = GOC / "nguon"
NM = GOC / "thu-vien" / "node_modules"
THU_VIEN = {
    "xlsx": NM / "xlsx/dist/xlsx.full.min.js",
    "echarts": NM / "echarts/dist/echarts.min.js",
    "html2canvas": NM / "html2canvas/dist/html2canvas.min.js",
    "jspdf": NM / "jspdf/dist/jspdf.umd.min.js",
}
FONT_DIR = NM / "@fontsource/be-vietnam-pro/files"
VBDC = NGUON / "van_ban_den_chung.js"


def doc(p):
    return p.read_text(encoding="utf-8")


def ghi(p, noi_dung):
    # luôn xuống dòng kiểu LF để đóng gói ở máy nào cũng ra đúng một kết quả
    p.write_text(noi_dung, encoding="utf-8", newline="\n")
    print(f"Đã tạo {p.name} ({p.stat().st_size / 1024 / 1024:.2f} MB)")


def font_css():
    out = []
    for w in (400, 600, 700):
        for subset, rng in (("vietnamese", "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB"),
                            ("latin", "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD")):
            f = FONT_DIR / f"be-vietnam-pro-{subset}-{w}-normal.woff2"
            b64 = base64.b64encode(f.read_bytes()).decode()
            out.append("@font-face{font-family:'Be Vietnam Pro';font-style:normal;font-display:swap;"
                       f"font-weight:{w};src:url(data:font/woff2;base64,{b64}) format('woff2');unicode-range:{rng}}}")
    return "<style>\n" + "\n".join(out) + "\n</style>"


def gan_vbdc(html, ten):
    ma = "/*@@VBDC@@*/"
    assert html.count(ma) == 1, f"{ten}: thiếu ô {ma}"
    return html.replace(ma, doc(VBDC).replace("</script", "<\\/script"))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    for p in [*THU_VIEN.values(), FONT_DIR]:
        if not p.exists():
            sys.exit(f"Thiếu thư viện: {p}. Hãy chạy: cd thu-vien && npm ci --ignore-scripts")
    html = doc(NGUON / "dieu_hanh.src.html")
    html = html.replace("<!--@@FONT@@-->", font_css())
    html = gan_vbdc(html, "dieu_hanh.src.html")
    ban_do = doc(NGUON / "ban_do_99_xa.json").replace("</", "<\\/")
    assert '"@@BANDO@@"' in html
    html = html.replace('"@@BANDO@@"', ban_do)
    for ten, p in THU_VIEN.items():
        js = doc(p).replace("</script", "<\\/script").replace("//# sourceMappingURL=", "//")
        ma = f"/*@@LIB:{ten}@@*/"
        assert ma in html, ma
        html = html.replace(ma, f"\n/* {ten} – {p.name} */\n" + js + "\n")
    ghi(GOC / "index.html", html)
    ghi(GOC / "van-ban-den.html", gan_vbdc(doc(NGUON / "van-ban-den.html"), "van-ban-den.html"))


if __name__ == "__main__":
    main()
