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

//https://zotly.onrender.com/api/v1/settings/smart-responses/save - post

// {
//     "userId": 1,
//     "response": "Thank you for your inquiry! How can we assist you today?",
//     "shortcuts": ["thanks", "inquiry"],
//     "websites": ["https://example.com", "https://test.com"],
//     "createdBy": "admin",
//     "company": "ExampleCorp",
//     "createdAt": "2025-08-01T15:30:00",
//     "updatedAt": "2025-08-01T15:30:00"
// }
// take this as a sample data for adding the data right 

//https://zotly.onrender.com/api/v1/settings/smart-responses/put - put 
//https://zotly.onrender.com/api/v1/settings/smart-responses/find/1 - get by id
//https://zotly.onrender.com/api/v1/settings/smart-responses/delete/1 - delete
//https://zotly.onrender.com/api/v1/settings/smart-responses/delete/all - delete all 
//https://zotly.onrender.com/api/v1/settings/smart-responses/all - get all 
//https://zotly.onrender.com/api/v1/settings/smart-responses/search?keyword=thanks&page=0&size=10   search

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


// MailTemplate's 

//https://zotly.onrender.com/api/v1/settings/mail-templates/save - post

// {
//   "userId": 1,
//   "name": "Welcome Email",
//   "useCase": "Customer Onboarding",
//   "subject": "Welcome to Our Platform!",
//   "active": true,
//   "createdBy": "admin",
//   "createdAt": "2025-07-31T15:50:00",
//   "modifiedBy": "admin",
//   "modifiedAt": "2025-07-31T15:50:00"
// }

// this is the data for schema for post method 

//https://zotly.onrender.com/api/v1/settings/mail-templates/update  - put 
//https://zotly.onrender.com/api/v1/settings/mail-templates/find/1 - get by id
//https://zotly.onrender.com/api/v1/settings/mail-templates/delete/1 - delete
//https://zotly.onrender.com/api/v1/settings/mail-templates/delete/all  - delete all 
//https://zotly.onrender.com/api/v1/settings/mail-templates/all  - get all 
//https://zotlt.onrender.com/api/v1/settings/mail-templates/search?keyword=welcome&page=0&size=10


// IP Address 

//https://zotly.onrender.com/api/v1/settings/ip-addresses/save - post

//   {
//   "userId": 1,
//   "ipAddress": "192.168.1.1",
//   "createdAt": "2025-07-31T15:50:00",
//   "updatedAt": "2025-07-31T15:50:00"
// }

// this is for post method and this is the schema 

//https://zotly.onrender.com/api/v1/settings/ip-addresses/update  - put 
//https://zotly.onrender.com/api/v1/settings/ip-addresses/find/1 - get by id
//https://zotly.onrender.com/api/v1/settings/ip-addresses/delete/1 - delete
//https://zotly.onrender.com/api/v1/settings/ip-addresses/delete/all  - delete all 
//https://zotly.onrender.com/api/v1/settings/ip-addresses/all  - get all 
//https://zotlt.onrender.com/api/v1/settings/ip-addresses/search?keyword=192.168&page=0&size=10


// Role Permissions

//https://zotly.onrender.com/api/v1/settings/role-permissions/save - post

//  {
//   "userId": 1,
//   "userRole": "ADMIN",
//   "createdAt": "2025-07-31T15:50:00",
//   "updatedAt": "2025-07-31T15:50:00"
// }

// this is the schema 

//https://zotly.onrender.com/api/v1/settings/role-permissions/update  - put 
//https://zotly.onrender.com/api/v1/settings/role-permissions/find/1 - get by id
//https://zotly.onrender.com/api/v1/settings/role-permissions/delete/1 - delete
//https://zotly.onrender.com/api/v1/settings/role-permissions/delete/all  - delete all 
//https://zotly.onrender.com/api/v1/settings/role-permissions/all  - get all 
//https://zotlt.onrender.com/api/v1/settings/role-permissions/search?keyword=admin&page=0&size=10


// Default Avatar 

//https://zotly.onrender.com/settings/default-avatars/save

// {
//   "userId": 1,
//   "name": "John Doe",
//   "jobTitle": "Developer",
//   "avatarImageUrl": "http://example.com/avatar.jpg",
//   "createdAt": "2025-07-29T17:33:00",
//   "updatedAt": "2025-07-29T17:33:00"
// }

//https://zotly.onrender.com/settings/default-avatars/update
//https://zotly.onrender.com/settings/default-avatars/get/1
//https://zotly.onrender.com/settings/default-avatars/delete/1
//https://zotly.onrender.com/settings/default-avatars/clear
//https://zotly.onrender.com/settings/default-avatars/list
//https://zotly.onrender.com/settings/default-avatars/search?keyword=Male&page=0&size=10



//webhooks 

//https://zotly.onrender.com/api/v1/settings/webhooks/save = post 

// {
//     "userId": 1,
//     "event": "CHAT_STARTS",
//     "dataTypes": ["Visitor Info", "Chat Info"],
//     "targetUrl": "https://example.com/webhook",
//     "createdBy": "admin",
//     "company": "ExampleCorp",
//     "createdAt": "2025-08-01T15:30:00",
//     "updatedAt": "2025-08-01T15:30:00"
// } 

//this is the target url right
//https://zotly.onrender.com/api/v1/settings/webhooks/update = put 
//https://zotly.onrender.com/api/v1/settings/webhooks/find/1 = get by id 
//https://zotly.onrender.com/api/v1/settings/webhooks/delete/1 = delete
//https://zotly.onrender.com/api/v1/settings/webhooks/delete/all = delete
//https://zotly.onrender.com/api/v1/settings/webhooks/all   = get 
//https://zotly.onrender.com/api/v1/settings/webhooks/search?keyword=admin&page=0&size=10  =search


//Knowleggebase api's 

// https://zotly.onrender.com/api/v1/settings/knowledge-bases/save - post 

// {
//     "userId": 1,
//     "questionTitle": "How to reset password?",
//     "answerInformation": "To reset your password, click on the 'Forgot Password' link on the login page.",
//     "keywords": "password, reset, login",
//     "websites": ["https://example.com", "https://test.com"],
//     "createdAt": "2025-08-01T15:30:00",
//     "updatedAt": "2025-08-01T15:30:00"
// }

// https://zotly.onrender.com/api/v1/settings/knowledge-bases/update

// https://zotly.onrender/api/v1/settings/knowledge-bases/delete/1
// https://zotly.onrender/api/v1/settings/knowledge-bases/delete/all
// https://zotly.onrender/api/v1/settings/knowledge-bases/all
// https://zotly.onrender/api/v1/settings/knowledge-bases/search?keyword=password&page=0&size=10