package webauthn

import (
	"encoding/json"
	"errors"

	"fmt"
	"log"
	"net/http"

	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tokens"
)

type User struct {
	id          []byte
	email       string
	displayName string
	credentials []webauthn.Credential
}

func NewUser(m *models.Record) *User {

	user := &User{}
	user.id = []byte(m.Id)
	user.email = m.GetString("email")
	user.displayName = m.GetString("email")
	json.Unmarshal([]byte(m.GetString("webauthn_credentials")), &user.credentials)

	return user
}

// WebAuthnID returns the user's ID
func (u User) WebAuthnID() []byte {
	return u.id
}

// WebAuthnName returns the user's username
func (u User) WebAuthnName() string {
	return u.email
}

// WebAuthnDisplayName returns the user's display name
func (u User) WebAuthnDisplayName() string {
	return u.displayName
}

// WebAuthnIcon is not (yet) implemented
func (u User) WebAuthnIcon() string {
	return ""
}

// AddCredential associates the credential to the user
func (u *User) AddCredential(cred webauthn.Credential) {
	u.credentials = append(u.credentials, cred)
}

// WebAuthnCredentials returns credentials owned by the user
func (u User) WebAuthnCredentials() []webauthn.Credential {
	return u.credentials
}

// Could return (nil, nil) which means that the feature is not enabled
func NewWebAuthnFromEnv(app *pocketbase.PocketBase) (*webauthn.WebAuthn, error) {
	record, err := app.Dao().FindFirstRecordByData("features", "name", "webauthn")
	if err != nil {
		return nil, err
	}

	if !record.GetBool("active") {
		return nil, nil
	}

	var envConfig struct {
		DisplayName string `json:"DISPLAY_NAME"`
		RPId        string `json:"RPID"`
		RPOrigin    string `json:"RPORIGINS"`
	}

	err = json.Unmarshal([]byte(record.GetString("envVariables")), &envConfig)
	if err != nil {
		return nil, err
	}

	if envConfig.DisplayName == "" {
		return nil, errors.New("Display name is empty")
	}

	if envConfig.RPId == "" {
		return nil, errors.New("Relying party not set")
	}

	if envConfig.RPOrigin == "" {
		return nil, errors.New("Relying party origin not set")
	}

	wconfig := &webauthn.Config{
		RPDisplayName: envConfig.DisplayName, // Display Name for your site
		RPID:          envConfig.RPId,        // Generally the FQDN for your site
		RPOrigins:     []string{envConfig.RPOrigin},
	}

	w, err := webauthn.New(wconfig)

	return w, nil
}

func storeSessionData(app *pocketbase.PocketBase, userRecord *models.Record, sessionData *webauthn.SessionData) error {
	// Remove old session data
	record, err := app.Dao().FindFirstRecordByData("sessionDataWebauthn", "user", userRecord.Id)
	if record != nil {
		if err := app.Dao().DeleteRecord(record); err != nil {
			return err
		}
	}

	// store session data as marshaled JSON
	sessionStore, err := app.Dao().FindCollectionByNameOrId("sessionDataWebauthn")
	if err != nil {
		return err
	}
	record = models.NewRecord(sessionStore)
	record.Set("user", userRecord.Id)
	record.Set("session", sessionData)

	if err := app.Dao().SaveRecord(record); err != nil {
		return err
	}
	return nil
}

