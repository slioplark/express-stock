# 如何獲取 Bot ID

## 取得 API Token

首先在 BotFather 頻道裡下指令 `/mybots`，然後選擇特定機器人，再選 API Token，以取得 `API_Token`。

## 設置 Webhook

使用剛剛取得的 `API_Token` 用 POST 方法去呼叫 `https://api.telegram.org/bot<API_Token>/setwebhook`

```json
// post data
{
  "url": "https://example.com/api/webhook"
}

// response data
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

## 取得 Chat ID

在聊天機器人頻道上輸入任一字元，並發送以觸發 webhook，最後可從 request 上取得 chat_id

```js
const webhook = async (req, res) => {
  const chatId = req.body.message.chat.id
}
```
