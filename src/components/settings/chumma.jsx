// Inactivity Timeouts 

// https://zotly.onrender.com/api/v1/settings/inactivity-timeouts -post

//   {
//   "userId": 1,
//   "agentNotRespondingEnabled": true,
//   "agentNotRespondingMinutes": 10,
//   "agentNotRespondingSeconds": 30,
//   "archiveChatEnabled": true,
//   "archiveChatMinutes": 15,
//   "archiveChatSeconds": 0,
//   "visitorInactivityMinutes": 5,
//   "visitorInactivitySeconds": 0,
//   "timeoutMessage": "Chat timed out due to inactivity.",
//   "createdAt": "2025-07-30T15:00:00",
//   "updatedAt": "2025-07-30T15:00:00"
// }

// https://zotly.onrender.com/api/v1/settings/inactivity-timeouts -put 
// https://zotly.onrender.com/api/v1/settings/inactivity-timeouts/1 -get
// https://zotly.onrender.com/api/v1/settings/inactivity-timeouts/1 -delete
// https://zotly.onrender.com/api/v1/settings/inactivity-timeouts -deleteall
// https://zotly.onrender.com/api/v1/settings/inactivity-timeouts - get all 
// https://zotly.onrender.com/api/v1/settings/inactivity-timeouts/search?keyword=timeout&page=0&size=10 - get 


// smart Responses 

//https://zotly.onrender.com/api/v1/settings/smart-responses - post

//  {
//   "userId": 1,
//   "response": "Thank you for contacting us!",
//   "createdBy": "admin",
//   "company": "Example Corp",
//   "createdAt": "2025-07-30T15:00:00",
//   "updatedAt": "2025-07-30T15:00:00",
//   "shortcuts": ["thanks", "contact"],
//   "websites": ["example.com", "support.example.com"]
// }
// take this as a sample data for adding the data right 

//https://zotly.onrender.com/api/v1/settings/smart-responses - put 
//https://zotly.onrender.com/api/v1/settings/smart-responses - get by id
//https://zotly.onrender.com/api/v1/settings/smart-responses/1 - delete
//https://zotly.onrender.com/api/v1/settings/smart-responses - delete all 
//https://zotly.onrender.com/api/v1/settings/smart-responses - get all 
//   [
//   {
//     "id": 2,
//     "userId": 1,
//     "response": "Thank you for contacting us!",
//     "createdBy": "admin",
//     "company": "Example Corp",
//     "createdAt": "2025-07-30T15:00:00",
//     "updatedAt": "2025-07-30T15:00:00",
//     "shortcuts": [
//       "contact",
//       "thanks"
//     ],
//     "websites": [
//       "example.com",
//       "support.example.com"
//     ]
//   },
//   {
//     "id": 3,
//     "userId": 1,
//     "response": "Thank you for contacting us!",
//     "createdBy": "admin",
//     "company": "Example Corp",
//     "createdAt": "2025-07-30T15:00:00",
//     "updatedAt": "2025-07-30T15:00:00",
//     "shortcuts": [
//       "contact",
//       "thanks"
//     ],
//     "websites": [
//       "example.com",
//       "support.example.com"
//     ]
//   }
// ]

// this is the get data for
//https://zotly.onrender.com/api/v1/settings/smart-responses/search?keyword=thank&page=0&size=10 0-  search

// Queued messages : 

//https://zotly.onrender.com/api/v1/settings/queued-messages -post 

//{
//   "userId": 1,
//   "message": "Welcome to our support queue!",
//   "backgroundColor": "#FFFFFF",
//   "textColor": "#000000",
//   "imageUrl": "http://example.com/image.png",
//   "createdBy": "admin",
//   "company": "Example Corp",
//   "createdAt": "2025-07-30T15:00:00",
//   "updatedAt": "2025-07-30T15:00:00"
// }
//https://zotly.onrender.com/api/v1/settings/queued-messages  - put 
//https://zotly.onrender.com/api/v1/settings/queued-messages/1 - get by id
//https://zotly.onrender.com/api/v1/settings/queued-messages /1 - delete
//https://zotly.onrender.com/api/v1/settings/queued-messages  - delete all 
//https://zotly.onrender.com/api/v1/settings/queued-messages  - get all 
//https://zotlt.onrender.com/api/v1/settings/queued-messages/search?keyword=welcome&page=0&size=10 - search 


//Tags 

//https://zotly.onrender.com/api/v1/settings/tags - post
  
// {
//   "userId": 1,
//   "tag": "support",
//   "isDefault": true,
//   "createdBy": "admin",
//   "company": "Example Corp",
//   "createdAt": "2025-07-30T15:00:00",
//   "updatedAt": "2025-07-30T15:00:00"
// }

