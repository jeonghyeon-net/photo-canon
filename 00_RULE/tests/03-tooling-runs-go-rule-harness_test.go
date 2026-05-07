package rules

import (
	"regexp"
	"strings"
	"testing"
)

func TestRuleLefthookRunsFullRepositoryCheckBeforeCommitAndPush(t *testing.T) {
	content := readText(t, "lefthook.yml")
	for _, text := range []string{"pre-commit:", "pre-push:", "mise exec -- npm run check"} {
		if !strings.Contains(content, text) {
			t.Fatalf("lefthook missing %q", text)
		}
	}
}

func TestRuleMisePinsExactNodeGoAndLefthookToolVersions(t *testing.T) {
	content := readText(t, "mise.toml")
	for _, text := range []string{"node = \"24.15.0\"", "lefthook = \"2.1.6\"", "go = \"1.26.0\""} {
		if !strings.Contains(content, text) {
			t.Fatalf("mise missing %q", text)
		}
	}
	if regexp.MustCompile(`disable_tools\s*=.*go`).MatchString(content) {
		t.Fatal("go must not be disabled because 00_RULE uses Go")
	}
}

func TestRulePackageScriptsUseGoRuleHarnessFromRootCheck(t *testing.T) {
	if !exists(t, "go.work") {
		t.Fatal("root go.work is required so Go rule tests run from repo root")
	}
	pkg := readJSON(t, "package.json")
	scripts := pkg["scripts"].(map[string]any)
	if scripts["check:rules"] != "go test ./00_RULE/tests" {
		t.Fatalf("check:rules must use Go rule harness")
	}
	if !strings.Contains(scripts["check"].(string), "check:rules") {
		t.Fatal("root check must include rule checks")
	}
}

func TestRuleRootReadmeExplainsCurrentStackStructureAndCommands(t *testing.T) {
	containsAll(t, "README", "photo-canon", "Cloudflare Workers", "Cloudflare D1", "Capacitor", "go test ./00_RULE/tests", "npm run check")
}
