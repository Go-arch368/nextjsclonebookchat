// Announcments API's 

// https://zotly.onrender.com/settings/announcements/save
//   {
//   "userId": 1,
//   "pageType": "Login",
//   "title": "Welcome Announcement",
//   "text": "Welcome to our platform!",
//   "imageUrl": "http://example.com/image.jpg",
//   "createdAt": "2025-07-29T17:33:00",
//   "updatedAt": "2025-07-29T17:33:00"
// }

//this is the post data 

// https://zotly.onrender.com/settings/announcements/update
// https://zotly.onrender.com/settings/announcements/get/1
// https://zotly.onrender.com/settings/announcements/delete/1
// https://zotly.onrender.com/settings/announcements/clear
// https://zotly.onrender.com/settings/announcements/list

// [
//     {
//         "id": 2,
//         "userId": 1,
//         "pageType": "Login",
//         "title": "Welcome Announcement",
//         "text": "Welcome to our platform!",
//         "imageUrl": "http://example.com/image.jpg",
//         "createdAt": "2025-07-29T17:33:00",
//         "updatedAt": "2025-07-29T17:33:00"
//     }
// ]

//this is the get data right
// https://zotly.onrender.com/settings/announcements/clear



//Default Avatar: 


// https://zotly.onrender.com/settings/default-avatars/save


//  {
//   "userId": 1,
//   "name": "John Doe",
//   "jobTitle": "Developer",
//   "avatarImageUrl": "http://example.com/avatar.jpg",
//   "createdAt": "2025-07-29T17:33:00",
//   "updatedAt": "2025-07-29T17:33:00"
// }

// https://zotly.onrender.com/settings/default-avatars/update
// https://zotly.onrender.com/settings/default-avatars/get/1
// https://zotly.onrender.com/settings/default-avatars/delete/1
// https://zotly.onrender.com/settings/default-avatars/clear
// https://zotly.onrender.com/settings/default-avatars/list

//this data is for save data right 

// [
//     {
//         "id": 2,
//         "userId": 1,
//         "name": "John Doe",
//         "jobTitle": "Developer",
//         "avatarImageUrl": "http://example.com/avatar.jpg",
//         "createdAt": "2025-07-29T17:33:00",
//         "updatedAt": "2025-07-29T17:33:00"
//     }
// ]

// https://zotly.onrender.com/settings/default-avatars/search?keyword=Jane&page=0&size=10


//Greetings

// https://zotly.onrender.com/settings/greetings/save

// this is the post data 

// {
//   "userId": 1,
//   "title": "Welcome Greeting",
//   "greeting": "Hello, welcome to our site!",
//   "type": "All_Visitors",
//   "visible": true,
//   "createdAt": "2025-07-29T17:33:00",
//   "updatedAt": "2025-07-29T17:33:00"
// }
// https://zotly.onrender.com/settings/greetings/update
// https://zotly.onrender.com/settings/greetings/get/1
// https://zotly.onrender.com/settings/greetings/delete/1
// https://zotly.onrender.com/settings/greetings/clear
// https://zotly.onrender.com/settings/greetings/list
// [
//     {
//         "id": 1,
//         "userId": 1,
//         "title": "Welcome Greeting",
//         "greeting": "Hello, welcome to our site!",
//         "type": "All_Visitors",
//         "visible": true,
//         "createdAt": "2025-07-29T17:33:00",
//         "updatedAt": "2025-07-29T17:33:00"
//     },
//     {
//         "id": 2,
//         "userId": 1,
//         "title": "Welcome Greeting",
//         "greeting": "Hello, welcome to our site!",
//         "type": "All_Visitors",
//         "visible": true,
//         "createdAt": "2025-07-29T17:33:00",
//         "updatedAt": "2025-07-29T17:33:00"
//     }
// ]
// https://zotly.onrender.com/settings/greetings/search?keyword=update&page=0&size=10


//Eye-cathers

// https://zotly.onrender.com/settings/eye-catchers/save
// {
//   "userId": 1,
//   "title": "Special Offer",
//   "text": "Get 20% off today!",
//   "backgroundColor": "#FF0000",
//   "textColor": "#FFFFFF",
//   "imageUrl": "http://example.com/offer.jpg",
//   "createdBy": "Admin",
//   "company": "Example Corp",
//   "createdAt": "2025-07-29T17:33:00",
//   "updatedAt": "2025-07-29T17:33:00"
// }
// this is the reference schema data right 
// https://zotly.onrender.com/settings/eye-catchers/update
// https://zotly.onrender.com/settings/eye-catchers/get/1
// https://zotly.onrender.com/settings/eye-catchers/delete/1
// https://zotly.onrender.com/settings/eye-catchers/clear
// https://zotlt.onrender.com/settings/eye-catchers/list
// listing example 
// [
//     {
//         "id": 2,
//         "userId": 1,
//         "title": "Special Offer",
//         "text": "Get 20% off today!",
//         "backgroundColor": "#FF0000",
//         "textColor": "#FFFFFF",
//         "imageUrl": "http://example.com/offer.jpg",
//         "createdBy": "Admin",
//         "company": "Example Corp",
//         "createdAt": "2025-07-29T17:33:00",
//         "updatedAt": "2025-07-29T17:33:00"
//     }
// ]