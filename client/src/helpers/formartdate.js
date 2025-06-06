export function formatDateIsoString(isoString) {
  const date = new Date(isoString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatDateToYYYYMMDD(ngayThangNam) {
  var parts = ngayThangNam.split('/');
  var ngay = parts[0];
  var thang = parts[1];
  var nam = parts[2];
  var namThangNgay = nam + '-' + thang + '-' + ngay;
  return namThangNgay;
}