func Register(app *pocketbase.PocketBase) error {
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/webauthn/register/begin/:email",
			Handler: func(c echo.Context) error {
				w, err := NewWebAuthnFromEnv(app)
				if err != nil {
					return err
				}
				if w == nil {
					return apis.NewNotFoundError("Webauthn not enabled", nil)
				}

				email := c.PathParam("email")

				userRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
				if userRecord == nil {
					collection, err := app.Dao().FindCollectionByNameOrId("users")
					if err != nil {
						return err
					}

					userRecord = models.NewRecord(collection)
					userRecord.Set("email", email)
					userRecord.Set("username", email)
					userRecord.RefreshTokenKey()
					if err := app.Dao().SaveRecord(userRecord); err != nil {
						return err
					}
				} else if userRecord.Get("email") != email { // User is logged in
					return apis.NewForbiddenError("Wrong email", nil)
				}

				user := NewUser(userRecord)

				options, sessionData, err := w.BeginRegistration(
					user,
				)

				if err != nil {
					return c.JSON(http.StatusInternalServerError, err.Error())
				}

				err = storeSessionData(app, userRecord, sessionData)

				if err != nil {
					return c.JSON(http.StatusInternalServerError, err.Error())
				}

				return c.JSON(http.StatusOK, options)
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
			},
		})
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/api/webauthn/register/finish/:email",
			Handler: func(c echo.Context) error {
				w, err := NewWebAuthnFromEnv(app)
				if err != nil {
					return err
				}
				if w == nil {
					return apis.NewNotFoundError("Webauthn not enabled", nil)
				}

				email := c.PathParam("email")

				userRecord, err := app.Dao().FindAuthRecordByEmail("users", email)
				if err != nil {
					log.Println(err)
					return err
				}
				user := NewUser(userRecord)
				record, err := app.Dao().FindFirstRecordByData("sessionDataWebauthn", "user", userRecord.Id)
				if err != nil {
					return err
				}
				var sessionData webauthn.SessionData
				json.Unmarshal([]byte(record.GetString("session")), &sessionData)

				credential, err := w.FinishRegistration(user, sessionData, c.Request())
				if err != nil {
					fmt.Println(c.Request())
					return err
				}
				user.AddCredential(*credential)

				userRecord.Set("webauthn_credentials", user.credentials)
				if err := app.Dao().SaveRecord(userRecord); err != nil {
					return err
				}
				if err := app.Dao().DeleteRecord(record); err != nil {
					return err
				}

				return c.JSON(http.StatusOK, make(map[string]interface{}))
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
			},
		})
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/webauthn/login/begin/:email",
			Handler: func(c echo.Context) error {
				w, err := NewWebAuthnFromEnv(app)
				if err != nil {
					return err
				}
				if w == nil {
					return apis.NewNotFoundError("Webauthn not enabled", nil)
				}

				email := c.PathParam("email")
				userRecord, err := app.Dao().FindAuthRecordByEmail("users", email)
				if err != nil {
					return err
				}
				user := NewUser(userRecord)

				// generate PublicKeyCredentialRequestOptions, session data
				options, sessionData, err := w.BeginLogin(user)
				if err != nil {
					return err
				}

				err = storeSessionData(app, userRecord, sessionData)

				if err != nil {
					return c.JSON(http.StatusInternalServerError, err.Error())
				}

				return c.JSON(http.StatusOK, options)
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
			},
		})
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/api/webauthn/login/finish/:email",
			Handler: func(c echo.Context) error {
				w, err := NewWebAuthnFromEnv(app)
				if err != nil {
					return err
				}
				if w == nil {
					return apis.NewNotFoundError("Webauthn not enabled", nil)
				}

				email := c.PathParam("email")
				userRecord, err := app.Dao().FindAuthRecordByEmail("users", email)
				if err != nil {
					return err
				}
				user := NewUser(userRecord)
				record, err := app.Dao().FindFirstRecordByData("sessionDataWebauthn", "user", userRecord.Id)
				if err != nil {
					return err
				}
				var sessionData webauthn.SessionData
				json.Unmarshal([]byte(record.GetString("session")), &sessionData)

				_, err = w.FinishLogin(user, sessionData, c.Request())
				if err != nil {
					return err
				}

				// generate an auth token and return an auth response
				// note: in the future the below will be simplified to just: return api.AuthResponse(c, user)
				token, tokenErr := tokens.NewRecordAuthToken(app, userRecord)
				if tokenErr != nil {
					return errors.New("Failed to create user token")
				}

				return c.JSON(http.StatusOK, map[string]any{
					"token": token,
					"user":  userRecord,
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
			},
		})
		return nil
	})
	return nil
}
