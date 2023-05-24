package zencode

import (
	"pb/config"
	"encoding/json"
	"errors"
	_ "embed"
	zenroom "github.com/dyne/Zenroom/bindings/golang/zenroom"
)

type KeypairoomServerResult struct {
	HMAC string `json:"seedServerSideShard.HMAC"`
}

//go:embed zenflows-crypto/src/keypairoomServer-6-7.zen
var KEYPAIROOM_ZENCODE string;


func KeypairoomServer(conf config.Config, data map[string]interface{}) (string, error) {
	var err error

	jsonData, _ := json.Marshal(map[string]interface{}{
		"userData": data,
		"serverSideSalt": conf.Salt,
	})

	// Verify the signature
	result, success := zenroom.ZencodeExec(KEYPAIROOM_ZENCODE, "", string(jsonData), "")
	if !success {
		return "", errors.New(result.Logs)
	}
	var zenroomResult KeypairoomServerResult
	err = json.Unmarshal([]byte(result.Output), &zenroomResult)
	if err != nil {
		return "", err
	}
	return zenroomResult.HMAC, nil
}
