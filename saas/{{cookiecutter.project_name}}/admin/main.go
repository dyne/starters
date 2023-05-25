package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"pb/config"
	"pb/hooks"
	_ "pb/migrations"
	"pb/zencode"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	conf, err := config.NewEnv()
	if err != nil {
		panic(err)
	}
	app := pocketbase.New()
	var publicDirFlag string

	// add "--publicDir" option flag
	app.RootCmd.PersistentFlags().StringVar(
		&publicDirFlag,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serve static files
		spa_mode := true // missing routes serve index.html
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS(publicDirFlag), spa_mode))

		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/api/keypairoom-server",
			Handler: func(c echo.Context) error {
				var body map[string]map[string]interface{}

				err := json.NewDecoder(c.Request().Body).Decode(&body)
				if err != nil {
					return err

				}
				hmac, err := zencode.KeypairoomServer(*conf, body["userData"])
				if err != nil {
					return err
				}

				return c.JSON(http.StatusOK, map[string]string{"hmac": hmac})
			},
			Middlewares: []echo.MiddlewareFunc{
				//apis.ActivityLogger(app),
			},
		})
		return nil
	})
	hooks.Register(app)
	jsvm.MustRegisterMigrations(app, &jsvm.MigrationsOptions{})
	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  true,
	})
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}