//this is the sample data for tags 

//https://zotly.onrender.com/api/v1/settings/tags  - put 
//https://zotly.onrender.com/api/v1/settings/tags/1 - get by id
//https://zotly.onrender.com/api/v1/settings/tags /1 - delete
//https://zotly.onrender.com/api/v1/settings/tags  - delete all 
//https://zotly.onrender.com/api/v1/settings/tags  - get all 
//https://zotlt.onrender.com/api/v1/settings/tags/search?keyword=support&page=0&size=10 - search  

// Global Webhooks 


//https://zotly.onrender.com/api/v1/settings/global-webhooks - post
//   {
//   "userId": 1,
//   "event": "NEW_CUSTOMER",
//   "dataTypeEnabled": true,
//   "destination": "BOTH",
//   "email": "test@example.com",
//   "targetUrl": "http://example.com/global-webhook",
//   "createdBy": "admin",
//   "company": "Example Corp",
//   "createdAt": "2025-07-30T15:00:00",
//   "updatedAt": "2025-07-30T15:00:00"
// }
// this the data for post and for other methods like schema right
//https://zotly.onrender.com/api/v1/settings/global-webhooks  - put 
//https://zotly.onrender.com/api/v1/settings/global-webhooks/1 - get by id
//https://zotly.onrender.com/api/v1/settings/global-webhooks /1 - delete
//https://zotly.onrender.com/api/v1/settings/global-webhooks  - delete all 
//https://zotly.onrender.com/api/v1/settings/global-webhooks  - get all 
//https://zotlt.onrender.com/api/v1/settings/global-webhooks/search?keyword=support&page=0&size=10 - search  



// Integrations 


//https://zotly.onrender.com/api/v1/settings/integrations - post
//   {
//   "userId": 1,
//   "service": "ZAPIER",
//   "website": "example.com",
//   "apiKey": "abc123xyz",
//   "isConfigured": true,
//   "createdAt": "2025-07-30T15:00:00",
//   "updatedAt": "2025-07-30T15:00:00"
// }

  // this is the schema for this one and change the code according to it 

//https://zotly.onrender.com/api/v1/settings/integrations  - put 
//https://zotly.onrender.com/api/v1/settings/integrations/1 - get by id
//https://zotly.onrender.com/api/v1/settings/integrations /1 - delete
//https://zotly.onrender.com/api/v1/settings/integrations  - delete all 
//https://zotly.onrender.com/api/v1/settings/integrations  - get all 
//https://zotlt.onrender.com/api/v1/settings/integrations/search?keyword=drift&page=0&size=10 - search  


// Template's 

//https://zotly.onrender.com/api/v1/settings/templates/save - post
// {
//   "userId": 1,
//   "businessCategory": "E-commerce",
//   "businessSubcategory": "Retail",
//   "createdBy": "admin",
//   "createdAt": "2025-07-31T15:50:00",
//   "updatedAt": "2025-07-31T15:50:00"
// }
// this data is for post 
//https://zotly.onrender.com/api/v1/settings/templates/update  - put 
//https://zotly.onrender.com/api/v1/settings/templates/find/1 - get by id
//https://zotly.onrender.com/api/v1/settings/templates/delete/1 - delete
//https://zotly.onrender.com/api/v1/settings/templates/delete/all  - delete all 
//https://zotly.onrender.com/api/v1/settings/templates/all  - get all 
//https://zotlt.onrender.com/api/v1/settings/templates/search?keyword=E-commerce&page=0&size=10 - search 


// GlobalNotifications : 

//https://zotly.onrender.com/api/v1/settings/global-notifcations/save - post
// {
//   "userId": 1,
//   "useSameEmail": true,
//   "notificationsEmail": "notify@example.com",
//   "notifyLead": true,
//   "notifyServiceChat": false,
//   "createdAt": "2025-07-31T15:50:00",
//   "updatedAt": "2025-07-31T15:50:00"
// }
// this is the data below here right
//https://zotly.onrender.com/api/v1/settings/global-notifcations/update  - put 
//https://zotly.onrender.com/api/v1/settings/global-notifcations/find/1 - get by id
//https://zotly.onrender.com/api/v1/settings/global-notifcations/delete/1 - delete
//https://zotly.onrender.com/api/v1/settings/global-notifcations/delete/all  - delete all 
//https://zotly.onrender.com/api/v1/settings/global-notifcations/all  - get all 
//https://zotlt.onrender.com/api/v1/settings/global-notifications/search?keyword=updated@example.com&page=0&size=10 - search
