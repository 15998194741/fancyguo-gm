
export function loading(e) {
  e.$loading({
    lock: true,
    text: '拼命加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.8)'
  });
}
export function close(e) {
  e.$loading().close();
}


export async function secondConfirmation(e, msg) {
  return await e.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning' })
    .catch(err => false);
}



