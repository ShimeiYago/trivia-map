# API Interface

## Markers API
### (GET) `/markers?page=${pageIndex}`
**- (200) Success Response Body**

if end of pages, `nextPageIndex` is null.

```
{
  totalPages: 2,
  nextPageIndex: 2,
  markers: [
    {
      postId: '000',
      position: {
        lat: 22.27,
        lng: 29.268,
      },
      title: 'ノーチラス号',
      thumbnailImgUrl: "https://www.disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800-150x150.jpg"
    },
    {
      postId: '001',
      position: {
        lat: 30.524,
        lng: 15.908,
      },
      title: '削岩機'
    },
  ]
}
```

**- (401) Error Response Body**
```
{
  "error": "Unauthorized."
}
```

**- (400) Error Response Body**
```
{
  "error": "Bad Request."
}
```

**- (500) Error Response Body**
```
{
  "error": "Internal server error."
}
```


## Articles API
### (GET) `/articles/${postId}`
**- (200) Success Response Body**
```
{
  "title": "title,
  "contents": "contents",
  "position": { lat: 1.1, lng: 1.5 },
  "imageDataUrl": "https://www.disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800.jpg",
  "userId": "000",
  "userName": "Axel"
  "createdAt": "2022/4/1",
  "updatedAt": "2022/5/1"
}
```

**- (404) Error Response Body**
```
{
  "error": "The article does not exist."
}
```

**- (400) Error Response Body**
```
{
  "error": "Bad Request."
}
```

**- (500) Error Response Body**
```
{
  "error": "Internal server error."
}
```

### (POST) `/articles`
**- Resquest Body**
```
{
  "title": "title,
  "contents": "contents",
  "position": { lat: 1.1, lng: 1.5 },
  "imageDataUrl": "https://www.disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800.jpg"
}
```

**- (200) Success Response Body**
```
{
  "postId": "100"
}
```

**- (422) Error Response Body**
```
{
  "headerErrors": ["タイトルは必須です。"],
  "fieldErrors": {
    title: "タイトルを入力してください。"
  }
}
```

**- (401) Error Response Body**
```
{
  "error": "Unauthorized."
}
```

**- (400) Error Response Body**
```
{
  "error": "Bad Request."
}
```

**- (500) Error Response Body**
```
{
  "error": "Internal server error."
}
```

### (PUT) `/articles/${postId}`
**- Resquest Body**

Same as "POST"

**- (200) Success Response Body**

Same as "POST"

**- (422) Error Response Body**

Same as "POST"

**- (404) Error Response Body**
```
{
  "error": "The article does not exist."
}
```

**- (401) Error Response Body**

Same as "POST"

**- (400) Error Response Body**

Same as "POST"

**- (500) Error Response Body**

Same as "POST"

### (DELETE) `/articles/${postId}`
**- (200) Success Response Body**
```
{
  "postId": "100"
}
```

**- (404) Error Response Body**
```
{
  "error": "The article does not exist."
}
```

**- (400) Error Response Body**
```
{
  "error": "Bad Request."
}
```

**- (500) Error Response Body**
```
{
  "error": "Internal server error."
}
```
