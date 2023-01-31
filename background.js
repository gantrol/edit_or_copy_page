const on = 'ON';
const pageEditable = (isEditable) => {
  // 允许编辑，顺带允许复制粘贴
  document.body.contentEditable = isEditable;
}

chrome.action.onClicked.addListener(async (tab) => {
  // 由于浏览器限制，不能访问这些开头的链接
  if (!(tab.url.includes("chrome://") || tab.url.includes("edge://"))) {
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
