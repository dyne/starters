// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2022-2023 Dyne.org foundation <foundation@dyne.org>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

package config

import (
	"errors"
	"fmt"
	"net/url"
	"os"
)

type Config struct {
	Salt        string
	RestroomURL *url.URL
}

// NewEnv() fetches configuration options from the environment.  If
// a required option is not available or is malformed, it will error
// out.
func NewEnv() (*Config, error) {
	c := &Config{}

	s, ok := os.LookupEnv("SALT")
	if !ok {
		return nil, errors.New(`"SALT" must be provided`)
	}
	c.Salt = s

	u, err := fetchURL("RESTROOM_URL")
	if err != nil {
		return nil, err
	}
	c.RestroomURL = u
	return c, nil
}

func fetchURL(env string) (*url.URL, error) {
	s, ok := os.LookupEnv(env)
	if !ok {
		return nil, fmt.Errorf("%q must be provided", env)
	}

	u, err := url.Parse(s)
	if err != nil {
		return nil, fmt.Errorf("%q is malformed: %w", env, err)
	}

	// not a uri, possibly a url
	if u.Scheme == "" || u.Host == "" {
		return nil, fmt.Errorf("%q is malformed: not a url", env)
	}

	if u.Scheme != "http" && u.Scheme != "https" {
		return nil, fmt.Errorf("%q is malformed: invalid scheme; must be http(s)", env)
	}

	// normalize it: take only what we need
	u = &url.URL{
		Scheme: u.Scheme,
		Host:   u.Host,
		Path:   "/",
	}

	return u, nil
}
