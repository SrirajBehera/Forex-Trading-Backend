
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "Login User",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successful user login by generating access token",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LoginResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/register": {
        "post": {
          "operationId": "AuthController_register",
          "summary": "Register User",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User registered successfully"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/accounts/topup": {
        "post": {
          "operationId": "AccountsController_topUpAccount",
          "summary": "Top up account",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TopUpAccountDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Account top-up successful",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TopUpAccountResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Accounts"
          ]
        }
      },
      "/accounts/balance": {
        "get": {
          "operationId": "AccountsController_getAccountBalance",
          "summary": "Get account balance",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns the account balance",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "balances": {
                        "USD": 1000,
                        "EUR": 500,
                        "GBP": 300
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Accounts"
          ]
        }
      },
      "/fx-rates": {
        "get": {
          "operationId": "FxRatesController_getFxRate",
          "summary": "Get FX rates",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FxRatesDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successful generation of quoteId and expiry time against associated currency-pair exchange rate",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/FxRateResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "FX Rates"
          ]
        }
      },
      "/fx-conversion": {
        "post": {
          "operationId": "FxRatesController_convertFx",
          "summary": "Perform FX conversion",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FxConversionDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Converts amount to specified currency",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/FxConversionResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "FX Rates"
          ]
        }
      }
    },
    "info": {
      "title": "Forex Trading System",
      "description": "Forex Trading System API Documentation",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "LoginDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "LoginResponseDto": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string"
            },
            "email": {
              "type": "string"
            }
          },
          "required": [
            "accessToken",
            "email"
          ]
        },
        "RegisterDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "TopUpAccountDto": {
          "type": "object",
          "properties": {
            "currency": {
              "type": "string"
            },
            "amount": {
              "type": "number"
            }
          },
          "required": [
            "currency",
            "amount"
          ]
        },
        "Map": {
          "type": "object",
          "properties": {}
        },
        "TopUpAccountResponseDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "balances": {
              "$ref": "#/components/schemas/Map"
            }
          },
          "required": [
            "email",
            "balances"
          ]
        },
        "FxRatesDto": {
          "type": "object",
          "properties": {
            "fromCurrency": {
              "type": "string"
            },
            "toCurrency": {
              "type": "string"
            }
          },
          "required": [
            "fromCurrency",
            "toCurrency"
          ]
        },
        "FxRateResponse": {
          "type": "object",
          "properties": {
            "quoteId": {
              "type": "string"
            },
            "expiry_at": {
              "type": "string"
            }
          },
          "required": [
            "quoteId",
            "expiry_at"
          ]
        },
        "FxConversionDto": {
          "type": "object",
          "properties": {
            "quoteId": {
              "type": "string"
            },
            "fromCurrency": {
              "type": "string"
            },
            "toCurrency": {
              "type": "string"
            },
            "amount": {
              "type": "number"
            }
          },
          "required": [
            "quoteId",
            "fromCurrency",
            "toCurrency",
            "amount"
          ]
        },
        "FxConversionResponse": {
          "type": "object",
          "properties": {
            "convertedAmount": {
              "type": "number"
            },
            "currency": {
              "type": "string"
            }
          },
          "required": [
            "convertedAmount",
            "currency"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
