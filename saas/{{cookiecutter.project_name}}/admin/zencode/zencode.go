package zencode

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"pb/config"
	"time"
)

const clientTimeout = 10 * time.Second

var dialer = &net.Dialer{
	Timeout:   30 * time.Second,
	KeepAlive: 30 * time.Second,
}
var transport = &http.Transport{
	DisableKeepAlives:     true,
	Proxy:                 http.ProxyFromEnvironment,
	DialContext:           dialer.DialContext,
	ForceAttemptHTTP2:     true,
	MaxIdleConns:          100,
	IdleConnTimeout:       90 * time.Second,
	TLSHandshakeTimeout:   10 * time.Second,
	ExpectContinueTimeout: 1 * time.Second,
}

// from https://pkg.go.dev/net/http#pkg-overview
// Clients and Transports are safe for concurrent use by multiple goroutines
// and for efficiency should only be created once and re-used.
// TODO: Look at https://mauricio.github.io/golang-proxies
var client = &http.Client{
	Timeout: clientTimeout,
	CheckRedirect: func(req *http.Request, via []*http.Request) error {
		return http.ErrUseLastResponse
	},
}

func sendRequest(conf config.Config, contract string, body map[string]interface{}) (io.ReadCloser, error) {
	url := *conf.RestroomURL
	url.Path = fmt.Sprintf("/api/%s", contract)
	datakeys, _ := json.Marshal(map[string]map[string]interface{}{
		"keys": {},
		"data": body,
	})
	req, err := http.NewRequest("POST", url.String(), bytes.NewReader(datakeys))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	return res.Body, nil
}

func KeypairoomServer(conf config.Config, data map[string]interface{}) (string, error) {
	var err error
	jsonData := map[string]interface{}{
		"userData":       data,
		"serverSideSalt": conf.Salt,
	}

	res, err := sendRequest(conf, "keypairoomServer-6-7", jsonData)
	if err != nil {
		return "", err
	}
	var zenroomResult struct {
		HMAC string `json:"seedServerSideShard.HMAC"`
	}
	body, err := io.ReadAll(res)
	if err != nil {
		return "", err
	}

	err = json.Unmarshal(body, &zenroomResult)
	if err != nil {
		return "", err
	}

	return zenroomResult.HMAC, nil
}
