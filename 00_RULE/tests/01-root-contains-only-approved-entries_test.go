package rules

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

func TestRuleRootContainsOnlyApprovedEntries(t *testing.T) {
	allowed := map[string]bool{
		".git": true, ".gitignore": true, ".pi": true, "00_RULE": true, "01_SERVER": true,
		"02_APP": true, "99_DOCS": true, "README": true, "go.work": true, "lefthook.yml": true,
		"mise.toml": true, "node_modules": true, "package-lock.json": true, "package.json": true,
	}
	entries, err := os.ReadDir(rootDir(t))
	if err != nil {
		t.Fatal(err)
	}
	for _, entry := range entries {
		if !allowed[entry.Name()] {
			t.Fatalf("unexpected root entry: %s", entry.Name())
		}
	}
}

func TestRuleTopDirectoriesAlwaysHaveReadmeFiles(t *testing.T) {
	for _, dir := range []string{"00_RULE", "01_SERVER", "02_APP", "99_DOCS"} {
		if !exists(t, dir+"/README") {
			t.Fatalf("missing README: %s", dir)
		}
	}
}

func TestRuleHarnessContainsOnlyDescriptiveGoTestFiles(t *testing.T) {
	allowed := regexp.MustCompile(`^(go\.mod|helper\.go|[0-9]{2}-[a-z0-9-]+_test\.go)$`)
	requiredWords := regexp.MustCompile(`[0-9]{2}-[a-z0-9]+(?:-[a-z0-9]+){4,}_test\.go$`)
	entries, err := os.ReadDir(absPath(t, "00_RULE/tests"))
	if err != nil {
		t.Fatal(err)
	}
	for _, entry := range entries {
		if entry.IsDir() || !allowed.MatchString(entry.Name()) {
			t.Fatalf("invalid rule test file: %s", filepath.ToSlash(entry.Name()))
		}
		if strings.HasSuffix(entry.Name(), "_test.go") && !requiredWords.MatchString(entry.Name()) {
			t.Fatalf("rule test filename must describe purpose and outcome: %s", entry.Name())
		}
	}
}
