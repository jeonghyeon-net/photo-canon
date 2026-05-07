package rules

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

func TestRuleGitignoreContainsRequiredLocalSecretAndBuildPatterns(t *testing.T) {
	containsAll(t, ".gitignore", ".pi/", ".env", ".env.*", "!.env.example", "node_modules/", "dist/", "01_SERVER/dist-types/", "02_APP/.wrangler/", "*.key")
}

func TestRuleRepositoryDoesNotContainMarkdownExtensionFiles(t *testing.T) {
	for _, file := range walkFiles(t, map[string]bool{".git": true, ".pi": true, "node_modules": true}) {
		if strings.EqualFold(filepath.Ext(file), ".md") {
			t.Fatalf("markdown file is forbidden: %s", relPath(t, file))
		}
	}
}

func TestRuleRepositoryFilesStayUnderMaximumLineCount(t *testing.T) {
	skipDirs := map[string]bool{".git": true, ".pi": true, ".wrangler": true, "dist": true, "dist-types": true, "node_modules": true, "tmp": true}
	skipFiles := map[string]bool{"package-lock.json": true, "worker-configuration.d.ts": true}
	for _, file := range walkFiles(t, skipDirs) {
		if skipFiles[filepath.Base(file)] {
			continue
		}
		content, err := os.ReadFile(file)
		if err != nil {
			t.Fatal(err)
		}
		lines := strings.Count(strings.ReplaceAll(string(content), "\r\n", "\n"), "\n")
		if len(content) > 0 && !strings.HasSuffix(string(content), "\n") {
			lines++
		}
		if lines > 200 {
			t.Fatalf("%s has %d lines", relPath(t, file), lines)
		}
	}
}

func TestRuleTypeScriptDoesNotUseUnsafeTypeAssertions(t *testing.T) {
	unsafe := regexp.MustCompile(`\bas\s+(any|unknown|never)\b`)
	skip := map[string]bool{".git": true, ".pi": true, ".wrangler": true, "dist": true, "dist-types": true, "node_modules": true}
	for _, file := range walkFiles(t, skip) {
		if filepath.Ext(file) != ".ts" {
			continue
		}
		if unsafe.MatchString(string(mustReadFile(t, file))) {
			t.Fatalf("unsafe type assertion: %s", relPath(t, file))
		}
	}
}

func mustReadFile(t *testing.T, path string) []byte {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return content
}
