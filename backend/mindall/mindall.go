package mindall

import (
	"mindall-backend/utils"
	"regexp"
	"strconv"
	"strings"
)

func Encode(text string, elems *[]string) string {
	pat := regexp.MustCompile(`[A-Z][a-z]|[A-Z]|[a-z]|[^A-Za-z0-9]|\d+`)
	encoded := utils.MapStringSlice(pat.FindAllString(text, -1), func(s string) string { return encodeChar(s, elems, false) })

	return strings.Join(encoded, " ")
}

func encodeChar(ch string, table *[]string, splitted bool) string {
	if ch == "" || ch == " " {
		return ""
	}

	m, _ := regexp.MatchString("\\d", ch)
	if m {
		return "!" + ch
	}

	index := utils.IndexContainingChar(ch, table)

	if index != -1 {
		encoded := strconv.Itoa(index + 1)
		elem := (*table)[index]

		if len(elem) != len(ch) {
			char_index := strings.Index(elem, ch)
			if char_index == 0 {
				encoded = "." + encoded
			} else if char_index == 1 {
				encoded += "."
			}
		}

		return encoded
	}

	if !splitted && len(ch) != 1 {
		return strings.Join(
			utils.MapStringSlice(strings.Split(ch, ""),
				func(s string) string {
					return encodeChar(s, table, true)
				},
			),
			" ",
		)
	}

	return ch
}

func Decode(text string, table *[]string) string {
	encodedNum := regexp.MustCompile(`!\d+`)
	encodedChar := regexp.MustCompile(`^\.?\d+\.?$`)

	decoded := ""

	for _, c := range strings.Split(text, " ") {
		if c == "" {
			decoded += " "
		} else if encodedNum.MatchString(c) {
			decoded += c[1:]
		} else if encodedChar.MatchString(c) {
			decoded += decodeElem(c, table)
		} else {
			decoded += c
		}
	}

	return decoded
}

func decodeElem(encoded string, table *[]string) string {
	numRE := regexp.MustCompile(`\d+`)
	numMatch := numRE.FindString(encoded)

	if numMatch == "" {
		return encoded
	}

	num, _ := strconv.Atoi(numMatch)

	if num > len(*table) {
		return strconv.Itoa(num)
	}

	elem := (*table)[num-1]

	if strings.Contains(encoded, ".") {
		if strings.HasPrefix(encoded, ".") {
			elem = elem[:1]
		}

		if strings.HasSuffix(encoded, ".") {
			elem = elem[len(elem)-1:]
		}

	}

	return elem
}
