package rules

import (
	"path/filepath"
	"regexp"
	"testing"
)

func TestRuleFileNamesDescribePurposeAndUseKebabCaseOrToolConvention(t *testing.T) {
	skip := map[string]bool{".git": true, ".pi": true, ".wrangler": true, "dist": true, "dist-types": true, "node_modules": true}
	exact := map[string]bool{".env": true, ".gitignore": true, "README": true, "LICENSE": true}
	kebab := regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*$`)
	goTest := regexp.MustCompile(`^[0-9]{2}-[a-z0-9-]+_test\.go$|^helper\.go$`)
	dotenv := regexp.MustCompile(`^\.(env|dev\.vars)(\.[a-z0-9-]+)*$`)
	for _, file := range walkFiles(t, skip) {
		name := filepath.Base(file)
		valid := exact[name] || kebab.MatchString(name) || goTest.MatchString(name) || dotenv.MatchString(name)
		if !valid {
			t.Fatalf("invalid file name: %s", relPath(t, file))
		}
	}
}
