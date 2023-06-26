define({ "api": [
  {
    "type": "post",
    "url": "http://http://18.191.254.193/user_sendotp",
    "title": "Login",
    "version": "1.0.0",
    "name": "Login",
    "group": "User",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\n{\n\t\"phone\": \"9823456789\",\n\t\"user_type\": \"test@123\",\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "\n{\n    \"success\": true,\n    \"message\": \"Logged in Successfully\",\n    \"payload\": {\n        \"token\": \"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTM0OTFiMzdhNTA4MTE5YzFmNmZmYzUiLCJwYXNzd29yZCI6IiQyYSQwOCRjLzF0cXpuVDltOEgwOEgvV3BVcC9PeVdDMGhyQ3ByUDlLTlJqd1hQd2hxS3RsYy5hRXhEVyIsInVwZGF0ZWRBdCI6IjIwMjEtMDktMDVUMDk6NDU6MjMuMjExWiIsImNyZWF0ZWRBdCI6IjIwMjEtMDktMDVUMDk6NDU6MjMuMjExWiIsInBob25lIjoiMTIzNDU2NzgiLCJfX3YiOjAsImF1dGgiOiIiLCJzdGF0dXMiOiJhY3RpdmUiLCJ1c2VyUm9sZSI6ImFwcHVzZXIiLCJkZXZpY2VUb2tlbiI6IiIsImltYWdlIjoiIiwiY29udGFjdCI6W10sImludGVyZXN0cyI6W10sImlhdCI6MTYzMDgzNTI0OSwiZXhwIjoxNjMxNDQwMDQ5fQ.n1yoAlD6pn74f3xQiUc1zTBqG9Eu6y9Q3iINd3f1vjD0cqd_GUD4KtvrtfyZJ5fF7EK_4mQMQQfO_-XeSQFkJA\",\n        \"userInfo\": {\n            \"_id\": \"613491b37a508119c1f6ffc5\",\n            \"notification\": \"on\",\n            \"phone\": \"12345678\",\n            \"deviceToken\": \"\",\n            \"userRole\": \"appuser\",\n            \"accountType\": \"\",\n            \"bio\": \"\",\n            \"interests\": [],\n            \"image\": \"\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "defaultValue": "true",
            "description": "<p>Request successfully completed.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>{message: 'User not found',success: false}</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "InvalidParamError",
            "description": "<p>{message: 'Invalid parameters were passed.',success: false}</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "AuthenticationTokenNotFound",
            "description": "<p>{ message: 'Authentication token not provided!' , success: false}</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "AuthTokenExpiredError",
            "description": "<p>{ message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}</p>"
          }
        ]
      }
    },
    "filename": "controllers/api.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "http://http://18.191.254.193/signup",
    "title": "Sinup",
    "version": "1.0.0",
    "name": "Signup",
    "group": "User",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\n{\n\t\"phone\": \"9823456789\",\n\t\"user_type\": \"test@123\",\n \"name\":\"asdsa\" \n    \"email\":\"test@test.com\" \n    \"password\":\"2222\"\n    \"device_id\":\"dsfsdfsd\"\n  \t\"device_type\":\"A\" \n    \"device_token\":\"sdfdsfds\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "\n{\n    \"success\": true,\n    \"message\": \"Logged in Successfully\",\n    \"payload\": {\n        \"token\": \"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTM0OTFiMzdhNTA4MTE5YzFmNmZmYzUiLCJwYXNzd29yZCI6IiQyYSQwOCRjLzF0cXpuVDltOEgwOEgvV3BVcC9PeVdDMGhyQ3ByUDlLTlJqd1hQd2hxS3RsYy5hRXhEVyIsInVwZGF0ZWRBdCI6IjIwMjEtMDktMDVUMDk6NDU6MjMuMjExWiIsImNyZWF0ZWRBdCI6IjIwMjEtMDktMDVUMDk6NDU6MjMuMjExWiIsInBob25lIjoiMTIzNDU2NzgiLCJfX3YiOjAsImF1dGgiOiIiLCJzdGF0dXMiOiJhY3RpdmUiLCJ1c2VyUm9sZSI6ImFwcHVzZXIiLCJkZXZpY2VUb2tlbiI6IiIsImltYWdlIjoiIiwiY29udGFjdCI6W10sImludGVyZXN0cyI6W10sImlhdCI6MTYzMDgzNTI0OSwiZXhwIjoxNjMxNDQwMDQ5fQ.n1yoAlD6pn74f3xQiUc1zTBqG9Eu6y9Q3iINd3f1vjD0cqd_GUD4KtvrtfyZJ5fF7EK_4mQMQQfO_-XeSQFkJA\",\n        \"userInfo\": {\n            \"_id\": \"613491b37a508119c1f6ffc5\",\n            \"notification\": \"on\",\n            \"phone\": \"12345678\",\n            \"deviceToken\": \"\",\n            \"userRole\": \"appuser\",\n            \"accountType\": \"\",\n            \"bio\": \"\",\n            \"interests\": [],\n            \"image\": \"\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "defaultValue": "true",
            "description": "<p>Request successfully completed.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>{message: 'User not found',success: false}</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "InvalidParamError",
            "description": "<p>{message: 'Invalid parameters were passed.',success: false}</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "AuthenticationTokenNotFound",
            "description": "<p>{ message: 'Authentication token not provided!' , success: false}</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "AuthTokenExpiredError",
            "description": "<p>{ message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}</p>"
          }
        ]
      }
    },
    "filename": "controllers/api.js",
    "groupTitle": "User"
  }
] });
