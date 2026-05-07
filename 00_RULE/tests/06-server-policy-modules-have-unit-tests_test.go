package rules

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRuleServerPolicyModulesHaveMatchingUnitTests(t *testing.T) {
	moduleRoot := absPath(t, "01_SERVER/src/modules")
	err := filepath.WalkDir(moduleRoot, func(path string, entry os.DirEntry, err error) error {
		if err != nil || entry.IsDir() || !strings.HasSuffix(entry.Name(), "-policy.ts") {
			return err
		}
		testPath := strings.TrimSuffix(path, "-policy.ts") + "-policy.test.ts"
		if _, statErr := os.Stat(testPath); statErr != nil {
			t.Fatalf("policy test missing: %s", relPath(t, testPath))
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}

func TestRuleServerCheckRunsPolicyUnitTests(t *testing.T) {
	pkg := readJSON(t, "01_SERVER/package.json")
	scripts := pkg["scripts"].(map[string]any)
	if !strings.Contains(scripts["test"].(string), "npm run unit") {
		t.Fatal("server test must run unit tests")
	}
	if !strings.Contains(scripts["unit"].(string), "tsx --test") {
		t.Fatal("server unit script must execute TypeScript unit tests")
	}
}
