package slug

import (
	"regexp"
	"strconv"
	"strings"
)

var nonSlugChars = regexp.MustCompile(`[^a-z0-9]+`)

func FromName(name string) string {
	value := strings.ToLower(strings.TrimSpace(name))
	value = nonSlugChars.ReplaceAllString(value, "-")
	value = strings.Trim(value, "-")
	if value == "" {
		return "workspace"
	}
	return value
}

func WithSuffix(base string, suffix int) string {
	if suffix <= 1 {
		return base
	}
	return base + "-" + strconv.Itoa(suffix)
}
