const on = 'ON';
const pageEditable = (isEditable) => {
  // 允许编辑，顺带允许复制粘贴
  document.body.contentEditable = isEditable;
}

const ban_list = ["chrome://", "edge://", "chrome.google.com/webstore", "microsoftedge.microsoft.com/addons/"]

chrome.action.onClicked.addListener(async (tab) => {
  // 由于浏览器限制，不能访问这些开头的链接
  const check_list = ban_list.map(str => tab.url.includes(str));
  const check_result = check_list.reduce((prev, curr) => prev || curr);
  if (check_result) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon/v1.2@4x.png',
      title: chrome.i18n.getMessage("banTitle"),
      message: chrome.i18n.getMessage("banMessage"),
      priority: 0
    })
  } else {
    let text = await chrome.action.getBadgeText({ tabId: tab.id });
    text = text ? text : '';

    let isEditable = text === on;
    if (isEditable) {
      text = ''
    } else {
      text = on;
    }
    isEditable = !isEditable;

    chrome.action.setBadgeText({ tabId: tab.id, text: text });
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
        allFrames: true,

      },
      function: pageEditable,
      args: [isEditable]
    });
  }
});
