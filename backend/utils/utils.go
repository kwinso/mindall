package utils

import "strings"

func MapStringSlice(vs []string, f func(string) string) []string {
	vsm := make([]string, len(vs))
	for i, v := range vs {
		vsm[i] = f(v)
	}
	return vsm
}

func ReplaceTranslatableCharacters(text string, translationMap map[string]string) string {
	out := text

	for _, c := range strings.Split(text, "") {
		newChar := translationMap[c]
		if translationMap[c] != "" {
			out = strings.ReplaceAll(out, c, newChar)
		}
	}

	return out
}

func IndexContainingChar(char string, data *[]string) int {
	for k, v := range *data {
		if strings.Contains(v, char) {
			return k
		}
	}

	return -1 //not found.
}
